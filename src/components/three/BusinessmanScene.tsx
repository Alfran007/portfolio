"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Html, ContactShadows } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useIsMobile } from "@/lib/useIsMobile";

/**
 * Businessman model for the Contact section. The shipped GLB is a STATIC mesh
 * (no skeleton, no head bone, no animation) so cursor reactivity is expressed
 * as a subtle whole-body sway. Auto-normalizes the GLB bounding box so the
 * model fits the canvas regardless of native scale.
 */

const MODEL_URL = "/businessman.glb";
const TARGET_HEIGHT = 2.6;
const FEET_Y = -1.3;
// GLB's native forward axis is +X. Rotate -90° around Y so the model faces
// the camera at rest, then layer cursor sway on top of this base.
const BASE_Y_ROTATION = -Math.PI / 2;

function lerp(a: number, b: number, t: number) {
  return THREE.MathUtils.lerp(a, b, t);
}

function BusinessmanModel({ mouse }: { mouse: { current: { x: number; y: number } } }) {
  const { scene } = useGLTF(MODEL_URL, "/draco/");
  const group = useRef<THREE.Group>(null);
  // Counts useFrame ticks so we can dispatch `contact-ready` after the
  // Canvas has actually flushed a few frames to screen (not just at the
  // moment React commits — at that point the WebGL context exists but
  // nothing has painted yet). Three frames is enough that the
  // BusinessmanScene is visually live, so WelcomeLoader can safely fold
  // it into the initial loading window and dismiss.
  const readyFrames = useRef(0);
  const readyFired = useRef(false);

  const fit = useMemo(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        // Smooth shading: recompute per-vertex normals so faceted exports
        // render with soft interpolated lighting.
        if (mesh.geometry) {
          mesh.geometry.computeVertexNormals();
          mesh.geometry.normalizeNormals();
        }
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          const mm = m as THREE.MeshStandardMaterial;
          if (mm?.isMaterial) {
            mm.side = THREE.DoubleSide;
            mm.flatShading = false;
            mm.envMapIntensity = 0.65;
            mm.needsUpdate = true;
          }
        });
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        mesh.frustumCulled = false;
      }
    });

    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const scale = isFinite(size.y) && size.y > 0.001 ? TARGET_HEIGHT / size.y : 1;
    const yOffset = FEET_Y - box.min.y * scale;
    const xOffset = -center.x * scale;
    const zOffset = -center.z * scale;
    return { scale, xOffset, yOffset, zOffset };
  }, [scene]);

  // Snap to front-facing on mount so it doesn't lerp from 0 (which briefly
  // showed the side profile at load).
  useEffect(() => {
    if (group.current) {
      group.current.rotation.y = BASE_Y_ROTATION;
    }
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    // Reactive whole-body sway around the front-facing base.
    const targetY = BASE_Y_ROTATION + mouse.current.x * 0.6 + Math.sin(t * 0.5) * 0.03;
    const targetX = mouse.current.y * 0.32;
    group.current.rotation.y = lerp(group.current.rotation.y, targetY, 0.22);
    group.current.rotation.x = lerp(group.current.rotation.x, targetX, 0.22);

    // Once the model has rendered three frames, tell the welcome loader
    // it can dismiss — Contact's heavy assets are now live on screen.
    if (!readyFired.current) {
      readyFrames.current += 1;
      if (readyFrames.current >= 3) {
        readyFired.current = true;
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("contact-ready"));
        }
      }
    }
  });

  return (
    <group
      ref={group}
      position={[fit.xOffset, fit.yOffset, fit.zOffset]}
      scale={fit.scale}
      rotation={[0, BASE_Y_ROTATION, 0]}
    >
      <primitive object={scene} />
    </group>
  );
}

// Preload the GLB at module init. Safe to do here now because:
//   1. Contact mounts eagerly on desktop (no LazySection), so its
//      `<BusinessmanScene />` dynamic import triggers this module to
//      evaluate during the initial loader window — the GLB download is
//      part of the gated load, not an afterthought.
//   2. Mobile drops the entire BusinessmanScene block from Contact's JSX,
//      so this module is never imported on phones. No mobile data wasted.
//   3. WelcomeLoader holds the curtain until `contact-ready` fires (see
//      `useFrame` above), so the user never sees the page until the
//      avatar is on screen — no mid-scroll fetch/parse stutter.
useGLTF.preload(MODEL_URL, "/draco/");

function Loading() {
  return (
    <Html center>
      <div className="font-mono text-[10px] tracking-widest text-cyan-300/70 flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
        LOADING MODEL…
      </div>
    </Html>
  );
}

export default function BusinessmanScene({ cameraZ = 4.6 }: { cameraZ?: number }) {
  const mouse = useRef({ x: 0, y: 0 });
  const isMobile = useIsMobile();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      className="relative w-full h-full pointer-events-none select-none"
      style={{
        WebkitTapHighlightColor: "transparent",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        outline: "none",
      }}
    >
      <Canvas
        // Re-mount when breakpoint flips so DPR / antialias settings actually
        // take effect on the new GPU profile (Canvas reads these props only
        // at mount time).
        key={isMobile ? "m" : "d"}
        gl={{ alpha: true, antialias: !isMobile }}
        camera={{ position: [0, 0.2, cameraZ], fov: 32 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        style={{
          background: "transparent",
          WebkitTapHighlightColor: "transparent",
          outline: "none",
        }}
      >
        <ambientLight intensity={0.85} color="#ffffff" />
        <hemisphereLight args={["#dde6ff", "#1f1a33", 0.7]} />
        <directionalLight position={[2, 3, 4]} intensity={1.4} color="#ffffff" />
        <pointLight position={[-2.5, 1.5, 2.5]} intensity={1.6} color="#22d3ee" distance={10} decay={2} />
        <pointLight position={[2.5, -0.5, 2.5]} intensity={1.4} color="#8b5cf6" distance={10} decay={2} />
        <pointLight position={[0, 0, 5]} intensity={0.9} color="#ffffff" distance={10} decay={2} />

        <Suspense fallback={<Loading />}>
          <BusinessmanModel mouse={mouse} />
          <ContactShadows
            position={[0, FEET_Y, 0]}
            opacity={0.5}
            scale={4}
            blur={2.4}
            far={2.5}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
