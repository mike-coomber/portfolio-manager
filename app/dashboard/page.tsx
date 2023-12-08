"use client";

import { useState, useEffect } from "react";
import { getAllWork } from "../data/api";
import { Work } from "../data/models";
import { WorkCard } from "../components/work-card";

export default function Page() {
  const [work, setWork] = useState<Work[]>([]);

  useEffect(() => {
    getAllWork().then((work) => {
      setWork(work);
    });
  }, []);

  return (
    <div>
      {work.map((workObj) => (
        <WorkCard data={workObj} />
      ))}
    </div>
  );
}
