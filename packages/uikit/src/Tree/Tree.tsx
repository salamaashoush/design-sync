import { For, JSX, Show, createSignal } from 'solid-js';
import {
  leafNode,
  node,
  nodeChildren,
  nodeHeader,
  nodeHeaderSelected,
  nodeIcon,
  nodeLabel,
  nodeToggle,
  nodeToggleExpanded,
  root,
} from './tree.css';

export interface TreeNode {
  id: string;
  label: string;
  icon?: JSX.Element;
  children?: TreeNode[];
  data?: unknown;
}

export interface TreeProps {
  nodes: TreeNode[];
  onSelect?: (node: TreeNode) => void;
  selectedId?: string;
  defaultExpandedIds?: string[];
}

function TreeNodeItem(props: {
  node: TreeNode;
  selectedId?: string;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelect?: (node: TreeNode) => void;
}) {
  const hasChildren = () => (props.node.children?.length ?? 0) > 0;
  const isExpanded = () => props.expandedIds.has(props.node.id);
  const isSelected = () => props.selectedId === props.node.id;

  const handleClick = () => {
    if (hasChildren()) {
      props.onToggle(props.node.id);
    }
    props.onSelect?.(props.node);
  };

  return (
    <li class={node}>
      <div
        classList={{
          [nodeHeader]: true,
          [nodeHeaderSelected]: isSelected(),
        }}
        onClick={handleClick}
      >
        <Show when={hasChildren()} fallback={<span class={leafNode} />}>
          <span
            classList={{
              [nodeToggle]: true,
              [nodeToggleExpanded]: isExpanded(),
            }}
          >
            &#9654;
          </span>
        </Show>
        <Show when={props.node.icon}>
          <span class={nodeIcon}>{props.node.icon}</span>
        </Show>
        <span class={nodeLabel}>{props.node.label}</span>
      </div>
      <Show when={hasChildren() && isExpanded()}>
        <ul class={`${root} ${nodeChildren}`}>
          <For each={props.node.children}>
            {(child) => (
              <TreeNodeItem
                node={child}
                selectedId={props.selectedId}
                expandedIds={props.expandedIds}
                onToggle={props.onToggle}
                onSelect={props.onSelect}
              />
            )}
          </For>
        </ul>
      </Show>
    </li>
  );
}

export function Tree(props: TreeProps) {
  const [expandedIds, setExpandedIds] = createSignal<Set<string>>(
    new Set(props.defaultExpandedIds ?? []),
  );

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <ul class={root}>
      <For each={props.nodes}>
        {(node) => (
          <TreeNodeItem
            node={node}
            selectedId={props.selectedId}
            expandedIds={expandedIds()}
            onToggle={handleToggle}
            onSelect={props.onSelect}
          />
        )}
      </For>
    </ul>
  );
}
