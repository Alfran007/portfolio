// Centralized portfolio data sourced from resume + AI-focused positioning.

export const profile = {
  name: "Syed Alfran Ali",
  role: "Senior Software Engineer",
  company: "Walmart",
  location: "Bangalore, India",
  email: "syedalfranali@gmail.com",
  phone: "+91-8955530807",
  tagline: "Architecting distributed systems & AI-powered products at planet scale.",
  summary:
    "Senior Software Engineer at Walmart with 7+ years building cloud-native, event-driven platforms across logistics, last-mile delivery, and global freight. Designing systems that move millions of items, dollars, and decisions every day — and increasingly powered by Generative & Agentic AI.",
  socials: {
    github: "https://github.com/Alfran007",
    linkedin: "https://www.linkedin.com/in/alfran/",
    credly: "https://www.credly.com/users/syed-alfran-ali/badges",
    stackoverflow: "https://stackoverflow.com/",
    email: "mailto:syedalfranali@gmail.com",
  },
  resumePath: "/Syed_Alfran_Ali_Resume.pdf",
  photoPath: "/profile.png",
  photoCutoutPath: "/profile_cutout.png",
};

export const experiences = [
  {
    company: "Walmart",
    role: "Senior Software Engineer",
    period: "Nov 2023 – Present",
    location: "Bangalore, India",
    highlights: [
      "Lead development of a product that ships freight capacity on Ocean Carriers, unlocking international transportation for Suppliers, Marketplace, Drop-ship vendors, and Enterprises globally.",
      "Designed & developed LLD and Java APIs for generating and optimizing bulk plans based on booking details and rates.",
      "Built event-driven ADFs with triggers and Cosmos consumer feeds (pub/sub) integrated with Kafka.",
    ],
    stack: ["Java", "Spring Boot", "Kafka", "Azure", "Cosmos DB", "ADF", "Kubernetes"],
  },
  {
    company: "Walmart",
    role: "Software Engineer III",
    period: "Oct 2021 – Nov 2023",
    location: "Bangalore, India",
    highlights: [
      "Contributed to the platform that lets customers check-in and track order readiness in the app while reducing pickup wait times.",
      "Created the Geofence Management System (GMS) improving truck arrival estimations to/from DCs by 8.79%.",
      "Calculated closest DC for trailers using fences to avoid queues and delays — improving driver experience.",
      "Worked closely with PM and architect on API models and system design; shipped containerized Kotlin/Spring services on Cosmos DB.",
    ],
    stack: ["Kotlin", "Spring Boot", "Cosmos DB", "Docker", "Kubernetes", "Azure"],
  },
  {
    company: "Kantar",
    role: "Software Engineer",
    period: "Jun 2019 – Sep 2021",
    location: "Bangalore, India",
    highlights: [
      "Built and maintained REST APIs for micro-services with Spring Boot on Spring MVC architecture.",
      "Owned ETL workflows in Databricks with PySpark; loaded delta tables in Synapse Analytics / Azure Analysis Services.",
      "Developed reusable Apache Superset & MS PowerBI plugins for data visualization.",
      "Hackathon winner — built a generic, platform-independent client-usage tracker for JAVA, .NET, Python integrations.",
    ],
    stack: ["Java", "Spring Boot", "PySpark", "Databricks", "Synapse", "Apache Superset", "PowerBI"],
  },
];

export const skillGroups = [
  {
    title: "AI / GenAI / Agentic",
    color: "from-cyan-400 to-violet-500",
    items: [
      "Generative AI",
      "Agentic AI",
      "LLM Apps",
      "RAG",
      "Vector Search",
      "Prompt Engineering",
      "LangChain",
      "MCP",
      "Computer Vision",
      "ML / Recommenders",
    ],
  },
  {
    title: "Languages",
    color: "from-blue-400 to-cyan-400",
    items: ["Java / J2EE", "Kotlin", "Python", "TypeScript", "SQL / PL-SQL", "C++", "R"],
  },
  {
    title: "Backend & Frameworks",
    color: "from-violet-400 to-fuchsia-500",
    items: [
      "Spring Boot",
      "Spring MVC",
      "Microservices (REST)",
      "Kafka",
      "Event-Driven Arch.",
      "Django",
      "OO Design / Design Patterns",
    ],
  },
  {
    title: "Cloud & DevOps",
    color: "from-fuchsia-400 to-cyan-400",
    items: [
      "Azure",
      "AWS",
      "Kubernetes",
      "Docker",
      "CI/CD",
      "ADF (Azure Data Factory)",
      "Grafana",
      "Splunk",
      "Kibana",
    ],
  },
  {
    title: "Data",
    color: "from-cyan-400 to-blue-500",
    items: [
      "Cosmos DB",
      "MongoDB",
      "Cassandra",
      "PySpark / SQL-Spark",
      "Databricks",
      "Synapse Analytics",
      "Delta Lake",
    ],
  },
  {
    title: "Frontend",
    color: "from-violet-400 to-blue-500",
    items: ["React", "Next.js", "Angular", "Three.js / R3F", "Tailwind", "Framer Motion"],
  },
];

