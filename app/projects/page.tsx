"use client";
import { getProjects } from "@/lib/api/data";
import { ProjectsGrid } from "../components/projects-grid";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/providers/auth-provider";
import toast from "react-hot-toast";
import { ProjectInterface } from "@/lib/api/interfaces";
import { Spinner } from "@material-tailwind/react";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectInterface[]>();

  useEffect(() => {
    getProjects().then((result) => {
      setLoading(false);
      if (!result.successful || !result.data) {
        toast.error("Error fetching projects");
        return undefined;
      } else {
        setProjects(result.data);
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!projects) {
    return undefined;
  }

  return <ProjectsGrid initialProjects={projects} />;
}
