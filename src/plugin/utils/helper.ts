export function updateTokensForNode(node: SceneNode, path: string) {
  const currentTokens = node.getPluginData("tokens");
  if (currentTokens) {
    const parsedTokens = JSON.parse(currentTokens);
    if (!parsedTokens.includes(path)) {
      node.setPluginData("tokens", JSON.stringify([...parsedTokens, path]));
    }
  } else {
    node.setPluginData("tokens", JSON.stringify([path]));
  }
}

export function get(obj: any, path: any, defaultValue = undefined) {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj
      );
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
}
