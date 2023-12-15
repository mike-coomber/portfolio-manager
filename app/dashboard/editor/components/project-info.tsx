import { Input, Textarea, Typography } from "@material-tailwind/react";
import { useState, useContext } from "react";
import { ProjectContext } from "../context";
import { ImagePickerDialog } from "./image-picker-dialog";
import Image from "next/image";

export function ProjectInfo() {
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const { project, setProject } = useContext(ProjectContext);

  return (
    <form>
      <div className="p-6 bg-white flex shadow-md">
        <div
          className="mr-4 cursor-pointer relative flex justify-center"
          onClick={() => setImagePickerOpen(true)}
        >
          <div className="opacity-0 hover:opacity-100 flex absolute left-0 right-0 top-0 bottom-0 items-center justify-center bg-blue-gray-500 bg-opacity-80 z-10">
            <Typography color="white">Change</Typography>
          </div>
          {project.image != undefined && (
            <Image
              src={project.image.url}
              height={100}
              width={100}
              alt={project.image.name}
              className="flex"
              style={{
                minHeight: 100,
                minWidth: 100,
                objectFit: "contain",
              }}
            />
          )}
        </div>
        <div className="flex-col flex-1">
          <div className="flex-3">
            <Input
              label="Name"
              type="text"
              name="name"
              defaultValue={project.name}
              onChange={(event) => {
                setProject({ ...project, name: event.target.value });
              }}
              className="cursor-text"
              variant="static"
              crossOrigin={""}
            />
          </div>
          <div className="flex-1 mt-4">
            <Input
              type="text"
              label="Services"
              name="services"
              defaultValue={project.services}
              onChange={(event) => {
                setProject({ ...project, services: event.target.value });
              }}
              className="cursor-text"
              variant="static"
              crossOrigin={""}
            />
          </div>
        </div>
        <div className="flex-1 ml-4 h-max mt-2">
          <Textarea
            name="description"
            label="Description"
            className="cursor-text"
            onChange={(event) => {
              setProject({ ...project, description: event.target.value });
            }}
            defaultValue={project.description}
          />
        </div>
      </div>
      <ImagePickerDialog
        open={imagePickerOpen}
        setOpen={setImagePickerOpen}
        onImageSelected={(newImage) => {
          setProject({ ...project, image: newImage });
        }}
      />
    </form>
  );
}
