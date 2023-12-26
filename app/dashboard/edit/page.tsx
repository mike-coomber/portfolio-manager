"use client";
import { ProjectsContext } from "@/app/context/contexts";
import { ProjectModel } from "@/app/data/project-model";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Editor } from "../editor/editor";

export default function Page() {
  const { allProjects } = useContext(ProjectsContext);
  const [project, setProject] = useState<ProjectModel>();
  const queryParams = useSearchParams();

  useEffect(() => {
    const id = queryParams.get("id");
    const match = allProjects.find((work) => work.id == id);

    if (match != undefined) {
      setProject({ ...match }); // Copy project by value so the original is not modified
    }
  }, []);

  if (project == undefined) {
    return <>404</>;
  }

  return <Editor initialProject={project} />;
}
