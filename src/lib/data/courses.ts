// Placeholder course catalogue — replace with real course content once ready.
export type Course = {
  title: string;
  description: string;
  status: "Coming soon" | "In development" | "Available";
};

export const courses: Course[] = [
  {
    title: "Course title goes here",
    description:
      "One or two sentences describing what this course covers, who it's for, and the outcome.",
    status: "Coming soon",
  },
];
