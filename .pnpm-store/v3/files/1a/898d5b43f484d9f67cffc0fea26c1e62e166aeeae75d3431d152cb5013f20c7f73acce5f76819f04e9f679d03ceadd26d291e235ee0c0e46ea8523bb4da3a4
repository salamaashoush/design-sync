/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/38a57d3360268fb0cb55c6b42b9a5f6f13bb57d6/packages/@react-aria/breadcrumbs/src/useBreadcrumbs.ts
 */
import { OverrideComponentProps } from "@kobalte/utils";
import { JSX } from "solid-js";
import { AsChildProp } from "../polymorphic";
export interface BreadcrumbsRootOptions extends AsChildProp {
    /**
     * The visual separator between each breadcrumb item.
     * It will be used as the default children of `Breadcrumbs.Separator`.
     */
    separator?: string | JSX.Element;
}
export interface BreadcrumbsRootProps extends OverrideComponentProps<"nav", BreadcrumbsRootOptions> {
}
/**
 * Breadcrumbs show hierarchy and navigational context for a user’s location within an application.
 */
export declare function BreadcrumbsRoot(props: BreadcrumbsRootProps): JSX.Element;
