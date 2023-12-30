"use client";
import { Editor } from "@/app/editor/editor";
import { EditableProject } from "@/app/editor/models/editable-project";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const queryParams = useSearchParams();

  const id = queryParams.get("id");

  if (id == undefined) {
    return <>404</>;
  }

  const newProject = EditableProject.fromId(id);

  return <Editor initialProject={newProject} />;
}
