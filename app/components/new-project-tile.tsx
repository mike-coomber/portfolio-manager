"use client";

import { useEffect, useState } from "react";
import { NewProjectDialog } from "./new-project-dialog";
import { getAllProjects } from "@/lib/api/data";
import { ProjectInterface } from "@/lib/api/interfaces";

export function NewProjectTile() {
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [allProjects, setAllProjects] = useState<ProjectInterface[]>([]);

  useEffect(() => {
    getAllProjects().then((projects) => setAllProjects(projects));
  }, []);

  return (
    <>
      <div
        className="flex items-center justify-center cursor-pointer w-full h-full border-dashed border-black border-2 rounded-lg  aspect-square"
        onClick={() => setNewProjectDialogOpen(true)}
      >
        Add Project
      </div>
      <NewProjectDialog
        open={newProjectDialogOpen}
        setOpen={setNewProjectDialogOpen}
        allProjects={allProjects}
      />
    </>
  );
}
