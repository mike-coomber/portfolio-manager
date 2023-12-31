import { Typography, Button, Radio } from "@material-tailwind/react";
import { useState, useContext, useEffect } from "react";
import { PageIndexContext, EditableProjectContext } from "../context";
import { ImagePickerDialog } from "./image-picker-dialog";
import { ColorPicker } from "./color-picker";
import { VideoUrlDialog } from "./video-url-dialog";
import { ContentType, EditablePage } from "@/app/editor/models/editable-page";
import { PageViewer } from "./page-viewer";
import { EditableProject } from "../models/editable-project";

export function PageEditor({
  initialProject,
}: {
  initialProject: EditableProject;
}) {
  const { project, setProject } = useContext(EditableProjectContext);
  const { currentPageIndex } = useContext(PageIndexContext);

  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [videoUrlOpen, setVideoUrlOpen] = useState(false);

  const [contentType, setContentType] = useState(ContentType.images);

  const currentPage = project.pages[currentPageIndex];

  useEffect(() => {
    setContentType(currentPage.contentType);
  }, [currentPageIndex, currentPage.contentType]);

  function updatePage(newPage: EditablePage) {
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
    const originalPage = initialProject.pages.find(
      (val) => val.id == currentPage.id
    );
    if (originalPage) {
      changeColor(originalPage.backgroundColor);
    } else {
      changeColor(undefined);
    }
  }

  return (
    <div
      className="flex-1 p-4"
      style={{
        backgroundColor:
          currentPage.backgroundColor ??
          project.backgroundColor ??
          "var(--background)",
      }}
    >
      <div className="flex items-center justify-center bg-white px-4 py-2 rounded-2xl shadow-lg">
        <ContentTypePicker
          contentType={contentType}
          onTypeChanged={changeContentType}
        />
        <Divider />
        <Button
          size="sm"
          variant="outlined"
          className="flex items-center text-center"
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
          <span className="material-symbols-rounded">add</span>
          <Typography variant="small" className="mt-0.5">
            Add content
          </Typography>
        </Button>
        <Divider />
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
      <PageViewer
        currentPage={currentPage}
        contentType={contentType}
        onImageDeleted={(image) => {
          const newImages = currentPage.images?.filter((val) => val != image);
          const newPage: EditablePage = {
            ...currentPage,
            images: newImages,
          };

          const newPages = project.pages.filter((val) => val != currentPage);

          newPages.splice(currentPageIndex, 0, newPage);
          setProject({ ...project, pages: newPages });
        }}
      />
      <VideoUrlDialog
        open={videoUrlOpen}
        setOpen={setVideoUrlOpen}
        initialUrl={currentPage.videoUrl}
        onUrlSelected={(url) => {
          const newPage: EditablePage = {
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
          const newPage: EditablePage = {
            ...currentPage,
            images: [...(currentPage.images ?? []), newImage],
          };
          updatePage(newPage);
        }}
      />
    </div>
  );
}

function Divider() {
  return <div className="w-px bg-gray-400 mx-4 h-16" />;
}

function ContentTypePicker({
  contentType,
  onTypeChanged,
}: {
  contentType: ContentType;
  onTypeChanged: (val: ContentType) => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <Typography>Content type</Typography>
      <div>
        <Radio
          label="Image"
          crossOrigin={null}
          checked={contentType == ContentType.images}
          onChange={() => onTypeChanged(ContentType.images)}
        />
        <Radio
          label="Video link"
          crossOrigin={null}
          checked={contentType == ContentType.video}
          onChange={() => onTypeChanged(ContentType.video)}
        />
      </div>
    </div>
  );
}
