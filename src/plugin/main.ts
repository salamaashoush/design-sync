import { RpcCallParam } from "../rpc/calls";
import { rpcServer } from "../rpc/server";
import { backend } from "./backend";
import {
  appBoxShadowTokenToNode,
  applyBorderRadiusTokenToNode,
  applyBorderTokenToNode,
  applyBorderWidthTokenToNode,
  applyColorTokenToNode,
  applyComponentTokenToNode,
  applyCompositionTokenToNode,
  applyFontSizeTokenToNode,
  applyFontTokensToNode,
  applyLetterSpacingTokenToNode,
  applyLineHeightTokenToNode,
  applySizingTokenToNode,
  applySpacingTokenToNode,
  applyTextCaseTokenToNode,
  applyTextDecorationTokenToNode,
  applyTypographyTokenToNode,
} from "./utils/apply";
import {
  isBorderRadiusToken,
  isBorderToken,
  isBorderWidthToken,
  isBoxShadowToken,
  isColorToken,
  isComponentToken,
  isCompositionToken,
  isFontSizeToken,
  isFontWeightToken,
  isLetterSpacingToken,
  isLineHeightToken,
  isSizingToken,
  isSpacingToken,
  isTextCaseToken,
  isTextDecorationToken,
  isTypographyToken,
} from "./utils/is";

figma.showUI(__html__);
figma.ui.resize(500, 700);

rpcServer.handle("tokens/get", async () => {
  console.log("handle", "token-sets/get");
  const sets = await backend.getTokens();
  return { sets };
});

rpcServer.handle("resize", async ({ height, width }) => {
  figma.ui.resize(width, height);
});

rpcServer.handle("tokens/apply", async ({ token, path, target }) => {
  if (target === "selection") {
    handleApplyTokenMessage({ token });
  }
});
figma.on("selectionchange", () => {
  const nodes = figma.currentPage.selection;
  rpcServer.emit("selectionchange", {
    selection: nodes.map((node) => node.id),
  });
});
