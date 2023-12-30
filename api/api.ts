import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { ProjectImageModel } from "../data/project-image-model";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { ProjectInterface } from "./interfaces";
import { ProjectModel, projectModelToFirestore } from "../data/project-model";
import { db, storage } from "@/firebase";
import { ProjectsContextModel } from "@/context/contexts";

const user = "maddy";

export async function getAllWork(): Promise<ProjectModel[]> {
  const workCollection = collection(db, "work");
  const docSnapshot = await getDocs(workCollection);
  const docs = docSnapshot.docs;

  return docs.map((doc) => {
    const data = doc.data() as ProjectInterface;
    return ProjectModel.fromInterface(doc.id, data);
  });
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
      return new ProjectImageModel(item.name, url);
    })
  );

  return images;
}

export async function uploadImages(
  projectId: string,
  files: FileList,
  onUploadSuccess: (image: ProjectImageModel) => void
): Promise<void> {
  const promises: Promise<void>[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const location = `${user}/${projectId}/${file.name}`;

    const storageRef = ref(storage, location);
    const metaData = {
      contentType: `${file.type}`,
    };
    promises.push(
      new Promise(async () => {
        const uploadTask = await uploadBytes(
          storageRef,
          await file.arrayBuffer(),
          metaData
        );
        const url = await getImageUrl(uploadTask.ref.fullPath);
        console.log("uploaded", file.name);
        onUploadSuccess(new ProjectImageModel(file.name, url));
      })
    );
  }

  await Promise.all(promises);
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
  await deleteImages(projectId);
  setAllProjects(allProjects.filter((value) => value.id != projectId));
}

async function deleteImages(projectId: string): Promise<void> {
  const folderRef = ref(storage, `${user}/${projectId}`);
  const images = await listAll(folderRef);

  await Promise.all(
    images.items.map(async (item) => {
      const storageRef = ref(storage, item.fullPath);

      return deleteObject(storageRef)
        .catch((e) => console.error(e))
        .then(() => console.log(`deleted ${item.fullPath}`));
    })
  );
}
