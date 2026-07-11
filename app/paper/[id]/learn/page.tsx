import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPaper } from "@/lib/data/papers";
import { CourseView } from "@/features/learn/course-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const paper = getPaper(id);
  return { title: paper ? `${paper.course.title} — mini course` : "Course not found" };
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paper = getPaper(id);
  if (!paper) notFound();

  return <CourseView paper={paper} />;
}
