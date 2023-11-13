import { MaybeAccessor } from "@kobalte/utils";
export interface CreateFormControlFieldProps {
    /**
     * The HTML id attribute of the field.
     * If no id prop is provided, a generated id will be used.
     */
    id?: MaybeAccessor<string | undefined>;
    /** The HTML aria-label attribute of the field. */
    "aria-label"?: MaybeAccessor<string | undefined>;
    /** The HTML aria-labelledby attribute of the field. */
    "aria-labelledby"?: MaybeAccessor<string | undefined>;
    /** The HTML  attribute of the field. */
    "aria-describedby"?: MaybeAccessor<string | undefined>;
}
export declare const FORM_CONTROL_FIELD_PROP_NAMES: readonly ["id", "aria-label", "aria-labelledby", "aria-describedby"];
export declare function createFormControlField(props: CreateFormControlFieldProps): {
    fieldProps: {
        id: () => string;
        ariaLabel: () => string;
        ariaLabelledBy: () => string;
        ariaDescribedBy: () => string;
    };
};
