"use client";
import { Editor } from "@/app/editor/editor";
import { ProjectModel } from "@/data/project-model";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const queryParams = useSearchParams();

  const id = queryParams.get("id");

  if (id == undefined) {
    return <>404</>;
  }

  const newProject = ProjectModel.fromId(id);

  return <Editor initialProject={newProject} />;
}
