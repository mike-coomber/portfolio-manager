"use client";
import { Editor } from "@/app/editor/editor";

export default function Page({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const id = searchParams.id;

  if (id == undefined) {
    return <>404</>;
  }

  return <Editor newProjectId={id} />;
}
