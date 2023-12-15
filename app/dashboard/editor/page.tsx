"use client";
import { ProjectsContext } from "@/app/context/contexts";
import { getAllImages, writeProject } from "@/app/api/api";
import { ProjectImageModel } from "@/app/data/project-image-model";
import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { ImagePickerDialog } from "./components/image-picker-dialog";
import { ImagesContext, ProjectContext } from "./context";
import { PageModel } from "@/app/data/page-model";
import { ProjectModel } from "@/app/data/project-model";

export default function Page() {
  const [project, setProject] = useState<ProjectModel>();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [allImages, setAllImages] = useState<ProjectImageModel[]>([]);

  const allProjects = useContext(ProjectsContext);
  const queryParams = useSearchParams();

  useEffect(() => {
    const id = queryParams.get("id");
    const match = allProjects.find((work) => work.id == id);

    if (match != undefined) {
      setProject({ ...match }); // Copy project by value so the original is not modified
    }

    getAllImages(id!).then((images) => setAllImages(images));
  }, []);

  if (project == undefined) {
    return <>404</>;
  }

  return (
    <ProjectContext.Provider value={{ project, setProject }}>
      <ImagesContext.Provider
        value={{ images: allImages, setImages: setAllImages }}
      >
        <div className="h-full">
          <TopBar />
          <div className="flex h-full">
            <PageSelector onPageSelected={setCurrentPageIndex} />
            {currentPageIndex != undefined && (
              <PageView pageIndex={currentPageIndex} />
            )}
          </div>
        </div>
        <footer
          className="flex w-full bg-white p-4 justify-end"
          onClick={() => writeProject(project)}
        >
          <Button>Save</Button>
        </footer>
      </ImagesContext.Provider>
    </ProjectContext.Provider>
  );
}

function PageSelector({
  onPageSelected,
}: {
  onPageSelected: (pageIndex: number) => void;
}) {
  const { project } = useContext(ProjectContext);

  const pages = project.pages;

  return (
    <div className="px-4 py-2 bg-white shadow-md flex-initial w-40">
      {pages.map((page, index) => (
        <div
          key={index}
          className="p-2 cursor-pointer"
          onClick={() => onPageSelected(index)}
        >
          <Typography>Page {index + 1}</Typography>
        </div>
      ))}
    </div>
  );
}

function PageView({ pageIndex }: { pageIndex: number }) {
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const { project, setProject } = useContext(ProjectContext);

  return (
    <div className="flex-1 bg-red-50 p-12">
      <Typography>Page preview</Typography>
      <Button variant="text" onClick={() => setImagePickerOpen(true)}>
        Open Image Picker
      </Button>
      <div className="flex">
        {project.pages[pageIndex].images.map((image) => (
          <div>
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
                const page = project.pages[pageIndex];

                const newImages = page.images.filter((val) => val != image);
                const newPage: PageModel = { ...page, images: newImages };

                const newPages = project.pages.filter((val) => val != page);

                newPages.splice(pageIndex, 0, newPage);
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
          const page = project.pages[pageIndex];

          const newPage: PageModel = {
            ...page,
            images: [...page.images, newImage],
          };
          const newPages = project.pages.filter((val) => val != page);
          newPages.splice(pageIndex, 0, newPage);
          setProject({ ...project, pages: newPages });
        }}
      />
    </div>
  );
}

function TopBar() {
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const { project, setProject } = useContext(ProjectContext);

  return (
    <form>
      <div className="p-6 bg-white flex shadow-md">
        <div
          className="mr-4 cursor-pointer relative flex justify-center"
          onClick={() => setImagePickerOpen(true)}
        >
          <div className="opacity-0 hover:opacity-100 flex absolute left-0 right-0 top-0 bottom-0 items-center justify-center bg-blue-gray-500 bg-opacity-80 z-10">
            <Typography color="white">Change</Typography>
          </div>
          {project.image != undefined && (
            <Image
              src={project.image.url}
              height={100}
              width={100}
              alt={project.image.name}
              className="flex"
              style={{
                minHeight: 100,
                minWidth: 100,
                objectFit: "contain",
              }}
            />
          )}
        </div>
        <div className="flex-col flex-1">
          <div className="flex-3">
            <Input
              label="Name"
              type="text"
              name="name"
              defaultValue={project.name}
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
              defaultValue={project.services}
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
            defaultValue={project.description}
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
