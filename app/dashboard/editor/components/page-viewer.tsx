import { ContentType, PageModel } from "@/app/data/page-model";
import { Typography, Button, Radio } from "@material-tailwind/react";
import { useState, useContext, useEffect } from "react";
import { PageIndexContext, ProjectContext } from "../context";
import { ImagePickerDialog } from "./image-picker-dialog";
import Image from "next/image";
import { ColorPicker } from "./color-picker";
import { ProjectsContext } from "@/app/context/contexts";
import { VideoUrlDialog } from "./video-url-dialog";
import ReactPlayer from "react-player";

export function PageViewer() {
  const allProjects = useContext(ProjectsContext);

  const { project, setProject } = useContext(ProjectContext);
  const { currentPageIndex } = useContext(PageIndexContext);

  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [videoUrlOpen, setVideoUrlOpen] = useState(false);

  const [contentType, setContentType] = useState(ContentType.images);

  const currentPage = project.pages[currentPageIndex];

  useEffect(() => {
    setContentType(currentPage.contentType);
  }, [currentPageIndex]);

  function updatePage(newPage: PageModel) {
    const newPages = project.pages.filter((val) => val != currentPage);

    newPages.splice(currentPageIndex, 0, newPage);
    setProject({ ...project, pages: newPages });
  }

  function changeContentType(contentType: ContentType) {
    currentPage.contentType = contentType;
    setContentType(contentType);
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
      const originalPage = originalProject.pages.find(
        (val) => val.id == currentPage.id
      );
      if (originalPage) {
        changeColor(originalPage.backgroundColor);
      } else {
        changeColor(undefined);
      }
    }
  }
  console.log(contentType);

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
        <Button
          onClick={() => {
            switch (contentType) {
              case ContentType.images:
                setImagePickerOpen(true);
                break;
              case ContentType.video:
                setVideoUrlOpen(true);
                break;
            }
          }}
        >
          Add content
        </Button>
        <div className="flex">
          <div className="flex flex-col items-center">
            <Typography>Content type</Typography>
            <div>
              <Radio
                label="Image"
                crossOrigin={null}
                checked={contentType == ContentType.images}
                onChange={() => changeContentType(ContentType.images)}
              />
              <Radio
                label="Video link"
                crossOrigin={null}
                checked={contentType == ContentType.video}
                onChange={() => changeContentType(ContentType.video)}
              />
            </div>
          </div>
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
        {contentType == ContentType.images &&
          currentPage.images &&
          currentPage.images.map((image, index) => (
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
                  const newImages = currentPage.images?.filter(
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
        {contentType == ContentType.video &&
          currentPage.videoUrl != undefined && (
            <ReactPlayer url={currentPage.videoUrl} />
          )}
      </div>
      <VideoUrlDialog
        open={videoUrlOpen}
        setOpen={setVideoUrlOpen}
        initialUrl={currentPage.videoUrl}
        onUrlSelected={(url) => {
          const newPage: PageModel = {
            ...currentPage,
            videoUrl: url,
          };
          updatePage(newPage);
        }}
      />
      <ImagePickerDialog
        open={imagePickerOpen}
        setOpen={setImagePickerOpen}
        onImageSelected={(newImage) => {
          const newPage: PageModel = {
            ...currentPage,
            images: [...(currentPage.images ?? []), newImage],
          };
          updatePage(newPage);
        }}
      />
    </div>
  );
}
