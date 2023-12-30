import { auth } from "@/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export async function loginUser(
  email: string,
  password: string
): Promise<boolean> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (e) {
    return false;
  }
}

export async function logout(): Promise<boolean> {
  try {
    await signOut(auth);
    return true;
  } catch (e) {
    return false;
  }
}
