"use client";
import { useEffect, useState } from "react";
import { WorkContext } from "../context/contexts";
import { getAllWork } from "../data/api";
import { Work } from "../data/models";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [work, setWork] = useState<Work[]>([]);

  useEffect(() => {
    getAllWork().then((work) => {
      setWork(work);
    });
  }, []);

  return <WorkContext.Provider value={work}>{children}</WorkContext.Provider>;
}
