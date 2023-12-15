import { PageModel } from "@/app/data/page-model";
import { Typography, Button } from "@material-tailwind/react";
import { useState, useContext } from "react";
import { PageIndexContext, ProjectContext } from "../context";
import { ImagePickerDialog } from "./image-picker-dialog";
import Image from "next/image";

export function PageViewer() {
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  const { project, setProject } = useContext(ProjectContext);
  const { currentPageIndex } = useContext(PageIndexContext);

  return (
    <div className="flex-1 bg-red-50 p-12">
      <Typography>Page preview</Typography>
      <Button variant="text" onClick={() => setImagePickerOpen(true)}>
        Open Image Picker
      </Button>
      <div className="flex">
        {project.pages[currentPageIndex].images.map((image, index) => (
          <div key={index}>
            <Image
              key={image.name}
              src={image.url}
              alt={image.name}
              width={400}
              height={400}
              className="flex-1 p-2"
              style={{ maxHeight: 400, objectFit: "contain" }}
            />
            <Button
              variant="text"
              onClick={() => {
                const page = project.pages[currentPageIndex];

                const newImages = page.images.filter((val) => val != image);
                const newPage: PageModel = { ...page, images: newImages };

                const newPages = project.pages.filter((val) => val != page);

                newPages.splice(currentPageIndex, 0, newPage);
                setProject({ ...project, pages: newPages });
              }}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <ImagePickerDialog
        open={imagePickerOpen}
        setOpen={setImagePickerOpen}
        onImageSelected={(newImage) => {
          const page = project.pages[currentPageIndex];

          const newPage: PageModel = {
            ...page,
            images: [...page.images, newImage],
          };
          const newPages = project.pages.filter((val) => val != page);
          newPages.splice(currentPageIndex, 0, newPage);
          setProject({ ...project, pages: newPages });
        }}
      />
    </div>
  );
}
