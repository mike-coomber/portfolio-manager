import Image from "next/image";
import { ProjectModel } from "../../data/models";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import Link from "next/link";

export function WorkCard({ data }: { data: ProjectModel }) {
  return (
    <Link href={`dashboard/editor?id=${data.id}`}>
      <Card className="m-4 flex">
        <CardBody className="p-4 flex-col">
          <Typography variant="h5" color="black">
            {data.name}
          </Typography>
          <Image
            className="py-2 justify-center flex"
            src={data.imageUrl}
            alt={`Image for ${data.name}`}
            width={600}
            height={400}
          />
          <Typography>{data.description}</Typography>
        </CardBody>
      </Card>
    </Link>
  );
}
