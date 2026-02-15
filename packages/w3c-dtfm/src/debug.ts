export const DEBUG_OBJECT_KEY = "design-sync-debug";

function getDebugObject() {
  if (!(globalThis as any)[DEBUG_OBJECT_KEY]) {
    (globalThis as any)[DEBUG_OBJECT_KEY] = {};
  }
  return (globalThis as any)[DEBUG_OBJECT_KEY];
}

export function getDebugInfo(key?: string) {
  if (!key) {
    return getDebugObject();
  }
  return getDebugObject()[key];
}

export function setDebugInfo(key: string, value: any) {
  const debugObject = getDebugObject();
  debugObject[key] = value;
}
