import justClone from "just-clone";

export function clone<T extends object>(val: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(val);
  }
  return justClone(val);
}
