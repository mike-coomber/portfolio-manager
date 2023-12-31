import { Editor } from "@/app/editor/editor";
import {
  EditableProject,
  projectModelToFirestore,
} from "@/app/editor/models/editable-project";
import { ProjectInterface } from "@/lib/api/interfaces";

export default function Page({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const id = searchParams.id;

  if (id == undefined) {
    return <>404</>;
  }

  return <Editor newProjectId={id} />;
}
