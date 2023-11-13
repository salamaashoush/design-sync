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
interface CompoundVariant<Variants extends VariantGroups> {
    variants: VariantSelection<Variants>;
    style: RecipeStyleRule;
}
type PatternOptions<Variants extends VariantGroups> = {
    base?: RecipeStyleRule;
    variants?: Variants;
    defaultVariants?: VariantSelection<Variants>;
    compoundVariants?: Array<CompoundVariant<Variants>>;
};
type RecipeClassNames<Variants extends VariantGroups> = {
    base: string;
    variants: VariantsClassNames<Variants>;
};
type RuntimeFn<Variants extends VariantGroups> = ((options?: VariantSelection<Variants>) => string) & {
    variants: () => (keyof Variants)[];
    classNames: RecipeClassNames<Variants>;
};
type RecipeVariants<RecipeFn extends RuntimeFn<VariantGroups>> = Parameters<RecipeFn>[0];

declare function recipe<Variants extends VariantGroups>(options: PatternOptions<Variants>, debugId?: string): RuntimeFn<Variants>;

export { RecipeVariants, RuntimeFn, recipe };
