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
