export type IndexOfOrUndefined<T> = T extends Array<infer U> ? U : undefined;
export type IndexOf<T> = T extends Array<infer U> ? U : never;
