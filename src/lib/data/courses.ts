// Empty until a real course exists; /courses is also out of the nav and sitemap.
export type Course = {
  title: string;
  description: string;
  status: "Coming soon" | "In development" | "Available";
};

export const courses: Course[] = [];
