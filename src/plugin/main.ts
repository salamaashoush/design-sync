import { ApplyTokenMessage, ResizeMessage, UIMessageEvent } from "../messages";
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

function handleApplyTokenMessage(msg: ApplyTokenMessage) {
  const {
    payload: { token, path },
  } = msg;
  const nodes = figma.currentPage.selection;
  for (const node of nodes) {
    // apply token to selected node
    if (isColorToken(token)) {
      applyColorTokenToNode(token.value, node);
    }
    if (isBorderToken(token)) {
      applyBorderTokenToNode(token.value, node);
    }

    if (isSpacingToken(token)) {
      applySpacingTokenToNode(token.value, node);
    }

    if (isSizingToken(token)) {
      applySizingTokenToNode(token.value, node);
    }

    if (isFontWeightToken(token)) {
      applyFontTokensToNode({ fontWeight: token.value }, node);
    }

    if (isFontSizeToken(token)) {
      applyFontSizeTokenToNode(token.value, node);
    }

    if (isLineHeightToken(token)) {
      applyLineHeightTokenToNode(token.value, node);
    }

    if (isBorderWidthToken(token)) {
      applyBorderWidthTokenToNode(token.value, node);
    }

    if (isBorderRadiusToken(token)) {
      applyBorderRadiusTokenToNode(token.value, node);
    }

    if (isTextCaseToken(token)) {
      applyTextCaseTokenToNode(token.value, node);
    }

    if (isLetterSpacingToken(token)) {
      applyLetterSpacingTokenToNode(token.value, node);
    }

    if (isTextDecorationToken(token)) {
      applyTextDecorationTokenToNode(token.value, node);
    }

    if (isTypographyToken(token)) {
      applyTypographyTokenToNode(token.value, node);
    }

    if (isBoxShadowToken(token)) {
      nodes.forEach((node) => {
        console.log(node);
      });
      appBoxShadowTokenToNode(token.value, node);
    }

    if (isComponentToken(token) && node.type === "COMPONENT") {
      applyComponentTokenToNode(token.value, node);
    }

    if (isCompositionToken(token)) {
      const resolvedValue = backend.resolveTokenValue(token.value);
      applyCompositionTokenToNode(resolvedValue, node);
    }
  }
}

function handleResizeMessage(msg: ResizeMessage) {
  const { payload } = msg;
  const { width, height } = payload;
  figma.ui.resize(width, height);
}

figma.ui.onmessage = (msg: UIMessageEvent) => {
  if (msg.type === "Resize") {
    handleResizeMessage(msg);
  }

  if (msg.type === "ApplyToken") {
    handleApplyTokenMessage(msg);
  }

  // figma.closePlugin();
};

rpcServer.handle("token-sets/get", async () => {
  console.log("handle", "token-sets/get");
  const sets = await backend.getTokens();
  return { sets };
});
