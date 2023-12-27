import Image from "next/image";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import Link from "next/link";
import { ProjectModel } from "@/data/project-model";
import { useContext, useState } from "react";
import { ConfirmationDialog } from "./confirmation-dialog";
import { deleteProject } from "@/api/api";
import { ProjectsContext } from "@/context/contexts";

export function ProjectCard({ data }: { data: ProjectModel }) {
  const projectsContext = useContext(ProjectsContext);

  const [confimationDialogOpen, setConfimrationDialogOpen] = useState(false);

  const size = 350;

  function onDeletePressed() {
    deleteProject(data.id, projectsContext);
  }

  return (
    <>
      <Link href={`projects/edit?id=${data.id}`}>
        <div className="relative shadow-2xl">
          {data.image != undefined && (
            <Image
              className="rounded-lg"
              src={data.image?.url}
              alt={`Image for ${data.name}`}
              width={size}
              height={size}
              style={{
                objectFit: "cover",
                maxHeight: size,
                maxWidth: size,
              }}
            />
          )}
          <div className="group absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center hover:bg-opacity-30 text-5xl hover:text-6xl bg-black bg-opacity-10 rounded-lg transition-all">
            <Typography
              variant="h2"
              color="white"
              className="transition-all"
              style={{ fontSize: "inherit" }}
            >
              {data.name}
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
