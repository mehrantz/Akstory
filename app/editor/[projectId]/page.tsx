"use client";

import { useParams } from "next/navigation";
import { PhotobookEditor } from "@/components/editor/photobook-editor";

export default function EditorPage() {
  const params = useParams<{ projectId: string }>();
  return <PhotobookEditor projectId={params.projectId} />;
}
