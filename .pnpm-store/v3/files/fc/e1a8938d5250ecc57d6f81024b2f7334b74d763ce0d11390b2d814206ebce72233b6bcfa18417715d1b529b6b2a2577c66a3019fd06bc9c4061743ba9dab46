import { ComplexStyleRule } from '@vanilla-extract/css';

type RecipeStyleRule = ComplexStyleRule | string;
type VariantDefinitions = Record<string, RecipeStyleRule>;
type BooleanMap<T> = T extends 'true' | 'false' ? boolean : T;
type VariantGroups = Record<string, VariantDefinitions>;
type VariantSelection<Variants extends VariantGroups> = {
    [VariantGroup in keyof Variants]?: BooleanMap<keyof Variants[VariantGroup]>;
};
type VariantsClassNames<Variants extends VariantGroups> = {
    [P in keyof Variants]: {
        [PP in keyof Variants[P]]: string;
    };
};
type PatternResult<Variants extends VariantGroups> = {
    defaultClassName: string;
    variantClassNames: VariantsClassNames<Variants>;
    defaultVariants: VariantSelection<Variants>;
    compoundVariants: Array<[VariantSelection<Variants>, string]>;
};
type RecipeClassNames<Variants extends VariantGroups> = {
    base: string;
    variants: VariantsClassNames<Variants>;
};
type RuntimeFn<Variants extends VariantGroups> = ((options?: VariantSelection<Variants>) => string) & {
    variants: () => (keyof Variants)[];
    classNames: RecipeClassNames<Variants>;
};

declare const createRuntimeFn: <Variants extends VariantGroups>(config: PatternResult<Variants>) => RuntimeFn<Variants>;

export { createRuntimeFn };
