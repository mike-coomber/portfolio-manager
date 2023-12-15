"use client";
import { useEffect, useState } from "react";
import { ProjectsContext } from "../context/contexts";
import { getAllWork } from "../api/api";
import { ProjectModel } from "../data/project-model";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ProjectModel[]>([]);

  useEffect(() => {
    getAllWork().then((work) => {
      setProjects(work);
    });
  }, []);

  return (
    <ProjectsContext.Provider value={projects}>
      {children}
    </ProjectsContext.Provider>
  );
}
