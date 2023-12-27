import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { ProjectImageModel } from "../data/project-image-model";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { ProjectInterface } from "./interfaces";
import { ProjectModel, projectModelToFirestore } from "../data/project-model";
import { db, storage } from "@/firebase";
import { ProjectsContext, ProjectsContextModel } from "@/context/contexts";
import { useContext } from "react";

const user = "maddy";

export async function getAllWork(): Promise<ProjectModel[]> {
  const workCollection = collection(db, "work");
  const docSnapshot = await getDocs(workCollection);
  const docs = docSnapshot.docs;

  return await Promise.all(
    docs.map(async (doc) => {
      const data = doc.data() as ProjectInterface;
      return ProjectModel.fromInterface(doc.id, data);
    })
  );
}

export async function getImageUrl(url: string): Promise<string> {
  return getDownloadURL(ref(storage, url));
}

export async function getAllImages(
  projectId: string
): Promise<ProjectImageModel[]> {
  const storageRef = ref(storage, `maddy/${projectId}`);

  const allFiles = await listAll(storageRef);
  const images = await Promise.all(
    allFiles.items.map(async (item) => {
      const url = await getImageUrl(item.fullPath);
      return new ProjectImageModel(item.name, item.fullPath, url);
    })
  );

  return images;
}

export async function uploadImage(
  projectId: string,
  file: File
): Promise<ProjectImageModel> {
  const location = `${user}/${projectId}/${file.name}`;

  const storageRef = ref(storage, location);
  const metaData = {
    contentType: `${file.type}`,
  };

  const uploadTask = await uploadBytes(
    storageRef,
    await file.arrayBuffer(),
    metaData
  );

  const url = await getImageUrl(uploadTask.ref.fullPath);

  return new ProjectImageModel(file.name, location, url);
}

export async function writeProject(
  projectModel: ProjectModel,
  context: ProjectsContextModel
) {
  const { allProjects, setAllProjects } = context;
  console.log(projectModel);

  await setDoc(
    doc(db, `work/${projectModel.id}`),
    projectModelToFirestore(projectModel)
  ).then(() => {
    const projectIndex = allProjects.findIndex(
      (val) => val.id == projectModel.id
    );
    const projectsCopy = [...allProjects];

    if (projectIndex > -1) {
      projectsCopy.splice(projectIndex, 1, projectModel);
    } else {
      projectsCopy.push(projectModel);
    }

    setAllProjects(projectsCopy);
  });
}

export async function deleteProject(
  projectId: string,
  context: ProjectsContextModel
): Promise<void> {
  const { allProjects, setAllProjects } = context;

  await deleteDoc(doc(db, `work/${projectId}`));
  setAllProjects(allProjects.filter((value) => value.id != projectId));
}
