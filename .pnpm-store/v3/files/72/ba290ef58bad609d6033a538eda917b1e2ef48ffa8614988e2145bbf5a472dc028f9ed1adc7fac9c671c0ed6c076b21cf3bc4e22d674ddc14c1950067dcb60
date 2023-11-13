import { addRecipe } from '@vanilla-extract/css/recipe';
import { style, styleVariants } from '@vanilla-extract/css';
import { m as mapValues, c as createRuntimeFn } from './createRuntimeFn-f8e161c6.esm.js';

function recipe(options, debugId) {
  var {
    variants = {},
    defaultVariants = {},
    compoundVariants = [],
    base
  } = options;
  var defaultClassName;
  if (!base || typeof base === 'string') {
    var baseClassName = style({});
    defaultClassName = base ? "".concat(baseClassName, " ").concat(base) : baseClassName;
  } else {
    defaultClassName = style(base, debugId);
  }

  // @ts-expect-error
  var variantClassNames = mapValues(variants, (variantGroup, variantGroupName) => styleVariants(variantGroup, styleRule => typeof styleRule === 'string' ? [styleRule] : styleRule, debugId ? "".concat(debugId, "_").concat(variantGroupName) : variantGroupName));
  var compounds = [];
  for (var {
    style: theStyle,
    variants: _variants
  } of compoundVariants) {
    compounds.push([_variants, typeof theStyle === 'string' ? theStyle : style(theStyle, "".concat(debugId, "_compound_").concat(compounds.length))]);
  }
  var config = {
    defaultClassName,
    variantClassNames,
    defaultVariants,
    compoundVariants: compounds
  };
  return addRecipe(createRuntimeFn(config), {
    importPath: '@vanilla-extract/recipes/createRuntimeFn',
    importName: 'createRuntimeFn',
    // @ts-expect-error
    args: [config]
  });
}

export { recipe };
