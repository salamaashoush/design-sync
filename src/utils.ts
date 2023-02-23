export function* createIdGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

export function getErrorMessage(error: unknown) {
  if (isError(error)) {
    return error.message;
  }
  return String(error);
}
