import { style, globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens/contract.css";

// ============================================================================
// Base Styles
// ============================================================================

export const app = style({
  minHeight: "100vh",
  background: "#f8f9fa",
  fontFamily: "system-ui, -apple-system, sans-serif",
});

export const header = style({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  padding: `${tokens.kda.foundation.spacing.xl} ${tokens.kda.foundation.spacing.lg}`,
  textAlign: "center",
});

export const title = style({
  margin: `0 0 ${tokens.kda.foundation.spacing.xs}`,
  fontSize: "2rem",
});

export const subtitle = style({
  margin: 0,
  opacity: 0.9,
});

export const tabs = style({
  display: "flex",
  gap: tokens.kda.foundation.spacing.xs,
  padding: tokens.kda.foundation.spacing.md,
  background: "white",
  borderBottom: "1px solid #e9ecef",
  justifyContent: "center",
});

export const tab = style({
  padding: `${tokens.kda.foundation.spacing.sm} ${tokens.kda.foundation.spacing.md}`,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: "0.875rem",
  color: "#495057",
  borderRadius: tokens.kda.foundation.radius.md,
  transition: `all ${tokens.kda.foundation.transition.duration.d200}`,
  ":hover": {
    background: "#f1f3f4",
  },
});

export const tabActive = style({
  background: "#667eea",
  color: "white",
  ":hover": {
    background: "#5a6fd6",
  },
});

export const content = style({
  maxWidth: "900px",
  margin: "0 auto",
  padding: tokens.kda.foundation.spacing.lg,
});

export const demoSection = style({
  background: "white",
  borderRadius: tokens.kda.foundation.radius.lg,
  padding: tokens.kda.foundation.spacing.lg,
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
});

export const sectionTitle = style({
  margin: `0 0 ${tokens.kda.foundation.spacing.xs}`,
  color: "#212529",
});

export const sectionSubtitle = style({
  margin: `${tokens.kda.foundation.spacing.lg} 0 ${tokens.kda.foundation.spacing.md}`,
  color: "#495057",
  fontSize: "1rem",
});

export const description = style({
  color: "#6c757d",
  marginBottom: tokens.kda.foundation.spacing.lg,
});

globalStyle(`${description} code`, {
  background: "#f1f3f4",
  padding: "0.125rem 0.375rem",
  borderRadius: tokens.kda.foundation.radius.xs,
  fontSize: "0.875em",
});

export const footer = style({
  textAlign: "center",
  padding: tokens.kda.foundation.spacing.lg,
  color: "#6c757d",
  fontSize: "0.875rem",
});

globalStyle(`${footer} code`, {
  background: "#f1f3f4",
  padding: "0.125rem 0.375rem",
  borderRadius: tokens.kda.foundation.radius.xs,
});

// ============================================================================
// Spacing Demo Styles
// ============================================================================

export const spacingGrid = style({
  display: "flex",
  flexWrap: "wrap",
  gap: tokens.kda.foundation.spacing.md,
});

export const spacingItem = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: tokens.kda.foundation.spacing.xs,
});

export const spacingBox = style({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: tokens.kda.foundation.radius.xs,
  minWidth: "4px",
  minHeight: "4px",
});

export const tokenName = style({
  fontWeight: 600,
  fontSize: "0.75rem",
});

export const tokenVar = style({
  fontSize: "0.625rem",
  color: "#6c757d",
  maxWidth: "120px",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const spacingExample = style({
  display: "flex",
  gap: tokens.kda.foundation.spacing.md,
  flexWrap: "wrap",
});

export const card = style({
  background: "#f8f9fa",
  border: "1px solid #dee2e6",
  borderRadius: tokens.kda.foundation.radius.md,
  flex: 1,
  minWidth: "150px",
});

globalStyle(`${card} p`, {
  margin: 0,
  fontSize: "0.75rem",
});

// ============================================================================
// Size Demo Styles
// ============================================================================

export const sizeGrid = style({
  display: "flex",
  flexWrap: "wrap",
  gap: tokens.kda.foundation.spacing.lg,
  alignItems: "flex-end",
});

export const sizeItem = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: tokens.kda.foundation.spacing.xs,
});

export const sizeBox = style({
  background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  borderRadius: tokens.kda.foundation.radius.sm,
});

export const iconSizes = style({
  display: "flex",
  gap: tokens.kda.foundation.spacing.lg,
  alignItems: "center",
});

export const iconDemo = style({
  color: "#667eea",
});

globalStyle(`${iconDemo} svg`, {
  width: "100%",
  height: "100%",
});

// ============================================================================
// Radius Demo Styles
// ============================================================================

export const radiusGrid = style({
  display: "flex",
  flexWrap: "wrap",
  gap: tokens.kda.foundation.spacing.lg,
});

export const radiusItem = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: tokens.kda.foundation.spacing.xs,
});

export const radiusBox = style({
  width: "60px",
  height: "60px",
  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
});

export const buttonDemo = style({
  display: "flex",
  gap: tokens.kda.foundation.spacing.md,
  flexWrap: "wrap",
});

export const btn = style({
  padding: `${tokens.kda.foundation.spacing.sm} ${tokens.kda.foundation.spacing.lg}`,
  border: "none",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  fontSize: "0.875rem",
  cursor: "pointer",
  transition: `transform ${tokens.kda.foundation.transition.duration.d200}, box-shadow ${tokens.kda.foundation.transition.duration.d200}`,
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
  },
});

// ============================================================================
// Transition Demo Styles
// ============================================================================

export const transitionGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: tokens.kda.foundation.spacing.md,
});

export const transitionBox = style({
  background: "#f8f9fa",
  border: "2px solid #dee2e6",
  borderRadius: tokens.kda.foundation.radius.md,
  padding: tokens.kda.foundation.spacing.md,
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  gap: tokens.kda.foundation.spacing.xs,
});

globalStyle(`${transitionBox} span`, {
  fontWeight: 600,
  fontSize: "0.875rem",
});

globalStyle(`${transitionBox} code`, {
  fontSize: "0.625rem",
  color: "#6c757d",
  wordBreak: "break-all",
});

export const transitionBoxHovered = style({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderColor: "transparent",
  color: "white",
  transform: "scale(1.02)",
});

globalStyle(`${transitionBoxHovered} code`, {
  color: "rgba(255, 255, 255, 0.8)",
});
