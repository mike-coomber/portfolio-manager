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
import Link from "next/link";

export default function Page() {
  const [project, setProject] = useState<ProjectModel>();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [allImages, setAllImages] = useState<ProjectImageModel[]>([]);

  const allProjects = useContext(ProjectsContext);
  const queryParams = useSearchParams();

  let indexOfProject = 0;

  useEffect(() => {
    getProject();
    const id = queryParams.get("id");
    getAllImages(id!).then((images) => setAllImages(images));
  }, []);

  function getProject() {
    const id = queryParams.get("id");
    const match = allProjects.find((work) => work.id == id);

    if (match != undefined) {
      indexOfProject = allProjects.indexOf(match);
      setProject({ ...match }); // Copy project by value so the original is not modified
    }
  }

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
          <ProjectInfo />
          <div className="flex flex-1">
            <PageSelector />
            {currentPageIndex != undefined && <PageViewer />}
          </div>
          <footer className="flex w-full bg-white p-4 justify-between z-10">
            <Link href={"/dashboard"}>
              <Button variant="text" className="mr-4">
                Back
              </Button>
            </Link>
            <div>
              <Button
                variant="text"
                className="mr-4"
                onClick={() => {
                  getProject();
                  setCurrentPageIndex(0);
                }}
              >
                Reset
              </Button>
              <Button
                onClick={() => {
                  allProjects[indexOfProject] = project;
                  writeProject(project);
                }}
              >
                Save
              </Button>
            </div>
          </footer>
        </PageIndexContext.Provider>
      </ImagesContext.Provider>
    </ProjectContext.Provider>
  );
}
