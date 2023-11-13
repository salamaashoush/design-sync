import { StyleRule } from '@vanilla-extract/css';

type CSSProps = Omit<StyleRule, "selectors" | "@media" | "@supports">;
type DataAttributeState = "valid" | "invalid" | "required" | "disabled" | "readonly" | "checked" | "indeterminate" | "selected" | "pressed" | "expanded" | "closed" | "highlighted" | "current";
type DataAttributeStyles = {
    [key in DataAttributeState]?: CSSProps & {
        not?: CSSProps;
    };
};
type ComponentStateStyleOptions = {
    /**
     * Apply the given parent selector to the `StyleRule` data-* attribute selector
     */
    parentSelector?: string;
};
declare function componentStateStyles(styles: DataAttributeStyles, options?: ComponentStateStyleOptions): StyleRule;

export { DataAttributeState, DataAttributeStyles, componentStateStyles };
