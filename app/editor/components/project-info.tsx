import { Input, Textarea, Typography } from "@material-tailwind/react";
import { useState, useContext } from "react";
import { ProjectContext } from "../context";
import { ImagePickerDialog } from "./image-picker-dialog";
import Image from "next/image";
import { ColorPicker } from "./color-picker";
import { ProjectImageModel } from "@/data/project-image-model";

export function ProjectInfo() {
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const { project, setProject } = useContext(ProjectContext);

  return (
    <form>
      <div className="p-6 bg-white flex shadow-md">
        <ImagePicker
          initialImage={project.image}
          onClick={() => setImagePickerOpen(true)}
        />
        <div className="flex-col flex-1">
          <div className="flex-3">
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
          </div>
          <div className="flex-1 mt-4">
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
        <div className="flex-1 ml-4 h-max mt-2">
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
