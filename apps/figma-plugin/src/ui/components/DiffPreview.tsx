import { DiffView } from "@design-sync/uikit";
import type { DiffEntry } from "../../shared/types";

interface DiffPreviewProps {
  entries: DiffEntry[];
  title?: string;
}

export function DiffPreview(props: DiffPreviewProps) {
  return <DiffView entries={props.entries} title={props.title} />;
}
