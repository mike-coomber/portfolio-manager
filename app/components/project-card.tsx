"use client";
import Image from "next/image";
import { Typography } from "@material-tailwind/react";
import Link from "next/link";
import { useState } from "react";
import { deleteProject } from "@/lib/api/data";
import toast from "react-hot-toast";
import { ImageInterface } from "@/lib/api/interfaces";
import { ConfirmationDialog } from "./confirmation-dialog";

export function ProjectCard({
  projectName,
  projectId,
  projectImage,
}: {
  projectName: string;
  projectId: string;
  projectImage: ImageInterface;
}) {
  const [confimationDialogOpen, setConfimrationDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const size = 500;

  async function onDeletePressed() {
    setLoading(true);
    await deleteProject(projectId);
    setLoading(false);
    toast.success("Project deleted successfully");
  }

  return (
    <>
      <Link href={`projects/edit?id=${projectId}`}>
        <div className="relative shadow-2xl aspect-square rounded-lg">
          <Image
            className="rounded-lg h-full"
            src={projectImage.url}
            alt={projectImage.name}
            width={size}
            height={size}
            style={{
              objectFit: "cover",
            }}
          />

          <div className="group absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center hover:bg-opacity-30 text-5xl hover:text-6xl bg-black bg-opacity-10 rounded-lg transition-all">
            <Typography
              variant="h2"
              color="white"
              className="transition-all text-center m-4"
              style={{ fontSize: "inherit" }}
            >
              {projectName}
            </Typography>
            <div className="absolute top-0 right-4 opacity-0 group-hover:opacity-100">
              <span
                className="material-symbols-rounded text-white"
                onClick={(e) => {
                  e.preventDefault();
                  setConfimrationDialogOpen(true);
                }}
              >
                delete
              </span>
            </div>
          </div>
        </div>
      </Link>
      <ConfirmationDialog
        open={confimationDialogOpen}
        setOpen={setConfimrationDialogOpen}
        onConfirm={onDeletePressed}
      />
    </>
  );
}
