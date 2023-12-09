"use client";

import { useState, useEffect, useContext } from "react";
import { getAllWork } from "../data/api";
import { Work } from "../data/models";
import { WorkCard } from "./components/work-card";
import { WorkContext } from "../context/contexts";

export default function Page() {
  const work = useContext(WorkContext);

  return (
    <div>
      {work.map((workObj) => (
        <WorkCard data={workObj} />
      ))}
    </div>
  );
}
