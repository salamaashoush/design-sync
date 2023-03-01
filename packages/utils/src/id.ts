export function* createIdGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}
