"use client";
import { getProjectById } from "@/lib/api/data";
import { Editor } from "@/app/editor/editor";
import { EditableProject } from "@/app/editor/models/editable-project";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default async function Page() {
  const queryParams = useSearchParams();

  const id = queryParams.get("id");

  if (id == undefined) {
    return <>404</>;
  }

  const project = await getProjectById(id);

  return <Editor initialProject={EditableProject.fromInterface(project)} />;
}
