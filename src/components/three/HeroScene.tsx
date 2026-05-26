"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, ContactShadows } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Hero 3D Scene — Avaturn full-body avatar.
 * Plays baked idle animation; head bone follows cursor with bounded lerp.
 * Spine/hips locked to square so the body stays facing forward.
 * Auto-normalizes any GLB to ~1.75u tall, feet at y≈-1.55 so swapped models
 * still land in the camera frame without per-model tuning.
 */

const AVATAR_URL = "/model_latest.glb";
const TARGET_HEIGHT = 3.0; // world-units; tuned so full body fits camera frame
const FEET_Y = -1.7;
const ANCHOR_X = 1.75; // avatar's world X
// Camera/lookAt sits LEFT of the avatar so the avatar renders RIGHT-of-center
// on the canvas — keeps the empty right column visually occupied without
// fighting the text column on the left.
const CAMERA_X = 0.7;
// Push avatar slightly toward camera so it "pops" out of the screen.
const AVATAR_FORWARD_Z = 0.45;
const CAMERA_BASE_Z = 6.4;

function lerp(x: number, y: number, t: number) {
  return THREE.MathUtils.lerp(x, y, t);
}

function Avatar({
  mouse,
  flash,
}: {
  mouse: { current: { x: number; y: number } };
  flash: { current: number };
}) {
  const { scene, animations } = useGLTF(AVATAR_URL, "/draco/");
  const root = useRef<THREE.Group>(null);
  const { actions, names } = useAnimations(animations, root);
  const headBone = useRef<THREE.Object3D | null>(null);
  const neckBone = useRef<THREE.Object3D | null>(null);
  const spine2Bone = useRef<THREE.Object3D | null>(null);
  const spineBone = useRef<THREE.Object3D | null>(null);
  const hipsBone = useRef<THREE.Object3D | null>(null);
  const baseEmissive = useRef<Map<THREE.MeshStandardMaterial, number>>(new Map());
  const headDrive = useRef({ x: 0, y: 0 });
  const neckDrive = useRef({ x: 0, y: 0 });

  // Auto-fit transform — derived once from the loaded GLB's bounding box so
  // any swapped-in model lands feet-on-floor inside the camera frame.
  const fit = useMemo(() => {
    const candidateNames = [
      ["Head", "head", "mixamorigHead"],
      ["Neck", "neck", "mixamorigNeck"],
      ["Spine2", "spine2", "mixamorigSpine2"],
      ["Spine", "spine", "mixamorigSpine"],
      ["Hips", "hips", "mixamorigHips"],
    ] as const;
    const find = (names: readonly string[]) => {
      for (const n of names) {
        const obj = scene.getObjectByName(n);
        if (obj) return obj;
      }
      return null;
    };
    headBone.current = find(candidateNames[0]);
    neckBone.current = find(candidateNames[1]);
    spine2Bone.current = find(candidateNames[2]);
    spineBone.current = find(candidateNames[3]);
    hipsBone.current = find(candidateNames[4]);

    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        // Self-shadowing on a low-poly avatar produces harsh black bands across
        // the face/torso under rim lighting. Receive floor shadow only.
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        // Recompute normals so any faceted exports render with smooth shading
        // instead of visible polygon seams.
        if (mesh.geometry) {
          mesh.geometry.computeVertexNormals();
          mesh.geometry.normalizeNormals();
        }
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          const mm = m as THREE.MeshStandardMaterial;
          if (mm?.isMaterial) {
            if (mm.emissive) baseEmissive.current.set(mm, mm.emissiveIntensity ?? 0);
            mm.flatShading = false;
            mm.envMapIntensity = 0.7;
            mm.needsUpdate = true;
          }
        });
      }
    });

    // Compute the normalized scale + ground offset once.
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const scale =
      isFinite(size.y) && size.y > 0.001 ? TARGET_HEIGHT / size.y : 1;
    // After scaling, feet sit at (box.min.y * scale) relative to the group
    // origin; offset y so they land at FEET_Y.
    const yOffset = FEET_Y - box.min.y * scale;
    // Center on x/z so the model isn't shifted by its native origin.
    const xOffset = -center.x * scale;
    const zOffset = -center.z * scale;

    return { scale, xOffset, yOffset, zOffset };
  }, [scene]);

  useEffect(() => {
    if (!names.length) return;
    const action = actions[names[0]];
    if (!action) return;
    action.reset().fadeIn(0.5).play();
    action.setLoop(THREE.LoopRepeat, Infinity);
    return () => {
      action.fadeOut(0.3);
    };
  }, [actions, names]);

  useFrame((_, delta) => {
    if (!root.current) return;

    // Head — absolute rotation each frame, fully overrides animation pose.
    if (headBone.current) {
      const scrolled = typeof window !== "undefined" && window.scrollY > 200;
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const maxY = Math.PI / 2.6;
      const maxX = Math.PI / 5.5;
      const targetY = scrolled ? 0 : THREE.MathUtils.clamp(mx, -1, 1) * maxY;
      const targetX = scrolled ? 0 : THREE.MathUtils.clamp(-my, -1, 1) * maxX;
      headDrive.current.y = lerp(headDrive.current.y, targetY, scrolled ? 0.08 : 0.28);
      headDrive.current.x = lerp(headDrive.current.x, targetX, scrolled ? 0.08 : 0.24);
      headBone.current.rotation.x = headDrive.current.x;
      headBone.current.rotation.y = headDrive.current.y;
      headBone.current.rotation.z = 0;
    }

    // Neck — smaller range, absolute.
    if (neckBone.current) {
      const targetNy = mouse.current.x * 0.3;
      const targetNx = -mouse.current.y * 0.15;
      neckDrive.current.y = lerp(neckDrive.current.y, targetNy, 0.18);
      neckDrive.current.x = lerp(neckDrive.current.x, targetNx, 0.18);
      neckBone.current.rotation.x = neckDrive.current.x;
      neckBone.current.rotation.y = neckDrive.current.y;
      neckBone.current.rotation.z = 0;
    }

    // Torso square-to-camera — kill Y twist, dampen X/Z. Leave arms to mixer.
    [hipsBone.current, spineBone.current, spine2Bone.current].forEach((b) => {
      if (!b) return;
      b.rotation.y = 0;
      b.rotation.x *= 0.25;
      b.rotation.z *= 0.25;
    });

    // Click flash — pulse emissive cyan.
    if (flash.current > 0) {
      flash.current = Math.max(0, flash.current - delta * 1.5);
      const boost = flash.current * 1.6;
      baseEmissive.current.forEach((base, mat) => {
        mat.emissive.setRGB(0.05, 0.5, 0.7);
        mat.emissiveIntensity = base + boost;
      });
    } else if (baseEmissive.current.size) {
      baseEmissive.current.forEach((base, mat) => {
        mat.emissiveIntensity += (base - mat.emissiveIntensity) * 0.1;
      });
    }
  });

  return (
    <group
      ref={root}
      position={[ANCHOR_X + fit.xOffset, fit.yOffset, fit.zOffset + AVATAR_FORWARD_Z]}
      scale={fit.scale}
      onClick={(e) => {
        e.stopPropagation();
        flash.current = 1;
      }}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(AVATAR_URL, "/draco/");

function FloorDisc() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.elapsedTime;
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.45 + Math.sin(t * 1.6) * 0.15;
    ringRef.current.rotation.z = t * 0.2;
  });
  return (
    <group position={[ANCHOR_X, FEET_Y, AVATAR_FORWARD_Z]}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 0.96, 96]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[1.05, 1.07, 96]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CameraRig({
  mouse,
}: {
  mouse: { current: { x: number; y: number } };
}) {
  // Look slightly ABOVE mid-body so the avatar shifts visually DOWN in the canvas —
  // gives the "came down a bit" feel while keeping the full body in frame thanks to
  // the extended canvas height (Hero wrapper extends past its section into About).
  const lookY = FEET_Y + TARGET_HEIGHT / 2 + 0.25;
  useFrame((state) => {
    // Wider X/Y parallax + subtle Z bob so the avatar feels like it leans
    // out of the screen as the cursor moves.
    const targetX = CAMERA_X + mouse.current.x * 0.22;
    const targetY = lookY + mouse.current.y * 0.12;
    const targetZ = CAMERA_BASE_Z - mouse.current.y * 0.18 + Math.abs(mouse.current.x) * 0.08;
    state.camera.position.x += (targetX - state.camera.position.x) * 0.06;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.06;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.04;
    state.camera.lookAt(CAMERA_X, lookY, AVATAR_FORWARD_Z * 0.4);
  });
  return null;
}

