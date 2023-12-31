"use client";
import { Editor } from "@/app/editor/editor";
import { useSearchParams } from "next/navigation";

export default function Page({}: {}) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (id == undefined) {
    return <>404</>;
  }

  return <Editor newProjectId={id} />;
}
