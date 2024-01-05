"use client";
import { getProjectById } from "@/lib/api/data";
import { Editor } from "@/app/editor/editor";
import { useEffect, useState } from "react";
import { ProjectInterface } from "@/lib/api/interfaces";
import { Spinner } from "@material-tailwind/react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function Page({}: {}) {
  const [project, setProject] = useState<ProjectInterface>();
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      getProjectById(id).then((result) => {
        setLoading(false);
        if (result.successful) {
          setProject(result.data);
        } else {
          toast.error("Error fetching project");
        }
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
