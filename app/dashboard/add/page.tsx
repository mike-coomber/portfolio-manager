"use client";
import { useSearchParams } from "next/navigation";
import { Editor } from "../editor/editor";
import { ProjectModel } from "@/app/data/project-model";

export default function Page() {
  const queryParams = useSearchParams();

  const id = queryParams.get("id");

  if (id == undefined) {
    return <>404</>;
  }

  const newProject = ProjectModel.fromId(id);

  return <Editor initialProject={newProject} />;
}
