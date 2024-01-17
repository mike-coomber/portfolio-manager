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
import { auth, db, storage } from "@/firebase";
import toast from "react-hot-toast";
import { User } from "firebase/auth";

class Result<T = undefined> {
  successful: boolean;
  data: T | undefined;

  constructor(successful: boolean, data?: T) {
    this.successful = successful;
    this.data = data;
  }
}

function getProjectPath(user: User, projectId: string): string {
  return `${getAllProjectsPath(user)}/${projectId}`;
}

function getAllProjectsPath(user: User): string {
  return `${user.email}/projects/all-projects`;
}

function authenticateUser(): Result<User> {
  if (auth.currentUser) {
    return new Result(true, auth.currentUser);
  } else {
    return new Result(false);
  }
}

export async function getProjects(): Promise<Result<ProjectInterface[]>> {
  const user = auth.currentUser;
  if (!user) {
    return new Result(false);
  }
  const projectsCollection = collection(db, getAllProjectsPath(user));

  try {
    const docSnapshot = await getDocs(projectsCollection);
    const docs = docSnapshot.docs;

    return new Result(
      true,
      docs.map((doc) => doc.data() as ProjectInterface)
    );
  } catch (e) {
    console.error(e);
    return new Result(false);
  }
}

export function getProjectsSnapshot(
  onDataFetched: (data: ProjectInterface[]) => void
): Result<Unsubscribe> {
  const authenticationResult = authenticateUser();
  const user = authenticationResult.data;

  if (!user || !authenticationResult.successful) {
    return new Result(false);
  }

  const q = query(collection(db, getAllProjectsPath(user)));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map(
      (doc) => doc.data() as ProjectInterface
    );
    onDataFetched(results);
  });

  return new Result(true, unsubscribe);
}

export async function getProjectById(
  id: string
): Promise<Result<ProjectInterface>> {
  const authenticationResult = authenticateUser();
  const user = authenticationResult.data;

  if (!user || !authenticationResult.successful) {
    return new Result(false);
  }

  const docRef = doc(db, getAllProjectsPath(user), id);
  try {
    const result = await getDoc(docRef);
    return new Result(true, result.data() as ProjectInterface);
  } catch (e) {
    console.error(e);
    return new Result(false);
  }
}

export async function getImageUrl(firebaseLocation: string): Promise<string> {
  return getDownloadURL(ref(storage, firebaseLocation));
}

export async function getAllImages(
  projectId: string
): Promise<Result<ImageInterface[]>> {
  const authenticationResult = authenticateUser();
  const user = authenticationResult.data;

  if (!user || !authenticationResult.successful) {
    return new Result(false);
  }

  const storageRef = ref(storage, `${user.email}/${projectId}`);

  const allFiles = await listAll(storageRef);
  const images = await Promise.all(
    allFiles.items.map(async (item) => {
      const url = await getImageUrl(item.fullPath);
      return new ProjectImageModel(item.name, url);
    })
  );

  return new Result(true, images);
}

export async function uploadImages(
  projectId: string,
  files: FileList
): Promise<Result<ProjectImageModel[]>> {
  const authenticationResult = authenticateUser();
  const user = authenticationResult.data;

  if (!user || !authenticationResult.successful) {
    return new Result(false);
  }

  const promises: Promise<ProjectImageModel>[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const location = `${user.email}/${projectId}/${file.name}`;

    const storageRef = ref(storage, location);
    const metadata = {
      contentType: `${file.type}`,
    };
    promises.push(
      new Promise<ProjectImageModel>(async (resolve, reject) => {
        try {
          const uploadTask = await uploadBytes(
            storageRef,
            await file.arrayBuffer(),
            metadata
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

  return new Result(true, await Promise.all(promises));
}

export async function writeProject(
  projectModel: EditableProject
): Promise<Result> {
  const authenticationResult = authenticateUser();
  const user = authenticationResult.data;

  if (!user || !authenticationResult.successful) {
    return new Result(false);
  }

  try {
    await setDoc(
      doc(db, getProjectPath(user, projectModel.id)),
      projectModelToFirestore(projectModel)
    );
    return new Result(true);
  } catch (e) {
    console.error(e);
    return new Result(false);
  }
}

export async function deleteProject(projectId: string): Promise<Result> {
  const authenticationResult = authenticateUser();
  const user = authenticationResult.data;

  if (!user || !authenticationResult.successful) {
    return new Result(false);
  }

  try {
    await deleteDoc(doc(db, getProjectPath(user, projectId)));
    await deleteImages(projectId);
    return new Result(true);
  } catch (e) {
    console.error(e);
    return new Result(false);
  }
}

async function deleteImages(projectId: string): Promise<Result> {
  const authenticationResult = authenticateUser();
  const user = authenticationResult.data;

  if (!user || !authenticationResult.successful) {
    return new Result(false);
  }

  const folderRef = ref(storage, `${user.email}/${projectId}`);
  const images = await listAll(folderRef);

  await Promise.all(
    images.items.map(async (item) => {
      const storageRef = ref(storage, item.fullPath);

      return deleteObject(storageRef)
        .catch((e) => console.error(e))
        .then(() => console.log(`deleted ${item.fullPath}`));
    })
  );

  return new Result(true);
}
