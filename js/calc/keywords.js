(function (clc)
{
    /**
     * MathJS built-in constants.
     * As per MathJS 3.19.0.
     * http://mathjs.org/docs/reference/constants.html
     */
    clc.MATH_JS_CONSTANTS =
    [
        'e', 'E',
        'i',
        'Infinity', 'NaN', 'null',
        'LN2', 'LN10', 'LOG2E', 'LOG10E',
        'phi',
        'pi', 'PI', 'tau',
        'SQRT1_2', 'SQRT2',
        'uninitialized',
        'version'
    ];

    /**
     * MathJS built-in functions.
     * As per MathJS 3.19.0.
     * http://mathjs.org/docs/reference/functions.html
     */
    clc.MATH_JS_FUNCTIONS =
    [
        // Construction Functions
        'bignumber', 'boolean', 'chain', 'complex', 'createUnit', 'fraction', 'index', 'matrix', 'number', 'sparse', 'splitUnit', 'string', 'unit',

        // Expression Functions
        'compile', 'eval', 'help', 'parse', 'parser',

        // Algebra Functions
        'derivative', 'lsolve', 'lup', 'lusolve', 'qr', 'simplify', 'slu', 'usolve', 'rationalize',

        // Arithmetic Functions
        'abs', 'add', 'cbrt', 'ceil', 'cube', 'divide', 'dotDivide', 'dotMultiply', 'dotPow', 'exp', 'fix', 'floor', 'gcd', 'hypot',
        'lcm', 'log', 'log10', 'mod', 'multiply', 'norm', 'nthRoot', 'pow', 'round', 'sign', 'sqrt', 'square', 'subtract', 'unaryMinus', 'unaryPlus', 'xgcd',

        // Bitwise Functions
        'bitAnd', 'bitNot', 'bitOr', 'bitXor', 'leftShift', 'rightArithShift', 'rightLogShift',

        // Combinatorics Functions
        'bellNumbers', 'catalan', 'composition', 'stirlingS2',

        // Complex Functions
        'arg', 'conj', 'im', 're',

        // Geometry Functions
        'distance', 'intersect',

        // Logical Functions
        'and', 'not', 'or', 'xor',

        // Matrix Functions
        'concat', 'cross', 'det', 'diag', 'dot', 'eye', 'filter', 'flatten', 'forEach', 'inv', 'kron', 'map', 'ones', 'partitionSelect',
        'range', 'reshape', 'resize', 'size', 'sort', 'squeeze', 'subset', 'trace', 'transpose', 'zeros',

        // Probability Functions
        'combinations', 'factorial', 'gamma', 'kldivergence', 'multinomial', 'permutations', 'pickRandom', 'random', 'randomInt',

        // Relational Functions
        'compare', 'compareNatural', 'deepEqual', 'equal', 'larger', 'largerEq', 'smaller', 'smallerEq', 'unequal',

        // Set Functions
        'setCartesian', 'setDifference', 'setDistinct', 'setIntersect', 'setIsSubset', 'setMultiplicity', 'setPowerset', 'setSize', 'setSymDifference', 'setUnion',

        // Special Functions
        'erf',

        // Statistics Functions
        'mad', 'max', 'mean', 'median', 'min', 'mode', 'prod', 'quantileSeq', 'std', 'sum', 'var',

        // String Functions
        'format', 'print',

        // Trigonometry Functions
        'acos', 'acosh', 'acot', 'acoth', 'acsc', 'acsch', 'asec', 'asech', 'asin', 'asinh', 'atan', 'atan2', 'atanh',
        'cos', 'cosh', 'cot', 'coth', 'csc', 'csch', 'sec', 'sech', 'sin', 'sinh', 'tan', 'tanh',

        // Unit Functions
        'to',

        // Utils Functions
        'clone', 'isInteger', 'isNaN', 'isNegative', 'isNumeric', 'isPositive', 'isPrime', 'isZero', 'typeof'
    ];

    /**
     * Functions imported by Cl Calc.
     */
    clc.CLCALC_FUNCTIONS =
    [
        // Color
        'Color4b', 'color4b', 'color3b', 'color4f', 'colorU32', 'colorHsv', 'colorHsl', 'hsv', 'hsl', 'rgb', 'argb', 'argbf',

        // Base64
        'base64Encode', 'base64Decode',

        // Unicode
        'toCodePoints', 'fromCodePoints', 'toUtf8', 'fromUtf8',

        // Hashes
        'md5', 'sha1', 'sha224', 'sha256',

        // Lerp
        'lerp',

        // Plot
        'plot2d',

        // Radix
        'hex', 'bin'
    ];

    /**
     * List of keywords that will be autocompleted.
     */
    clc.COMPLETION_KEYWORDS =
    [
        // Constants
        'Infinity', 'NaN', 'null', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'phi', 'pi', 'PI', 'tau', 'SQRT1_2', 'SQRT2',

        // List of functions that make sense to be autocompleted
        'fraction',

        'derivative', 'lsolve', 'lup', 'lusolve', 'qr', 'simplify', 'slu', 'usolve', 'rationalize',

        'abs', 'cbrt', 'ceil', 'cube', 'dotDivide', 'dotMultiply', 'dotPow', 'exp', 'fix', 'floor', 'gcd', 'hypot',
        'lcm', 'log', 'log10', 'mod', 'norm', 'nthRoot', 'round', 'sign', 'sqrt', 'square', 'subtract', 'xgcd',

        'bellNumbers', 'catalan', 'composition', 'stirlingS2',

        'arg', 'conj', 'im', 're',

        'distance', 'intersect',

        'and', 'not', 'or', 'xor',

        'concat', 'cross', 'det', 'diag', 'dot', 'eye', 'filter', 'flatten', 'forEach', 'inv', 'kron', 'map', 'ones', 'partitionSelect',
        'range', 'reshape', 'resize', 'size', 'sort', 'squeeze', 'subset', 'trace', 'transpose', 'zeros',

        'combinations', 'factorial', 'gamma', 'kldivergence', 'multinomial', 'permutations', 'pickRandom', 'random', 'randomInt',

        'setCartesian', 'setDifference', 'setDistinct', 'setIntersect', 'setIsSubset', 'setMultiplicity', 'setPowerset', 'setSize', 'setSymDifference', 'setUnion',

        'erf',

        'mad', 'max', 'mean', 'median', 'min', 'mode', 'prod', 'quantileSeq', 'std', 'sum', 'var',

        'acos', 'acosh', 'acot', 'acoth', 'acsc', 'acsch', 'asec', 'asech', 'asin', 'asinh', 'atan', 'atan2', 'atanh',
        'cos', 'cosh', 'cot', 'coth', 'csc', 'csch', 'sec', 'sech', 'sin', 'sinh', 'tan', 'tanh',

        'to',

        'help',

        // Clear terminal
        'clear'
    ].concat(clc.CLCALC_FUNCTIONS);
}(window.clc = window.clc || {}));
