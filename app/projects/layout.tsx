"use client";
import { useEffect, useState } from "react";
import { ProjectsContext } from "../context/contexts";
import { getAllWork } from "../api/api";
import { ProjectModel } from "../data/project-model";

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
