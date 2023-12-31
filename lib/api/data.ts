import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { ProjectImageModel } from "../../app/editor/models/project-image-model";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { ImageInterface, ProjectInterface } from "./interfaces";
import {
  EditableProject,
  projectModelToFirestore,
} from "../../app/editor/models/editable-project";
import { db, storage } from "@/firebase";
import toast from "react-hot-toast";

const user = "maddy";

export async function getProjects(): Promise<ProjectInterface[]> {
  const workCollection = collection(db, "work");
  const docSnapshot = await getDocs(workCollection);
  const docs = docSnapshot.docs;

  return docs.map((doc) => doc.data() as ProjectInterface);
}

export function getProjectsSnapshot(
  onDataFetched: (data: ProjectInterface[]) => void
): Unsubscribe {
  const q = query(collection(db, "work"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map(
      (doc) => doc.data() as ProjectInterface
    );
    onDataFetched(results);
  });

  return unsubscribe;
}

export async function getProjectById(id: string): Promise<ProjectInterface> {
  const docRef = doc(db, "work", id);

  const result = await getDoc(docRef);
  return result.data() as ProjectInterface;
}

export async function getImageUrl(url: string): Promise<string> {
  return getDownloadURL(ref(storage, url));
}

export async function getAllImages(
  projectId: string
): Promise<ImageInterface[]> {
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
  files: FileList
): Promise<ProjectImageModel[]> {
  const promises: Promise<ProjectImageModel>[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const location = `${user}/${projectId}/${file.name}`;

    const storageRef = ref(storage, location);
    const metaData = {
      contentType: `${file.type}`,
    };
    promises.push(
      new Promise<ProjectImageModel>(async (resolve, reject) => {
        try {
          const uploadTask = await uploadBytes(
            storageRef,
            await file.arrayBuffer(),
            metaData
          );
          const url = await getImageUrl(uploadTask.ref.fullPath);
          resolve(new ProjectImageModel(file.name, url));
        } catch (e) {
          toast.error(`Error uploading ${file.name}`);
          reject();
        }
      })
    );
  }

  return await Promise.all(promises);
}

export async function writeProject(projectModel: EditableProject) {
  await setDoc(
    doc(db, `work/${projectModel.id}`),
    projectModelToFirestore(projectModel)
  );
  //TODO refetch data
}

export async function deleteProject(projectId: string): Promise<void> {
  await deleteDoc(doc(db, `work/${projectId}`));
  await deleteImages(projectId);
  // TODO refetch data
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
