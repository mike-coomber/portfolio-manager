"use client";
import { WorkContext } from "@/app/context/contexts";
import { getAllImages } from "@/app/data/api";
import { PageModel, ProjectImageModel, ProjectModel } from "@/app/data/models";
import {
  Button,
  IconButton,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { useSearchParams } from "next/navigation";
import {
  ChangeEventHandler,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import { ImagePickerDialog } from "./components/image-picker-dialog";
import { ProjectContext } from "./context";
import { pages } from "next/dist/build/templates/app-page";

export default function Page() {
  const [project, setProject] = useState<ProjectModel>();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [allImages, setAllImages] = useState<ProjectImageModel[]>([]);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  const allWork = useContext(WorkContext);
  const queryParams = useSearchParams();

  useEffect(() => {
    const id = queryParams.get("id");
    const match = allWork.find((work) => work.id == id);

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
      <div className="h-full">
        <TopBar />
        <div className="flex">
          <PageSelector onPageSelected={setCurrentPageIndex} />
          {currentPageIndex != undefined && (
            <PageView
              pageIndex={currentPageIndex}
              setImagePickerOpen={setImagePickerOpen}
            />
          )}
        </div>
        <ImagePickerDialog
          open={imagePickerOpen}
          setOpen={setImagePickerOpen}
          images={allImages}
        />
      </div>
    </ProjectContext.Provider>
  );
}

function PageSelector({
  onPageSelected,
}: {
  onPageSelected: (pageIndex: number) => void;
}) {
  const { project } = useContext(ProjectContext);
  console.log(project);
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

function PageView({
  pageIndex,
  setImagePickerOpen,
}: {
  pageIndex: number;
  setImagePickerOpen: Function;
}) {
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
                console.log(project);
                setProject({ ...project, pages: newPages });
                console.log(project);
              }}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopBar() {
  const { project, setProject } = useContext(ProjectContext);

  return (
    <form
      onChange={(e) => {
        console.log(project);
      }}
    >
      <div className="p-6 bg-white flex shadow-md">
        <div className="flex-col flex-1">
          <div className="flex-3">
            <Input
              label="Name"
              type="text"
              name="name"
              defaultValue={project.name}
              onChange={(event) => {
                project.name = event.target.value;
                setProject(project);
              }}
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
              variant="static"
              crossOrigin={""}
            />
          </div>
        </div>
        <div className="flex-1 ml-4 h-max mt-2">
          <Textarea
            name="description"
            label="Description"
            defaultValue={project.description}
          />
        </div>
      </div>
    </form>
  );
}
