import { isObject } from "@design-sync/utils";

export interface MergeConflict {
  path: string;
  base: unknown;
  local: unknown;
  remote: unknown;
}

export interface ThreeWayDiffResult {
  /** Changes that were auto-merged (only one side changed) */
  autoMerged: Record<string, unknown>;
  /** Changes where both sides differ from base */
  conflicts: MergeConflict[];
}

/**
 * Three-way diff/merge of token trees.
 *
 * - base: last-sync snapshot
 * - local: current Figma state
 * - remote: newly fetched from git
 *
 * Rules:
 * - Only base changed → keep base (shouldn't happen, base is snapshot)
 * - Only local changed → keep local
 * - Only remote changed → keep remote (auto-merge)
 * - Both changed identically → keep either (auto-merge)
 * - Both changed differently → conflict
 */
export function threeWayDiff(
  base: Record<string, unknown>,
  local: Record<string, unknown>,
  remote: Record<string, unknown>,
  prefix = "",
): ThreeWayDiffResult {
  const autoMerged: Record<string, unknown> = {};
  const conflicts: MergeConflict[] = [];

  const allKeys = new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)]);

  for (const key of allKeys) {
    if (key.startsWith("$")) continue;

    const path = prefix ? `${prefix}.${key}` : key;
    const baseVal = base[key];
    const localVal = local[key];
    const remoteVal = remote[key];

    const baseStr = JSON.stringify(baseVal);
    const localStr = JSON.stringify(localVal);
    const remoteStr = JSON.stringify(remoteVal);

    // Check if values are token groups (objects without $value)
    if (
      isObject(baseVal) &&
      isObject(localVal) &&
      isObject(remoteVal) &&
      !("$value" in (baseVal as Record<string, unknown>)) &&
      !("$value" in (localVal as Record<string, unknown>)) &&
      !("$value" in (remoteVal as Record<string, unknown>))
    ) {
      // Recurse into groups
      const childResult = threeWayDiff(
        baseVal as Record<string, unknown>,
        localVal as Record<string, unknown>,
        remoteVal as Record<string, unknown>,
        path,
      );
      if (Object.keys(childResult.autoMerged).length > 0) {
        autoMerged[key] = childResult.autoMerged;
      }
      conflicts.push(...childResult.conflicts);
      continue;
    }

    // Same on all three sides — no change
    if (baseStr === localStr && baseStr === remoteStr) {
      autoMerged[key] = baseVal;
      continue;
    }

    // Only local changed
    if (baseStr === remoteStr && baseStr !== localStr) {
      autoMerged[key] = localVal;
      continue;
    }

    // Only remote changed
    if (baseStr === localStr && baseStr !== remoteStr) {
      autoMerged[key] = remoteVal;
      continue;
    }

    // Both changed identically
    if (localStr === remoteStr) {
      autoMerged[key] = localVal;
      continue;
    }

    // Both changed differently → conflict
    conflicts.push({ path, base: baseVal, local: localVal, remote: remoteVal });
  }

  return { autoMerged, conflicts };
}
