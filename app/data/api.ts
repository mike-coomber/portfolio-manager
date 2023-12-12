import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ProjectImageModel, ProjectModel } from "./models";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { ProjectInterface } from "./interfaces";

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
  workId: string
): Promise<ProjectImageModel[]> {
  const storageRef = ref(storage, `maddy/${workId}`);

  const allFiles = await listAll(storageRef);
  const images = await Promise.all(
    allFiles.items.map(async (item) => {
      const url = await getImageUrl(item.fullPath);
      return new ProjectImageModel(item.name, url);
    })
  );

  return images;
}
