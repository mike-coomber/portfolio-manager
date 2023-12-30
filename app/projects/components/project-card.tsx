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
import toast from "react-hot-toast";

export function ProjectCard({ data }: { data: ProjectModel }) {
  const projectsContext = useContext(ProjectsContext);

  const [confimationDialogOpen, setConfimrationDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const size = 300;

  async function onDeletePressed() {
    setLoading(true);
    await deleteProject(data.id, projectsContext);
    setLoading(false);
    toast.success("Project deleted successfully");
  }

  return (
    <>
      <Link href={`projects/edit?id=${data.id}`}>
        <div
          className="relative shadow-2xl aspect-square rounded-lg"
          // style={{ minWidth: size, minHeight: size }}
        >
          {data.image != undefined && (
            <Image
              className="rounded-lg h-full"
              src={data.image?.url}
              alt={`Image for ${data.name}`}
              width={size * 1.5}
              height={size * 1.5}
              style={{
                objectFit: "cover",
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
