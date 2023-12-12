"use client";
import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import Image from "next/image";
import { ProjectImageModel } from "@/app/data/models";

export function ImagePickerDialog({
  open,
  setOpen,
  images,
}: ImagePickerDialogProps) {
  const numRows = Math.ceil(images.length / 4);

  return (
    <>
      <Dialog open={open} handler={setOpen}>
        <DialogHeader>Its a simple dialog.</DialogHeader>
        <DialogBody className={`grid grid-cols-4 grid-rows-${numRows} gap-4`}>
          {images.map((image, index) => (
            <div
              key={index}
              className="flex flex-col jusify-center items-center text-center cursor-pointer hover:bg-sky-700"
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
          ))}
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

interface ImagePickerDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  images: ProjectImageModel[];
}
