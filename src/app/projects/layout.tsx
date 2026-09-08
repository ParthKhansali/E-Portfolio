import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects & Engineering Builds",
  description:
    "Explore software projects built by Parth Khansali across AI systems, mobile applications, distributed workflows, and developer tooling.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects & Engineering Builds — Parth Khansali",
    description:
      "Explore software projects built by Parth Khansali across AI systems, mobile applications, distributed workflows, and developer tooling.",
    url: "https://parthkhansali.com/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
