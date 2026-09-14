export type Service = {
  title: string;
  description: string;
};

export const services: Service[] = [
  {
    title: "Infrastructure Automation",
    description:
      "Reproducible system configuration, CI/CD pipelines, and deployment automation that cuts manual toil.",
  },
  {
    title: "Platform & DevOps Consulting",
    description:
      "Advisory and hands-on work to make your infrastructure more reliable, observable, and easier to maintain.",
  },
  {
    title: "Migration & Modernization",
    description:
      "Moving legacy setups to reproducible, version-controlled infrastructure with minimal downtime.",
  },
];
