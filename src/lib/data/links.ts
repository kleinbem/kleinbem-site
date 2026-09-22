// Edit these to point at your real profiles.
export type LinkEntry = {
  label: string;
  url: string;
  category: "Professional" | "Code" | "Writing" | "Social";
  hint?: string;
};

export const links: LinkEntry[] = [
  // LinkedIn and Mastodon removed 2026-09-14 — both still pointed at the
  // scaffold's literal "your-handle" placeholder, i.e. live broken links on
  // the homepage. Re-add once real profile URLs exist.
  { label: "GitHub", url: "https://github.com/kleinbem", category: "Code", hint: "Open-source & personal projects" },
  { label: "Email", url: "mailto:martin.kleinberger@kleinbem.dev", category: "Professional", hint: "Direct contact" },
  { label: "Resume / CV", url: "/experience", category: "Professional", hint: "Full experience on this site" },
  { label: "Substack", url: "https://kleinbem.substack.com", category: "Writing", hint: "Newsletter — notes & long-form writing" },
  { label: "X / Twitter", url: "https://x.com/kleinbem", category: "Social" },
];
