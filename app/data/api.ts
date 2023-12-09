import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { Work, WorkImage } from "./models";
import { getDownloadURL, listAll, ref } from "firebase/storage";

export async function getAllWork(): Promise<Work[]> {
  const workCollection = collection(db, "work");
  const docSnapshot = await getDocs(workCollection);
  const docs = docSnapshot.docs;

  return await Promise.all(
    docs.map(async (doc) => {
      const data = doc.data() as Work;
      data.id = doc.id;
      data.image = await getImageUrl(data.image);
      data.pages.map((page) => {
        page.images.forEach(async (url) => {
          console.log("before", url);
          url = await getImageUrl(url);
          console.log("after", url);
        });
      });
      return data;
    })
  );
}

export async function getImageUrl(url: string): Promise<string> {
  return getDownloadURL(ref(storage, url));
}

export async function getAllImages(workId: string): Promise<WorkImage[]> {
  const storageRef = ref(storage, `maddy/${workId}`);

  const allFiles = await listAll(storageRef);
  const images = await Promise.all(
    allFiles.items.map(async (item) => {
      const url = await getImageUrl(item.fullPath);
      return new WorkImage(url, item.name);
    })
  );
  console.log(images);
  return images;
}
