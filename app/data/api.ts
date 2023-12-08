import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { Work } from "./models";
import { getDownloadURL, ref } from "firebase/storage";

export async function getAllWork(): Promise<Work[]> {
  const workCollection = collection(db, "work");
  const docSnapshot = await getDocs(workCollection);
  const docs = docSnapshot.docs;

  return await Promise.all(
    docs.map(async (doc) => {
      const data = doc.data() as Work;
      data.id = doc.id;
      data.image = await getImageUrl(data.image);
      return data;
    })
  );
}

export async function getImageUrl(url: string): Promise<string> {
  return getDownloadURL(ref(storage, url));
}
