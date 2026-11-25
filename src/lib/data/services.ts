export type Service = {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  target: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

export const services: Service[] = [
  {
    id: "infrastructure-automation",
    title: "Infrastructure Automation & Declarative Systems",
    description:
      "End-to-end automation turning mutable, ad-hoc server setups into declarative, reproducible codebases. Eliminate configuration drift and ensure every deployment is auditable and rollback-safe.",
    deliverables: [
      "Declarative NixOS and Linux fleet configurations",
      "Modular OpenTofu / Terraform infrastructure-as-code",
      "Hermetic CI/CD pipelines with automated validation and linting",
      "Disaster recovery workflows and deterministic server provisioning",
    ],
    target: "Engineering teams struggling with environment drift, fragile shell scripts, or manual server maintenance.",
  },
  {
    id: "platform-devops",
    title: "Platform & DevOps Consulting",
    description:
      "Hands-on architectural guidance and platform engineering to give your product engineers reproducible development environments and dependable production releases.",
    deliverables: [
      "Container fleet architectures and edge service deployments",
      "GitOps-driven continuous deployment pipelines",
      "Encrypted secrets management (SOPS, age, hardware-backed keys)",
      "System observability, structured logging, and proactive alerting",
    ],
    target: "Growing engineering organizations needing a robust, low-maintenance platform without ballooning cloud overhead.",
  },
  {
    id: "migration-modernization",
    title: "Migration & Modernization",
    description:
      "Structured, low-risk migrations from legacy snowflake servers to modern, version-controlled infrastructure with zero unnecessary downtime.",
    deliverables: [
      "Legacy Linux (Ubuntu / Debian) to declarative NixOS migrations",
      "Cloud-to-hybrid or bare-metal repatriation strategies",
      "Zero-trust mesh network architecture (NetBird, WireGuard, Cloudflare)",
      "System hardening, attack surface reduction, and security compliance",
    ],
    target: "Organizations looking to eliminate technical debt, reduce infrastructure bills, or regain complete control of their stack.",
  },
];

export const faqs: FAQ[] = [
  {
    question: "Why choose declarative infrastructure (Nix / NixOS / OpenTofu) over traditional configuration?",
    answer:
      "Traditional imperative setups (like manual bash scripts or mutable VMs) degrade over time due to configuration drift, untracked changes, and dependency rot. Declarative systems define the complete state of a machine in version-controlled code, allowing atomic upgrades, instant rollbacks, and bit-for-bit reproducible environments across staging and production.",
  },
  {
    question: "How are consulting engagements structured?",
    answer:
      "Engagements are flexible to match your project needs: ongoing advisory retainers for team guidance, fixed-scope implementation projects for specific deliverables (e.g. migrating a fleet to NixOS or automating CI/CD), or one-off architectural and security audits.",
  },
  {
    question: "Can you work with our existing cloud provider or bare-metal setup?",
    answer:
      "Yes. I design infrastructure that meets you where you are, whether running on AWS, GCP, Hetzner, self-hosted bare metal, or hybrid edge setups. Using provider-agnostic tooling like OpenTofu, container orchestrators, and Nix ensures you retain portability without vendor lock-in.",
  },
  {
    question: "What does an initial infrastructure audit include?",
    answer:
      "An infrastructure audit evaluates your configuration reproducibility, deployment pipeline reliability, secrets management, and access controls. You receive a concrete assessment of operational risks, bottlenecks, and a step-by-step roadmap to modernize your architecture.",
  },
  {
    question: "How do we begin an engagement?",
    answer:
      "Start by getting in touch via email. We will schedule a brief introductory call to review your current infrastructure challenges, establish alignment, and propose an actionable scope of work.",
  },
];