// Avatar's head appears roughly here on the viewport — used as the origin for
// cursor tracking so the head looks toward the cursor regardless of where on
// screen the cursor is (e.g. over the heading on the left).
// Tuned to match ANCHOR_X=2.2 / CAMERA_X=0.7 / lookY offset / camera z=7.6.
const AVATAR_HEAD_X_FRAC = 0.66;
const AVATAR_HEAD_Y_FRAC = 0.32;

export default function HeroScene() {
  const mouse = useRef({ x: 0, y: 0 });
  const flash = useRef(0);
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const xFrac = e.clientX / window.innerWidth;
      const yFrac = e.clientY / window.innerHeight;

      // Anchor (0,0) at the avatar's on-screen head position. Piecewise
      // normalize so cursor at any screen edge maps to ±1.
      const xOff = xFrac - AVATAR_HEAD_X_FRAC;
      const xNorm =
        xOff < 0
          ? xOff / AVATAR_HEAD_X_FRAC
          : xOff / (1 - AVATAR_HEAD_X_FRAC);

      const yOff = yFrac - AVATAR_HEAD_Y_FRAC;
      // Invert Y so cursor ABOVE head → positive mouse.y (matches the
      // downstream `targetX = -my * maxX` convention: tilts head UP).
      const yNorm =
        yOff < 0
          ? -yOff / AVATAR_HEAD_Y_FRAC
          : -yOff / (1 - AVATAR_HEAD_Y_FRAC);

      mouse.current.x = THREE.MathUtils.clamp(xNorm, -1, 1);
      mouse.current.y = THREE.MathUtils.clamp(yNorm, -1, 1);
    };
    window.addEventListener("mousemove", handleMouse);
    const hide = setTimeout(() => setHint(false), 4500);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      clearTimeout(hide);
    };
  }, []);

  return (
    <div
      className="relative w-full h-full"
      style={{ background: "transparent" }}
      onClick={() => {
        flash.current = 1;
        setHint(false);
      }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [CAMERA_X, 0.45, CAMERA_BASE_Z], fov: 34 }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
        shadows
      >
        <color attach="background" args={[0, 0, 0]} />

        <ambientLight intensity={0.85} color="#3a3760" />
        <hemisphereLight args={["#e8ecff", "#2a2444", 0.75]} />
        {/* Key light — sculpts the front of the avatar (no shadow casting, so it
            doesn't carve dark bands across the face). */}
        <directionalLight position={[ANCHOR_X + 0.5, 4, 3]} intensity={1.4} color="#ffffff" />

        {/* RIM / BACK lights — sit BEHIND the avatar to glow along the
            silhouette edges. Physically-accurate decay=2 + wide distance so the
            falloff is smooth across skin (no harsh banding/lines on the face). */}
        <pointLight position={[ANCHOR_X - 1.8, 2.0, -2.4]} intensity={4.5} color="#22d3ee" distance={16} decay={2} />
        <pointLight position={[ANCHOR_X + 1.8, 1.6, -2.4]} intensity={4.2} color="#d946ef" distance={16} decay={2} />
        <pointLight position={[ANCHOR_X, 0.4, -2.8]} intensity={2.0} color="#8b5cf6" distance={14} decay={2} />

        {/* Front fills — soft volumetric color wash, weaker than rims so the
            silhouette stays the brightest edge. */}
        <pointLight position={[ANCHOR_X + 2.2, 0.4, 1.8]} intensity={2.6} color="#8b5cf6" distance={12} />
        <pointLight position={[ANCHOR_X - 1.5, 3, 1]} intensity={2.0} color="#3b82f6" distance={12} />
        <pointLight position={[ANCHOR_X - 1.5, 1.5, 4]} intensity={1.9} color="#ffffff" distance={10} />
        <spotLight
          position={[ANCHOR_X - 1.5, 5, 3]}
          angle={0.6}
          penumbra={0.8}
          intensity={2.4}
          color="#ffffff"
          distance={14}
        />

        {/* Suspense fallback intentionally null — WelcomeLoader covers the
            initial paint, and the dynamic() wrapper around HeroScene already
            shows a soft glow pulse. A text fallback here would float in the
            middle of the full-bleed canvas and overlap sections far below
            the Hero when the user refreshes while scrolled. */}
        <Suspense fallback={null}>
          <Avatar mouse={mouse} flash={flash} />
          <ContactShadows
            position={[ANCHOR_X, FEET_Y, AVATAR_FORWARD_Z]}
            opacity={0.85}
            scale={5.5}
            blur={2.6}
            far={3}
            color="#000000"
          />
        </Suspense>

        <FloorDisc />
        <CameraRig mouse={mouse} />

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.7}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.92}
            mipmapBlur
          />
          <ChromaticAberration offset={[0.0003, 0.0005] as unknown as [number, number]} />
          <Vignette eskil={false} offset={0.2} darkness={0.65} />
        </EffectComposer>
      </Canvas>

      {hint && (
        <div className="pointer-events-none absolute bottom-6 right-6 font-mono text-[10px] tracking-[0.3em] uppercase text-cyan-300/60 animate-pulse">
          ◉ I follow your cursor
        </div>
      )}
    </div>
  );
}
