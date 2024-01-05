"use client";
import { ProjectInterface } from "@/lib/api/interfaces";
import { ProjectCard } from "./project-card";
import { ReactElement, useContext, useEffect, useState } from "react";
import { NewProjectDialog } from "./new-project-dialog";
import { getProjectsSnapshot } from "@/lib/api/data";
import { AuthContext } from "@/lib/providers/auth-provider";

export function ProjectsGrid({
  initialProjects,
}: {
  initialProjects: ProjectInterface[];
}) {
  const user = useContext(AuthContext);

  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [projects, setProjects] = useState(initialProjects);

  useEffect(() => {
    if (user) {
      const unsubscribe = getProjectsSnapshot((data) => setProjects(data))
        .data!;
      return () => {
        unsubscribe();
      };
    }
  }, []);

  const tiles = projects.map((project) => (
    <ProjectCard
      key={project.id}
      projectName={project.name}
      projectId={project.id}
      projectImage={project.image}
    />
  ));

  tiles.push(
    <div
      className="flex items-center justify-center cursor-pointer w-full h-full border-dashed border-black border-2 rounded-lg  aspect-square"
      onClick={() => setNewProjectDialogOpen(true)}
    >
      Add Project
    </div>
  );

  return (
    <>
      <div
        className={`grid auto-rows-fr sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4`}
      >
        {tiles.map((tile, index) => (
          <GridItem key={index}>{tile}</GridItem>
        ))}
      </div>
      <NewProjectDialog
        open={newProjectDialogOpen}
        setOpen={setNewProjectDialogOpen}
        allProjects={projects}
      />
    </>
  );
}

function GridItem({ children }: { children: ReactElement }) {
  return <div className="flex flex-1 p-8">{children}</div>;
}
