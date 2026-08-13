// Placeholder job history — replace with your real roles.
export type Role = {
  title: string;
  org: string;
  period: string;
  summary: string;
  highlights: string[];
};

export const experience: Role[] = [
  {
    title: "Independent Consultant",
    org: "Self-employed",
    period: "20XX — Present",
    summary: "Infrastructure automation and platform engineering for small and mid-size teams.",
    highlights: [
      "Replace this with a real engagement summary",
      "Add measurable outcomes (uptime, deploy time, cost)",
    ],
  },
  {
    title: "Your previous role",
    org: "Company name",
    period: "20XX — 20XX",
    summary: "One-line description of what you owned.",
    highlights: [
      "Key achievement #1",
      "Key achievement #2",
    ],
  },
];

export const skills: string[] = [
  "Linux / NixOS",
  "CI/CD",
  "Infrastructure as Code",
  "Networking",
  "Secrets Management",
  "DevOps Automation",
];
