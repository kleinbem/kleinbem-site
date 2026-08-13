// Edit these to point at your real profiles.
export type LinkEntry = {
  label: string;
  url: string;
  category: "Professional" | "Code" | "Social";
  hint?: string;
};

export const links: LinkEntry[] = [
  { label: "LinkedIn", url: "https://linkedin.com/in/your-handle", category: "Professional", hint: "Work history & recommendations" },
  { label: "GitHub", url: "https://github.com/kleinbem", category: "Code", hint: "Open-source & personal projects" },
  { label: "Email", url: "mailto:martin.kleinberger@gmail.com", category: "Professional", hint: "Direct contact" },
  { label: "Resume / CV", url: "/experience", category: "Professional", hint: "Full experience on this site" },
  { label: "X / Twitter", url: "https://x.com/your-handle", category: "Social" },
  { label: "Mastodon", url: "https://mastodon.social/@your-handle", category: "Social" },
];
