import React, { useContext, useRef, useState } from "react";
import {
  Dialog,
  DialogBody,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import Image from "next/image";
import { ImagesContext, EditableProjectContext } from "../context";
import { uploadImages } from "@/lib/api/data";
import { ProjectImageModel } from "@/app/editor/models/project-image-model";
import clsx from "clsx";
import toast from "react-hot-toast";

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

  const imageComponents = images.map((image) => (
    <ImageTile
      key={image.name}
      image={image}
      onClick={() => {
        if (onImageSelected != undefined) {
          onImageSelected(image);
        }
        setOpen(false);
      }}
    />
  ));

  imageComponents.push(
    <UploadTile
      key={"upload-tile"}
      onImagesUploaded={(newImages) => setImages([...images, ...newImages])}
    />
  );

  return (
    <Dialog open={open} handler={setOpen}>
      <div className="flex justify-end">
        <span
          className="material-symbols-rounded cursor-pointer m-4"
          onClick={() => setOpen(false)}
        >
          close
        </span>
      </div>
      <DialogBody
        className={`grid grid-cols-4 gap-4 overflow-y-scroll`}
        style={{ maxHeight: "80vh" }}
      >
        {...imageComponents}
      </DialogBody>
    </Dialog>
  );
}

function ImageTile({
  image,
  onClick,
}: {
  image: ProjectImageModel;
  onClick: () => void;
}) {
  return (
    <div
      key={image.name}
      className="flex relative flex-col jusify-center items-center text-center cursor-pointer hover:bg-gray-300 hover:shadow-sm rounded-md pt-4"
      onClick={onClick}
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
      <Typography className="flex px-2 flex-1 overflow-hidden max-w-full">
        {image.name}
      </Typography>
    </div>
  );
}

function UploadTile({
  onImagesUploaded,
}: {
  onImagesUploaded: (images: ProjectImageModel[]) => void;
}) {
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { project } = useContext(EditableProjectContext);

  async function uploadFiles(files: FileList) {
    setLoading(true);
    const result = await uploadImages(project.id, files);
    setLoading(false);
    if (result.successful && result.data) {
      onImagesUploaded(result.data);
    } else {
      toast.error("Error uploading images");
    }
  }

  return (
    <div
      key={"upload-tile"}
      className={clsx(
        `border-2 border-dashed border-black flex items-center justify-center cursor-pointer rounded-md`,
        {
          "cursor-default": loading,
        }
      )}
      onClick={() => {
        if (!loading) {
          fileInputRef?.current?.click();
        }
      }}
      style={{
        minHeight: 100,
        minWidth: 100,
      }}
    >
      {!loading ? <Typography>Upload Images</Typography> : <Spinner />}

      <input
        ref={fileInputRef}
        type="file"
        accept=".png, .jpg, .gif"
        multiple={true}
        className="hidden"
        onChange={(e) => {
          if (e.target.files != null) {
            uploadFiles(e.target.files);
          }
        }}
      />
    </div>
  );
}
