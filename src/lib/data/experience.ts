// Empty until real roles are written up: the page, /api/experience and MCP
// get_experience all read this list.
export type Role = {
  title: string;
  org: string;
  period: string;
  summary: string;
  highlights: string[];
};

export const experience: Role[] = [];

export const skills: string[] = [
  "Linux / NixOS",
  "CI/CD",
  "Infrastructure as Code",
  "Networking",
  "Secrets Management",
  "DevOps Automation",
];
