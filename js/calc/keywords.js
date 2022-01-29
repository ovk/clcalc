(function (clc)
{
    /**
     * MathJS built-in constants.
     * As per MathJS 10.1.0.
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
        'version'
    ];

    /**
     * MathJS built-in functions.
     * As per MathJS 10.1.0.
     * http://mathjs.org/docs/reference/functions.html
     */
    clc.MATH_JS_FUNCTIONS =
    [
        // Construction Functions
        'bignumber', 'boolean', 'chain', 'complex', 'createUnit', 'fraction', 'index', 'matrix', 'number', 'sparse', 'splitUnit', 'string', 'unit',

        // Expression Functions
        'compile', 'evaluate', 'help', 'parse', 'parser',

        // Algebra Functions
        'derivative', 'lsolve', 'lsolveAll', 'lup', 'lusolve', 'qr', 'simplify', 'slu', 'usolve', 'usolveAll', 'rationalize',

        // Arithmetic Functions
        'abs', 'add', 'cbrt', 'ceil', 'cube', 'divide', 'dotDivide', 'dotMultiply', 'dotPow', 'exp', 'expm1', 'fix', 'floor', 'gcd', 'hypot', 'invmod',
        'lcm', 'log', 'log10', 'log1p', 'log2', 'mod', 'multiply', 'norm', 'nthRoot', 'nthRoots', 'pow', 'round', 'sign', 'sqrt', 'square', 'subtract',
        'unaryMinus', 'unaryPlus', 'xgcd',

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
        'column', 'concat', 'count', 'cross', 'ctranspose', 'det', 'diag', 'diff', 'dot', 'eigs', 'expm', 'filter', 'flatten', 'forEach', 'getMatrixDataType',
        'identity', 'inv', 'kron', 'map', 'matrixFromColumns', 'matrixFromFunction', 'matrixFromRows', 'ones', 'partitionSelect', 'range', 'reshape', 'resize',
        'rotate', 'rotationMatrix', 'row', 'size', 'sort', 'sqrtm', 'squeeze', 'subset', 'trace', 'transpose', 'zeros',

        // Probability Functions
        'combinations', 'combinationsWithRep', 'factorial', 'gamma', 'kldivergence', 'multinomial', 'permutations', 'pickRandom', 'random', 'randomInt',

        // Relational Functions
        'compare', 'compareNatural', 'compareText', 'deepEqual', 'equal', 'equalText', 'larger', 'largerEq', 'smaller', 'smallerEq', 'unequal',

        // Set Functions
        'setCartesian', 'setDifference', 'setDistinct', 'setIntersect', 'setIsSubset', 'setMultiplicity', 'setPowerset', 'setSize',
        'setSymDifference', 'setUnion',

        // Special Functions
        'erf',

        // Statistics Functions
        'mad', 'max', 'mean', 'median', 'min', 'mode', 'prod', 'quantileSeq', 'std', 'sum', 'variance',

        // String Functions
        'bin', 'format', 'hex', 'oct', 'print',

        // Trigonometry Functions
        'acos', 'acosh', 'acot', 'acoth', 'acsc', 'acsch', 'asec', 'asech', 'asin', 'asinh', 'atan', 'atan2', 'atanh',
        'cos', 'cosh', 'cot', 'coth', 'csc', 'csch', 'sec', 'sech', 'sin', 'sinh', 'tan', 'tanh',

        // Unit Functions
        'to',

        // Utils Functions
        'clone', 'hasNumericValue', 'isInteger', 'isNaN', 'isNegative', 'isNumeric', 'isPositive', 'isPrime', 'isZero', 'numeric', 'typeOf'
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
    ];

    /**
     * Function aliases.
     */
    clc.ALIASES =
    [
        'nCr', 'nPr', 'ln'
    ];

    /**
     * JQuery Terminal commands
     */
    clc.TERMINAL_COMMANDS = 
    [
        'clear'
    ];

    /**
     * List of keywords that will be autocompleted.
     */
    clc.COMPLETION_KEYWORDS = [].concat(clc.MATH_JS_CONSTANTS, clc.MATH_JS_FUNCTIONS, clc.CLCALC_FUNCTIONS, clc.ALIASES, clc.TERMINAL_COMMANDS);
}(window.clc = window.clc || {}));