export const projects = [
  {
    title: "Ocean Freight Capacity Platform",
    tag: "Walmart · Senior SWE",
    description:
      "Product that ships freight capacity on Ocean Carriers, unlocking international transport for Suppliers, Marketplace, DSVs, and Enterprises globally. Bulk plan generation & rate optimization powered by Java APIs and Kafka-driven Cosmos pipelines.",
    stack: ["Java", "Spring Boot", "Kafka", "Azure", "Cosmos DB"],
    accent: "cyan",
    size: "wide",
  },
  {
    title: "Geofence Management System (GMS)",
    tag: "Walmart · SWE-III",
    description:
      "Improved truck arrival estimations to/from DCs by 8.79% by computing closest DC via geofences. Kotlin/Spring containerized services on Cosmos DB.",
    stack: ["Kotlin", "Spring Boot", "Cosmos DB", "Kubernetes"],
    accent: "violet",
    size: "tall",
  },
  {
    title: "Customer Pickup & Check-In",
    tag: "Walmart",
    description:
      "Reduced pickup wait times by surfacing live order readiness and customer location pings to store associates.",
    stack: ["Kotlin", "Spring", "Azure"],
    accent: "blue",
    size: "normal",
  },
  {
    title: "Client Usage Tracker (Hackathon Winner)",
    tag: "Kantar",
    description:
      "Generic, platform-independent client-usage tracker integrable across JAVA, .NET, Python frameworks for analytics.",
    stack: ["Java", "Python", ".NET", "Analytics"],
    accent: "fuchsia",
    size: "normal",
  },
  {
    title: "ETL on Databricks + Synapse",
    tag: "Kantar",
    description:
      "Owned ETL pipelines: PySpark transforms, Delta tables, Synapse Analytics + Azure Analysis Services warehouse loads.",
    stack: ["PySpark", "Databricks", "Synapse", "Delta Lake"],
    accent: "cyan",
    size: "normal",
  },
  {
    title: "Gesture Recognition & Mouse Tracker",
    tag: "Research · Computer Vision",
    description:
      "Convex hull–based webcam system that recognizes hand gestures and finger counts to control the mouse.",
    stack: ["Python", "OpenCV", "Computer Vision"],
    accent: "violet",
    size: "normal",
  },
  {
    title: "Music Recommender System",
    tag: "Research · ML",
    description:
      "Collaborative filtering on the Last.fm dataset — combines KNN (memory-based) with ALS (model-based) to recommend artists/songs.",
    stack: ["Python", "KNN", "ALS", "Collaborative Filtering"],
    accent: "blue",
    size: "normal",
  },
  {
    title: "Bus Reservation System",
    tag: "Academic · DBMS",
    description:
      "Spring-MVC/Hibernate app for ticket booking with Google Maps API route visualization and seat availability checks.",
    stack: ["Spring MVC", "Hibernate", "Google Maps API"],
    accent: "fuchsia",
    size: "normal",
  },
];

export const certifications = [
  {
    title: "Microsoft Certified: Azure Solutions Architect Expert",
    issuer: "Microsoft",
    detail: "AZ-300, AZ-304",
  },
  {
    title: "Microsoft Certified: Azure Data & AI Fundamentals",
    issuer: "Microsoft",
    detail: "AI-900, DP-900",
  },
  {
    title: "Implementing an Azure Data Solution",
    issuer: "Microsoft",
    detail: "DP-200",
  },
  {
    title: "Azure Fundamentals",
    issuer: "Microsoft",
    detail: "AZ-900",
  },
];

export const achievements = [
  "Ranked #1 in CS50x Puzzle Day & Coding Contest — 2018–2026, Harvard / HackerRank",
  "Certified participant in CodeChef SnackDown — 2017, 2019, 2021",
  "Silver medalist (×2) & captain — Inter-NIT MST'2K18 chess",
  "Chess team captain, IIIT-Kota (2016–2018)",
  "Open-source & community contributor — Stack Overflow, GitHub",
];

export const education = [
  {
    school: "Indian Institute of Information Technology, Kota",
    degree: "B.Tech, Computer Science",
    period: "Jul 2015 – May 2019",
    detail: "CGPA: 7.82 / 10",
  },
];

export const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#certifications", label: "Certifications" },
  { href: "#contact", label: "Contact" },
];
