import { ParentProps } from "solid-js";
import { MenuOptions } from "./menu";
export interface MenuRootOptions extends MenuOptions {
    /**
     * A unique identifier for the component.
     * The id is used to generate id attributes for nested components.
     * If no id prop is provided, a generated id will be used.
     */
    id?: string;
    /**
     * Whether the menu should be the only visible content for screen readers.
     * When set to `true`:
     * - interaction with outside elements will be disabled.
     * - scroll will be locked.
     * - focus will be locked inside the menu content.
     * - elements outside the menu content will not be visible for screen readers.
     */
    modal?: boolean;
    /** Whether the scroll should be locked even if the menu is not modal. */
    preventScroll?: boolean;
    /**
     * Used to force mounting the menu (portal, positioner and content) when more control is needed.
     * Useful when controlling animation with SolidJS animation libraries.
     */
    forceMount?: boolean;
}
export interface MenuRootProps extends ParentProps<MenuRootOptions> {
}
/**
 * Root component for a menu, provide context for its children.
 * Used to build dropdown menu, context menu and menubar.
 */
export declare function MenuRoot(props: MenuRootProps): import("solid-js").JSX.Element;
