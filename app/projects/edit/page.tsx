import { getProjectById } from "@/lib/api/data";
import { Editor } from "@/app/editor/editor";

export default async function Page({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const id = searchParams.id;

  if (id == undefined) {
    return <>404</>;
  }

  const project = await getProjectById(id);

  return <Editor projectInterface={project} />;
}
