export type IndexOfOrUndefined<T> = T extends (infer U)[] ? U : undefined;
export type IndexOf<T> = T extends (infer U)[] ? U : never;
