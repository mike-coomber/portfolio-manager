import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ProjectImageModel } from "../data/project-image-model";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { ProjectInterface } from "./interfaces";
import { ProjectModel, projectModelToFirestore } from "../data/project-model";

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
  file: File,
  location: string
): Promise<string> {
  const storageRef = ref(storage, location);
  const metaData = {
    contentType: `${file.type}`,
  };

  const uploadTask = await uploadBytes(
    storageRef,
    await file.arrayBuffer(),
    metaData
  );

  return await getImageUrl(uploadTask.ref.fullPath);
}

export async function writeProject(projectModel: ProjectModel) {
  // Remove any pages without any images
  projectModel.pages = projectModel.pages.filter(
    (pages) => pages.images.length > 0
  );

  await setDoc(
    doc(db, `work/${projectModel.id}`),
    projectModelToFirestore(projectModel)
  );
}
