"use client";
import { getProjectById } from "@/lib/api/data";
import { Editor } from "@/app/editor/editor";
import { useEffect, useState } from "react";
import { ProjectInterface } from "@/lib/api/interfaces";
import { Spinner } from "@material-tailwind/react";
import { useSearchParams } from "next/navigation";

export default function Page({}: {}) {
  const [project, setProject] = useState<ProjectInterface>();
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      getProjectById(id).then((project) => {
        setProject(project);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!id || !project) {
    return <>404</>;
  }

  return <Editor projectInterface={project} />;
}
