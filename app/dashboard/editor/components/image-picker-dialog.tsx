import React, { createRef, useContext, useRef } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import Image from "next/image";
import { ProjectImageModel } from "@/app/data/project-image-model";
import { uploadImage } from "@/app/api/api";
import { ImagesContext, ProjectContext } from "../context";

interface ImagePickerDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  onImageSelected: ((img: ProjectImageModel) => void) | undefined;
}

export function ImagePickerDialog({
  open,
  setOpen,
  onImageSelected,
}: ImagePickerDialogProps) {
  const { images, setImages } = useContext(ImagesContext);

  const numRows = Math.ceil(images.length / 4);

  const imageComponents = images.map((image, index) => (
    <div
      key={index}
      className="flex flex-col jusify-center items-center text-center cursor-pointer hover:bg-sky-700"
      onClick={() => {
        if (onImageSelected != undefined) {
          onImageSelected(image);
        }
        setOpen(false);
      }}
    >
      <Image
        src={image.url}
        height={100}
        width={100}
        alt={image.name}
        className="flex"
        style={{
          flex: 2,
          minHeight: 100,
          minWidth: 100,
          objectFit: "contain",
        }}
      />
      <Typography className="ml-4 flex" style={{ flex: 1 }}>
        {image.name}
      </Typography>
    </div>
  ));

  imageComponents.push(
    <UploadTile onImageUploaded={(img) => setImages([...images, img])} />
  );

  return (
    <>
      <Dialog open={open} handler={setOpen}>
        <DialogHeader>Its a simple dialog.</DialogHeader>
        <DialogBody className={`grid grid-cols-4 grid-rows-${numRows} gap-4`}>
          {...imageComponents}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            onClick={() => setOpen(false)}
            className="mr-1"
          >
            <span>Close</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => setOpen(false)}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

function UploadTile({
  onImageUploaded,
}: {
  onImageUploaded: (img: ProjectImageModel) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { project } = useContext(ProjectContext);

  async function uploadFile(file: File) {
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const location = `maddy/${project.id}/${file.name}`;
    const url = await uploadImage(file, location);

    onImageUploaded(new ProjectImageModel(file.name, location, url));
  }

  return (
    <div
      key={"upload-tile"}
      className="border-2 border-dashed border-black flex items-center justify-center cursor-pointer"
      onClick={() => fileInputRef?.current?.click()}
    >
      <Typography>Upload Image</Typography>
      <input
        ref={fileInputRef}
        type="file"
        accept=".png, .jpg, .gif"
        className="w-full h-full absolute cursor-pointer hidden"
        onChange={(e) => {
          if (e.target.files != null) {
            uploadFile(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}
