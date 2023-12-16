import { PageModel } from "@/app/data/page-model";
import { Typography, Button } from "@material-tailwind/react";
import { useState, useContext, useEffect } from "react";
import { PageIndexContext, ProjectContext } from "../context";
import { ImagePickerDialog } from "./image-picker-dialog";
import Image from "next/image";

export function PageViewer() {
  const { project, setProject } = useContext(ProjectContext);
  const { currentPageIndex } = useContext(PageIndexContext);

  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    project.pages[currentPageIndex]
  );

  useEffect(() => {
    console.log("page viewer", currentPageIndex);
    setCurrentPage(project.pages[currentPageIndex]);
  }, [currentPageIndex]);

  return (
    <div className="flex-1 bg-red-50 p-12">
      <Typography>Page preview</Typography>
      <Button variant="text" onClick={() => setImagePickerOpen(true)}>
        Open Image Picker
      </Button>
      <div className="flex">
        {currentPage.images.map((image, index) => (
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
                const newImages = currentPage.images.filter(
                  (val) => val != image
                );
                const newPage: PageModel = {
                  ...currentPage,
                  images: newImages,
                };

                const newPages = project.pages.filter(
                  (val) => val != currentPage
                );

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
          const newPage: PageModel = {
            ...currentPage,
            images: [...currentPage.images, newImage],
          };
          const newPages = project.pages.filter((val) => val != currentPage);
          newPages.splice(currentPageIndex, 0, newPage);
          setProject({ ...project, pages: newPages });
        }}
      />
    </div>
  );
}
