"use client";
import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  ImagesContext,
  PageIndexContext,
  EditableProjectContext,
} from "./context";
import { ProjectInfo } from "./components/project-info";
import { PageSelector } from "./components/page-selector";
import { PageEditor } from "./components/page-editor";
import Link from "next/link";
import { getAllImages, writeProject } from "@/lib/api/data";
import { ProjectImageModel } from "@/app/editor/models/project-image-model";
import { EditableProject } from "@/app/editor/models/editable-project";
import toast from "react-hot-toast";
import { ProjectInterface } from "@/lib/api/interfaces";

export function Editor({
  projectInterface,
  newProjectId,
}: {
  projectInterface?: ProjectInterface;
  newProjectId?: string;
}) {
  const initialProject = projectInterface
    ? EditableProject.fromInterface(projectInterface)
    : EditableProject.fromId(newProjectId!);

  const [project, setProject] = useState<EditableProject>(initialProject);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allImages, setAllImages] = useState<ProjectImageModel[]>([]);

  useEffect(() => {
    getAllImages(project.id).then((result) => {
      if (result.successful && result.data) {
        setAllImages(result.data);
      } else {
        toast.error("Error fetching images");
      }
    });
  }, [project.id]);

  function saveProject() {
    const containsContent = project.pages
      .map(
        (page) => (page.images?.length ?? 0) > 0 || page.videoUrl != undefined
      )
      .includes(true);

    if (project.image == undefined) {
      toast.error("You must choose an image for the project");
    } else if (!containsContent) {
      toast.error("At least one page must have content on it.");
    } else {
      setLoading(true);
      writeProject(project).then((successful) => {
        setLoading(false);
        if (successful) {
          toast.success("Project saved successfully");
        } else {
          toast.error("Error saving project");
        }
      });
    }
  }

  if (project == undefined) {
    return <>404</>;
  }

  return (
    <EditableProjectContext.Provider value={{ project, setProject }}>
      <ImagesContext.Provider
        value={{ images: allImages, setImages: setAllImages }}
      >
        <PageIndexContext.Provider
          value={{ currentPageIndex, setCurrentPageIndex }}
        >
          <ProjectInfo />
          <div className="flex flex-1">
            <PageSelector />
            {currentPageIndex != undefined && (
              <PageEditor initialProject={initialProject} />
            )}
          </div>
          <footer className="flex w-full bg-white p-4 justify-between z-10">
            <Link href={"/projects"}>
              <Button variant="text" className="mr-4">
                Back
              </Button>
            </Link>
            <div className="flex">
              <Button
                variant="text"
                className="mr-4"
                onClick={() => {
                  setProject(initialProject);
                  setCurrentPageIndex(0);
                }}
              >
                Reset
              </Button>
              <Button onClick={saveProject} loading={loading}>
                Save
              </Button>
            </div>
          </footer>
        </PageIndexContext.Provider>
      </ImagesContext.Provider>
    </EditableProjectContext.Provider>
  );
}
