"use client";
import { ProjectsContext } from "@/app/context/contexts";
import { getAllImages, writeProject } from "@/app/api/api";
import { ProjectImageModel } from "@/app/data/project-image-model";
import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { ImagePickerDialog } from "./components/image-picker-dialog";
import { ImagesContext, PageIndexContext, ProjectContext } from "./context";
import { PageModel } from "@/app/data/page-model";
import { ProjectModel } from "@/app/data/project-model";
import { ProjectInfo } from "./components/project-info";
import { PageSelector } from "./components/page-selector";
import { PageViewer } from "./components/page-viewer";

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
        <PageIndexContext.Provider
          value={{ currentPageIndex, setCurrentPageIndex }}
        >
          <div className="h-full">
            <ProjectInfo />
            <div className="flex h-full">
              <PageSelector />
              {currentPageIndex != undefined && <PageViewer />}
            </div>
          </div>
          <footer
            className="flex w-full bg-white p-4 justify-end"
            onClick={() => writeProject(project)}
          >
            <Button>Save</Button>
          </footer>
        </PageIndexContext.Provider>
      </ImagesContext.Provider>
    </ProjectContext.Provider>
  );
}
