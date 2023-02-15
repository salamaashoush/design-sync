import { Message, MessageType } from "../messages";
import {
  appBoxShadowTokenToNode,
  applyBorderRadiusTokenToNode,
  applyBorderTokenToNode,
  applyBorderWidthTokenToNode,
  applyColorTokenToNode,
  applyFontSizeTokenToNode,
  applyFontWeightTokenToNode,
  applyLetterSpacingTokenToNode,
  applyLineHeightTokenToNode,
  applySizingTokenToNode,
  applySpacingTokenToNode,
  applyTextCaseTokenToNode,
  applyTextDecorationTokenToNode,
  applyTypographyTokenToNode,
} from "./apply";
import {
  isBorderRadiusToken,
  isBorderToken,
  isBorderWidthToken,
  isBoxShadowToken,
  isColorToken,
  isFontSizeToken,
  isFontWeightToken,
  isLetterSpacingToken,
  isLineHeightToken,
  isSizingToken,
  isSpacingToken,
  isTextCaseToken,
  isTextDecorationToken,
  isTypographyToken,
} from "./is";

figma.showUI(__html__);
figma.ui.resize(500, 700);

figma.ui.onmessage = (msg: Message) => {
  if (msg.type === MessageType.Resize) {
    const {
      payload: { width, height },
    } = msg;
    figma.ui.resize(width, height);
  }

  if (msg.type === MessageType.ApplyToken) {
    const {
      payload: { token, path },
    } = msg;
    const nodes = figma.currentPage.selection;

    // apply token to selected node
    if (isColorToken(token)) {
      applyColorTokenToNode(token, nodes);
    }
    if (isBorderToken(token)) {
      applyBorderTokenToNode(token, nodes);
    }

    if (isSpacingToken(token)) {
      applySpacingTokenToNode(token, nodes);
    }

    if (isSizingToken(token)) {
      applySizingTokenToNode(token, nodes);
    }

    if (isFontWeightToken(token)) {
      applyFontWeightTokenToNode(token, nodes);
    }

    if (isFontSizeToken(token)) {
      applyFontSizeTokenToNode(token, nodes);
    }

    if (isLineHeightToken(token)) {
      applyLineHeightTokenToNode(token, nodes);
    }

    if (isBorderWidthToken(token)) {
      applyBorderWidthTokenToNode(token, nodes);
    }

    if (isBorderRadiusToken(token)) {
      applyBorderRadiusTokenToNode(token, nodes);
    }

    if (isTextCaseToken(token)) {
      applyTextCaseTokenToNode(token, nodes);
    }

    if (isLetterSpacingToken(token)) {
      applyLetterSpacingTokenToNode(token, nodes);
    }

    if (isTextDecorationToken(token)) {
      applyTextDecorationTokenToNode(token, nodes);
    }

    if (isTypographyToken(token)) {
      applyTypographyTokenToNode(token, nodes);
    }

    if (isBoxShadowToken(token)) {
      nodes.forEach((node) => {
        console.log(node);
      });
      appBoxShadowTokenToNode(token, nodes);
    }
  }

  // figma.closePlugin();
};

export {};
