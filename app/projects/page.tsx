"use client";

import { ReactElement, useContext, useState } from "react";
import { ProjectCard } from "./components/project-card";
import { NewProjectDialog } from "./components/new-project-dialog";
import { ProjectsContext } from "@/context/contexts";

export default function Page() {
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

  const { allProjects } = useContext(ProjectsContext);

  const tiles = allProjects.map((projectModel) => (
    <ProjectCard key={projectModel.id} data={projectModel} />
  ));

  tiles.push(<NewProjectTile onClick={() => setNewProjectDialogOpen(true)} />);

  return (
    <>
      <div className={`grid auto-rows-fr md:grid-cols-3 sm:grid-cols-1 gap-4`}>
        {tiles.map((tile, index) => (
          <GridItem key={index}>{tile}</GridItem>
        ))}
      </div>
      <NewProjectDialog
        open={newProjectDialogOpen}
        setOpen={setNewProjectDialogOpen}
      />
    </>
  );
}

function GridItem({ children }: { children: ReactElement }) {
  return <div className="flex flex-1 p-8">{children}</div>;
}

function NewProjectTile({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="flex items-center justify-center cursor-pointer w-full h-full border-dashed border-black border-2 rounded-lg  aspect-square"
      onClick={onClick}
    >
      Add Project
    </div>
  );
}
