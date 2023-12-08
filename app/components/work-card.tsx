import Image from "next/image";
import { Work } from "../data/models";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

export function WorkCard({ data }: { data: Work }) {
  return (
    <Card className="m-4 flex">
      <CardBody className="p-4 flex-col">
        <Typography variant="h5" color="black">
          {data.name}
        </Typography>
        <Image
          className="py-2 justify-center flex"
          src={data.image}
          alt={`Image for ${data.name}`}
          width={600}
          height={400}
        />
        <Typography>{data.description}</Typography>
      </CardBody>
    </Card>
  );
}
