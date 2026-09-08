import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume & Curriculum Vitae",
  description:
    "Official resume and background of Parth Khansali — Computer Science student at Graphic Era Hill University, builder, and Director General of Graphic Era MUN Club.",
  alternates: {
    canonical: "/resume",
  },
  openGraph: {
    title: "Resume & Curriculum Vitae — Parth Khansali",
    description:
      "Official resume and background of Parth Khansali — Computer Science student at Graphic Era Hill University, builder, and Director General of Graphic Era MUN Club.",
    url: "https://parthkhansali.com/resume",
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
