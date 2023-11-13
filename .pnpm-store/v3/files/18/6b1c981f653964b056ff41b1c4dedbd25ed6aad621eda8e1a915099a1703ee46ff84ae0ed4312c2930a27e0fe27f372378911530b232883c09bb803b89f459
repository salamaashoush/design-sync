import { ComponentProps, JSX, ValidComponent } from "solid-js";
import { DynamicProps } from "solid-js/web";
export interface AsChildProp {
    /** Whether the component should render as its direct `As` child component. */
    asChild?: boolean;
    /** The component to render when `children` doesn't contain any `<As>` component as direct child. */
    as?: ValidComponent;
}
export type PolymorphicProps<T extends ValidComponent, P = ComponentProps<T>> = {
    [K in keyof P]: P[K];
} & AsChildProp;
/**
 * A utility component that render either a direct `<As>` child or its `as` prop.
 */
export declare function Polymorphic<T extends ValidComponent>(props: PolymorphicProps<T>): JSX.Element;
/**
 * A utility component used to delegate rendering of its `Polymorphic` parent component.
 */
export declare function As<T extends ValidComponent>(props: DynamicProps<T>): JSX.Element;
