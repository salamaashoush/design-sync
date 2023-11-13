import { OverrideComponentProps, ValidationState } from "@kobalte/utils";
import { JSX } from "solid-js";
import { AsChildProp } from "../polymorphic";
export interface TextFieldRootOptions extends AsChildProp {
    /** The controlled value of the text field. */
    value?: string;
    /**
     * The default value when initially rendered.
     * Useful when you do not need to control the value.
     */
    defaultValue?: string;
    /** Event handler called when the value of the text field changes. */
    onChange?: (value: string) => void;
    /**
     * A unique identifier for the component.
     * The id is used to generate id attributes for nested components.
     * If no id prop is provided, a generated id will be used.
     */
    id?: string;
    /**
     * The name of the text field, used when submitting an HTML form.
     * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
     */
    name?: string;
    /** Whether the text field should display its "valid" or "invalid" visual styling. */
    validationState?: ValidationState;
    /** Whether the user must fill the text field before the owning form can be submitted. */
    required?: boolean;
    /** Whether the text field is disabled. */
    disabled?: boolean;
    /** Whether the text field is read only. */
    readOnly?: boolean;
}
export interface TextFieldRootProps extends OverrideComponentProps<"div", TextFieldRootOptions> {
}
/**
 * A text input that allow users to input custom text entries with a keyboard.
 */
export declare function TextFieldRoot(props: TextFieldRootProps): JSX.Element;
