import { Input, Textarea, Typography } from "@material-tailwind/react";
import { useState, useContext } from "react";
import { EditableProjectContext } from "../context";
import { ImagePickerDialog } from "./image-picker-dialog";
import Image from "next/image";
import { ColorPicker } from "./color-picker";
import { ProjectImageModel } from "@/app/editor/models/project-image-model";

export function ProjectInfo() {
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const { project, setProject } = useContext(EditableProjectContext);

  return (
    <form>
      <div className="gap-4 p-6 bg-white flex shadow-md">
        <ImagePicker
          initialImage={project.image}
          onClick={() => setImagePickerOpen(true)}
        />
        <div className="flex flex-col  gap-4">
          <div className="flex gap-2">
            <Input
              label="Name"
              type="text"
              name="name"
              value={project.name}
              onChange={(event) => {
                setProject({ ...project, name: event.target.value });
              }}
              className="cursor-text"
              variant="static"
              crossOrigin={""}
            />
            <Input
              type="text"
              label="Client"
              name="client"
              value={project.client}
              onChange={(event) => {
                setProject({ ...project, client: event.target.value });
              }}
              className="cursor-text"
              variant="static"
              crossOrigin={""}
            />
          </div>
          <div className="flex">
            <Input
              type="text"
              label="Services"
              name="services"
              value={project.services}
              onChange={(event) => {
                setProject({ ...project, services: event.target.value });
              }}
              className="cursor-text"
              variant="static"
              crossOrigin={""}
            />
          </div>
        </div>
        <div className="flex flex-1 h-max">
          <Textarea
            name="description"
            label="Description"
            className="cursor-text"
            onChange={(event) => {
              setProject({ ...project, description: event.target.value });
            }}
            value={project.description}
          />
        </div>
        <div className="ml-4 flex">
          <ColorPicker
            onColorSelected={(color: string) =>
              setProject({ ...project, backgroundColor: color })
            }
            initialColor={project.backgroundColor}
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

function ImagePicker({
  initialImage,
  onClick,
}: {
  initialImage: ProjectImageModel | undefined;
  onClick: () => void;
}) {
  const size = 100;

  return (
    <div
      className="mr-4 cursor-pointer relative flex justify-center items-center "
      onClick={onClick}
      style={{ minHeight: size, minWidth: size }}
    >
      {initialImage != undefined ? (
        <>
          <div className="opacity-0 hover:opacity-100 flex absolute left-0 right-0 top-0 bottom-0 items-center justify-center bg-black bg-opacity-40 z-10">
            <Typography color="white">Change</Typography>
          </div>
          <Image
            src={initialImage.url}
            height={size}
            width={size}
            alt={initialImage.name}
            className="flex"
            style={{
              height: size,
              width: size,
              objectFit: "contain",
            }}
          />
        </>
      ) : (
        <span className="material-symbols-rounded" style={{ fontSize: size }}>
          image
        </span>
      )}
    </div>
  );
}
