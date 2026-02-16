import { Spinner, Tree, type TreeNode } from "@design-sync/uikit";
import { Show } from "solid-js";
import { useRpcQuery } from "../hooks/useRpc";

interface TokenBrowserProps {
  selectedPath?: string;
  onSelect: (path: string, token: Record<string, unknown> | null) => void;
}

function buildTreeNodes(obj: Record<string, unknown>, prefix = ""): TreeNode[] {
  const nodes: TreeNode[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$")) continue;
    if (typeof value !== "object" || value === null) continue;

    const path = prefix ? `${prefix}.${key}` : key;
    const record = value as Record<string, unknown>;

    if ("$type" in record && "$value" in record) {
      // Leaf token node
      nodes.push({
        id: path,
        label: `${key} (${record.$type})`,
        data: record,
      });
    } else {
      // Group node
      nodes.push({
        id: path,
        label: key,
        children: buildTreeNodes(record, path),
        data: null,
      });
    }
  }
  return nodes;
}

export function TokenBrowser(props: TokenBrowserProps) {
  const [tokens] = useRpcQuery("tokens/tree");

  const treeNodes = (): TreeNode[] => {
    const t = tokens();
    if (!t) return [];
    return buildTreeNodes(t as Record<string, unknown>);
  };

  return (
    <Show when={tokens()} fallback={<Spinner size="sm" />}>
      <Tree
        nodes={treeNodes()}
        selectedId={props.selectedPath}
        onSelect={(node) => {
          props.onSelect(node.id, node.data as Record<string, unknown> | null);
        }}
      />
    </Show>
  );
}
