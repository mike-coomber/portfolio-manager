"use client";
import { getAllWork } from "@/api/api";
import { ProjectsContext } from "@/context/contexts";
import { ProjectModel } from "@/data/project-model";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [allProjects, setAllProjects] = useState<ProjectModel[]>([]);

  useEffect(() => {
    getAllWork().then((work) => {
      setAllProjects(work);
    });
  }, []);

  return (
    <ProjectsContext.Provider value={{ allProjects, setAllProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
}
