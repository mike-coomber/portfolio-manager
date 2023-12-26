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
import { ProjectModel } from "@/app/data/project-model";

export function ProjectCard({ data }: { data: ProjectModel }) {
  const size = 350;

  return (
    <Link href={`dashboard/edit?id=${data.id}`}>
      <div className="relative shadow-2xl ">
        {data.image != undefined && (
          <Image
            className="rounded-lg"
            src={data.image?.url}
            alt={`Image for ${data.name}`}
            width={size}
            height={size}
            style={{
              objectFit: "contain",
              maxHeight: size,
              maxWidth: size,
            }}
          />
        )}
        <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center hover:bg-opacity-30 text-5xl hover:text-6xl bg-black bg-opacity-10 rounded-lg transition-all">
          <Typography
            variant="h2"
            color="white"
            className="transition-all"
            style={{ fontSize: "inherit" }}
          >
            {data.name}
          </Typography>
        </div>
      </div>
    </Link>
  );
}
