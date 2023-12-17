import { PageModel } from "@/app/data/page-model";
import { Typography, Button } from "@material-tailwind/react";
import { useState, useContext, useEffect } from "react";
import { PageIndexContext, ProjectContext } from "../context";
import { ImagePickerDialog } from "./image-picker-dialog";
import Image from "next/image";
import { ColorPicker } from "./color-picker";
import { ProjectsContext } from "@/app/context/contexts";

export function PageViewer() {
  const allProjects = useContext(ProjectsContext);
  const { project, setProject } = useContext(ProjectContext);
  const { currentPageIndex } = useContext(PageIndexContext);

  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  const currentPage = project.pages[currentPageIndex];

  function updatePage(newPage: PageModel) {
    const newPages = project.pages.filter((val) => val != currentPage);

    newPages.splice(currentPageIndex, 0, newPage);
    setProject({ ...project, pages: newPages });
  }

  function changeColor(newColor: string | undefined) {
    const newPage = {
      ...currentPage,
      backgroundColor: newColor,
    };

    updatePage(newPage);
  }

  function resetColor() {
    const originalProject = allProjects.find((val) => val.id == project.id);
    if (originalProject != undefined) {
      try {
        const originalPage = originalProject.pages[currentPageIndex];
        changeColor(originalPage.backgroundColor);
      } catch (e) {
        changeColor(undefined);
      }
    }
  }

  return (
    <div
      className="flex-1 p-12"
      style={{
        backgroundColor:
          currentPage.backgroundColor ??
          project.backgroundColor ??
          "var(--background)",
      }}
    >
      <div className="flex items-center justify-between">
        <Typography>Page preview</Typography>
        <div className="flex">
          <Button variant="text" onClick={() => setImagePickerOpen(true)}>
            Open Image Picker
          </Button>
          <ColorPicker
            initialColor={currentPage.backgroundColor}
            showInline={true}
            onDeletePressed={() => changeColor(undefined)}
            onResetPressed={() => {
              resetColor();
            }}
            onColorSelected={(newColor) => {
              changeColor(newColor);
            }}
          />
        </div>
      </div>
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
