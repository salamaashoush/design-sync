function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}

var createSprinkles = composeStyles => function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  var sprinklesStyles = Object.assign({}, ...args.map(a => a.styles));
  var sprinklesKeys = Object.keys(sprinklesStyles);
  var shorthandNames = sprinklesKeys.filter(property => 'mappings' in sprinklesStyles[property]);
  var sprinklesFn = props => {
    var classNames = [];
    var shorthands = {};
    var nonShorthands = _objectSpread2({}, props);
    var hasShorthands = false;
    for (var shorthand of shorthandNames) {
      var value = props[shorthand];
      if (value != null) {
        var sprinkle = sprinklesStyles[shorthand];
        hasShorthands = true;
        for (var propMapping of sprinkle.mappings) {
          shorthands[propMapping] = value;
          if (nonShorthands[propMapping] == null) {
            delete nonShorthands[propMapping];
          }
        }
      }
    }
    var finalProps = hasShorthands ? _objectSpread2(_objectSpread2({}, shorthands), nonShorthands) : props;
    var _loop = function _loop() {
      var propValue = finalProps[prop];
      var sprinkle = sprinklesStyles[prop];
      try {
        if (sprinkle.mappings) {
          // Skip shorthands
          return "continue";
        }
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          if (process.env.NODE_ENV !== 'production') {
            if (!sprinkle.values[propValue].defaultClass) {
              throw new Error();
            }
          }
          classNames.push(sprinkle.values[propValue].defaultClass);
        } else if (Array.isArray(propValue)) {
          for (var responsiveIndex = 0; responsiveIndex < propValue.length; responsiveIndex++) {
            var responsiveValue = propValue[responsiveIndex];
            if (responsiveValue != null) {
              var conditionName = sprinkle.responsiveArray[responsiveIndex];
              if (process.env.NODE_ENV !== 'production') {
                if (!sprinkle.values[responsiveValue].conditions[conditionName]) {
                  throw new Error();
                }
              }
              classNames.push(sprinkle.values[responsiveValue].conditions[conditionName]);
            }
          }
        } else {
          for (var _conditionName in propValue) {
            // Conditional style
            var _value = propValue[_conditionName];
            if (_value != null) {
              if (process.env.NODE_ENV !== 'production') {
                if (!sprinkle.values[_value].conditions[_conditionName]) {
                  throw new Error();
                }
              }
              classNames.push(sprinkle.values[_value].conditions[_conditionName]);
            }
          }
        }
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          class SprinklesError extends Error {
            constructor(message) {
              super(message);
              this.name = 'SprinklesError';
            }
          }
          var format = v => typeof v === 'string' ? "\"".concat(v, "\"") : v;
          var invalidPropValue = (prop, value, possibleValues) => {
            throw new SprinklesError("\"".concat(prop, "\" has no value ").concat(format(value), ". Possible values are ").concat(Object.keys(possibleValues).map(format).join(', ')));
          };
          if (!sprinkle) {
            throw new SprinklesError("\"".concat(prop, "\" is not a valid sprinkle"));
          }
          if (typeof propValue === 'string' || typeof propValue === 'number') {
            if (!(propValue in sprinkle.values)) {
              invalidPropValue(prop, propValue, sprinkle.values);
            }
            if (!sprinkle.values[propValue].defaultClass) {
              throw new SprinklesError("\"".concat(prop, "\" has no default condition. You must specify which conditions to target explicitly. Possible options are ").concat(Object.keys(sprinkle.values[propValue].conditions).map(format).join(', ')));
            }
          }
          if (typeof propValue === 'object') {
            if (!('conditions' in sprinkle.values[Object.keys(sprinkle.values)[0]])) {
              throw new SprinklesError("\"".concat(prop, "\" is not a conditional property"));
            }
            if (Array.isArray(propValue)) {
              if (!('responsiveArray' in sprinkle)) {
                throw new SprinklesError("\"".concat(prop, "\" does not support responsive arrays"));
              }
              var breakpointCount = sprinkle.responsiveArray.length;
              if (breakpointCount < propValue.length) {
                throw new SprinklesError("\"".concat(prop, "\" only supports up to ").concat(breakpointCount, " breakpoints. You passed ").concat(propValue.length));
              }
              for (var _responsiveValue of propValue) {
                if (!sprinkle.values[_responsiveValue]) {
                  invalidPropValue(prop, _responsiveValue, sprinkle.values);
                }
              }
            } else {
              for (var _conditionName2 in propValue) {
                var _value2 = propValue[_conditionName2];
                if (_value2 != null) {
                  if (!sprinkle.values[_value2]) {
                    invalidPropValue(prop, _value2, sprinkle.values);
                  }
                  if (!sprinkle.values[_value2].conditions[_conditionName2]) {
                    throw new SprinklesError("\"".concat(prop, "\" has no condition named ").concat(format(_conditionName2), ". Possible values are ").concat(Object.keys(sprinkle.values[_value2].conditions).map(format).join(', ')));
                  }
                }
              }
            }
          }
        }
        throw e;
      }
    };
    for (var prop in finalProps) {
      var _ret = _loop();
      if (_ret === "continue") continue;
    }
    return composeStyles(classNames.join(' '));
  };
  return Object.assign(sprinklesFn, {
    properties: new Set(sprinklesKeys)
  });
};

export { createSprinkles as c };
