"use client";

import { useContext } from "react";
import { ProjectCard } from "./components/work-card";
import { ProjectsContext } from "../context/contexts";

export default function Page() {
  const projects = useContext(ProjectsContext);

  return (
    <div>
      {projects.map((projectModel) => (
        <ProjectCard key={projectModel.id} data={projectModel} />
      ))}
    </div>
  );
}
