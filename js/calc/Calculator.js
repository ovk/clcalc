(function (clc)
{
    /**
     * Class that performs expression evaluation.
     * @constructor
     * @param {Object} mathJs Reference to MathJS library object.
     * @param {Object} settings Reference to current settings.
     * @param {String} helpMessage Help message (output of 'help' command)
     */
    clc.Calculator = function (mathJs, settings, helpMessage)
    {
        var self = this;

        this._mathJs = mathJs;
        this._mathJs.config({ 'number': 'BigNumber', 'precision': settings.precision });
        this._scope = {};
        this._extensions = [];
        this._settings = {
            'precision': settings.precision,
            'outputNumberFormat': settings.outputNumberFormat,
            'enableThousandsSeparator': settings.thousandsSeparatorEnabled
        };

        this._decimalNumberRegexp = new RegExp('^[\\d\\.-]+$', '');
        this._thousandsSeparator = '<span class="ts"></span>';
        this._thousandsSeparatorRegexp = new RegExp('<span class="ts"><\\/span>', 'g');

        this._numberFormatter = function (number)
        {
            if (self._settings.outputNumberFormat === 'fixed')
            {
                var n = number.isBigNumber ?
                    clc.dropTrailingZeroes(number.toFixed(self._settings.precision)) : number.toString();

                return self._settings.enableThousandsSeparator ? self._formatNumberAddDigitGrouping(n) : n;
            }
            else
            {
                return self._mathJs.format(number, {notation: self._settings.outputNumberFormat });
            }
        };

        // Register some function aliases
        var functionAliases = this._registerAliases();

        // Initialize additional TeX handlers
        this._initializeCustomTexHandler(functionAliases);

        // Stores a reference to last evaluated expression result (for '$' shorthand)
        this._lastExpressionResult = undefined;

        // Import some internal functions
        this._mathJs.import({
            '_lastResultRef': function ()
            {
                return self._lastExpressionResult;
            },
            '_printHelp': function ()
            {
                return {
                    type: 'Help',
                    toString: function ()
                    {
                        return this.message; 
                    },
                    message: helpMessage
                };
            }
        }, { 'override': true });

        // Initialize help (extends help to handle aliases)
        this._initializeHelp(functionAliases);
    };

    /**
     * Update calculator settings.
     * @param  {Object} settings
     */
    clc.Calculator.prototype.setSettings = function (settings)
    {
        this._settings.outputNumberFormat = settings.outputNumberFormat;
        this._settings.precision = settings.precision;
        this._settings.enableThousandsSeparator = settings.thousandsSeparatorEnabled;

        this._mathJs.config({ 'number': 'BigNumber', 'precision': settings.precision });
    };

    /**
     * Install extension into the calculator.
     * @param  {Object} extension
     */
    clc.Calculator.prototype.installExtension = function (extension)
    {
        extension.extend(this._mathJs);
        this._extensions.push(extension);
    };

    /**
     * Evaluate given expression.
     * @param  {String} expression
     * @return {EvaluatedExpression}
     */
    clc.Calculator.prototype.evaluate = function (expression)
    {
        var expr = new clc.EvaluatedExpression();

        if (!clc.isStringBlank(expression))
        {
            var preprocessedExpression = this._preprocessExpression(expression);

            try
            {
                // Parse expression to AST
                var node = this._mathJs.parse(preprocessedExpression);

                // Get TeX representation of the original expression in case next commands will throw.
                expr.tex = this._nodeToTex(node);

                // Apply all necessary transformations to the AST
                node = this._transformAst(node);

                // Evaluate expression in the global scope
                var evaluatedExpression = node.compile().evaluate(this._scope);

                // Store a reference to the result
                this._storeLastExpressionResult(evaluatedExpression);

                if (this._isValidValue(evaluatedExpression))
                {
                    if (evaluatedExpression instanceof clc.CallbackResult)
                        expr.result.raw = evaluatedExpression;
                    else
                    {
                        expr.result.raw = this._mathJs.format(evaluatedExpression, this._numberFormatter);
                        expr.result.postprocessed = this._postprocessValue(expr.result.raw, evaluatedExpression);
                        expr.result.tex = this._valueToTex(expr.result.raw, evaluatedExpression);
                    }
                }
            }
            catch (error)
            {
                if (!error.message)
                    error.message = 'Failed to parse expression';

                if (expression !== preprocessedExpression)
                    error.message += '. Preprocessed expression: \'' + preprocessedExpression + '\'';

                throw error;
            }
        }

        return expr;
    };

    /**
     * Preprocess expressions through registered extensions.
     * @param  {String} expression
     * @return {String}
     */
    clc.Calculator.prototype._preprocessExpression = function (expression)
    {
        for (var i = 0; i < this._extensions.length; ++i)
        {
            var extension = this._extensions[i];

            if (extension.preprocess)
                expression = extension.preprocess(expression);
        }

        return expression;
    };

    /**
     * Postprocess evaluated epression value through registered extensions.
     * @param  {Object} formattedValue
     * @param  {Object} originalValue
     * @return {String}
     */
    clc.Calculator.prototype._postprocessValue = function (formattedValue, originalValue)
    {
        if (typeof originalValue === 'object' && originalValue.type === 'Help')
        {
            // Special case for formatting help output (e.g. from 'help(sin)')
            return '<pre>' + formattedValue + '</pre>';
        }
        else
        {
            for (var i = 0; i < this._extensions.length; ++i)
            {
                var extension = this._extensions[i];

                if (extension.postprocess)
                    formattedValue = extension.postprocess(formattedValue);
            }
        }

        return formattedValue;
    };

    /**
     * Convert expression node to TeX representation.
     * @param  {Object} node
     * @return {String}
     */
    clc.Calculator.prototype._nodeToTex = function (node)
    {
        try
        {
            return node.toTex({ 'handler': this._customTexHandler });
        }
        catch (e)
        {
            clc.log(e.name + ', ' + e.message);
            return '-';
        }
    };

    /**
     * Convert expression value to TeX.
     * @param  {String} value - postprocessed result value.
     * @param  {Object} originalValue - original value, before formatting and postprocessing.
     * @return {String}
     */
    clc.Calculator.prototype._valueToTex = function (value, originalValue)
    {
        // Don't try to convert help output to Tex
        if (typeof originalValue === 'object' && originalValue.type === 'Help')
        {
            return undefined;
        }

        try
        {
            // Remove all thousands separator tags that may have been added
            value = value.replace(this._thousandsSeparatorRegexp, '');

            // FIXME: this is very ugly and inefficient way of converting value to TeX.
            // Reconsider this once https://github.com/josdejong/mathjs/issues/988 is addressed.
            var node = this._mathJs.parse(this._preprocessExpression(value));
            return node.toTex();
        }
        catch (e)
        {
            clc.log(e.name + ', ' + e.message);
            return 'Failed to convert expression value to TeX';
        }
    };

    /**
     * Check whether the evaluated value is a meaningful (human-readable) value.
     * @param  {Object} value
     * @return {Boolean}
     */
    clc.Calculator.prototype._isValidValue = function (value)
    {
        return (typeof value !== 'undefined' && typeof value !== 'function');
    };

    /**
     * Register aliases for MathJS functions
     * @return {Object}
     */
    clc.Calculator.prototype._registerAliases = function ()
    {
        var self = this;
        var aliases = {};

        // nCr(n, k) -> combinations(n, k)
        if (!this._mathJs.nCr)
        {
            var nCr = this._mathJs.typed('nCr', {
                'BigNumber, BigNumber': function (n, k)
                {
                    return self._mathJs.combinations(n, k);
                }
            });

            this._mathJs.import({ 'nCr': nCr });
        }

        aliases.nCr = {
            'name': 'combinations',
            'help': new self._mathJs.Help({
                'name': 'nCr',
                'category': 'Aliases',
                'description': '\'nCr\' is an alias for \'combinations\', see \'help(combinations)\' for more information',
                'syntax': [ 'nCr(n, k)' ],
                'seealso': [ 'combinations' ]
            })
        };

        // nPr(n) -> permutations(n)
        // nPr(n, k) -> permutations(n, k)
        if (!this._mathJs.nPr)
        {
            var nPr = this._mathJs.typed('nPr', {
                'BigNumber': function (n)
                {
                    return self._mathJs.permutations(n);
                },
                'BigNumber, BigNumber': function (n, k)
                {
                    return self._mathJs.permutations(n, k);
                }
            });

            this._mathJs.import({ 'nPr': nPr });
        }

        aliases.nPr = {
            'name': 'permutations',
            'help': new self._mathJs.Help({
                'name': 'nPr',
                'category': 'Aliases',
                'description': '\'nPr\' is an alias for \'permutations\', see \'help(permutations)\' for more information',
                'syntax': [ 'nPr(n)', 'nPr(n, k)' ],
                'seealso': [ 'permutations' ]
            })
        };

        // ln(x) -> log(x)
        if (!this._mathJs.ln)
        {
            var ln = this._mathJs.typed('ln', {
                'BigNumber': function (x)
                {
                    return self._mathJs.log(x);
                },
            });

            this._mathJs.import({ 'ln': ln });
        }

        aliases.ln = {
            'name': 'log',
            'help': new self._mathJs.Help({
                'name': 'ln',
                'category': 'Aliases',
                'description': '\'ln\' is an alias for \'log\' with \'e\' as the base (natural logarithm), see \'help(log)\' for more information',
                'syntax': [ 'ln(x)' ],
                'seealso': [ 'log' ]
            })
        };

        return aliases;
    };

    /**
     * Initialize custom Tex handler
     * @param {Object} functionAliases
     */
    clc.Calculator.prototype._initializeCustomTexHandler = function (functionAliases)
    {
        var self = this;

        this._customTexHandler = function (node, options)
        {
            if (node.type === 'FunctionNode' && node.name && node.name in functionAliases)
            {
                var alias = new self._mathJs.FunctionNode(functionAliases[node.name].name, node.args);
                return alias.toTex(options);
            }
            else if (node.name === '$')
            {
                // Custom Tex format for last evaluated expression result ('$')
                if (node.type === 'SymbolNode')
                    return '\\mathtt{\\$}';
                else if (node.type === 'FunctionNode')
                    return node.toTex().replace('$', '\\$');
            }
        };
    };

    /**
     * Add digit grouping to given stringified number.
     * @param  {String} n
     * @return {String}
     */
    clc.Calculator.prototype._formatNumberAddDigitGrouping = function (n)
    {
        return this._decimalNumberRegexp.test(n) ? clc.addThousandsSeparator(n, this._thousandsSeparator) : n;
    };

    /**
     * Keep a reference to last result for '$' shorthand
     * @param {Object} result
     */
    clc.Calculator.prototype._storeLastExpressionResult = function (result)
    {
        if (typeof result === 'undefined' || result === null || result instanceof clc.CallbackResult)
            this._lastExpressionResult = undefined;
        else
            this._lastExpressionResult = result;
    };

    /**
     * Apply necessary transformations to the expression AST before evaluation.
     * @param {Object} root
     * @return {Object}
     */
    clc.Calculator.prototype._transformAst = function (root)
    {
        var self = this;

        // Special case to print help message on 'help' command
        if (root.type === 'SymbolNode' && root.name === 'help')
        {
            return new self._mathJs.FunctionNode('_printHelp', []);
        }

        // Transform the $ node into the constant referencing previous expression result
        return root.transform(function (node)
        {
            return (node.isSymbolNode && node.name === '$') ? new self._mathJs.ConstantNode(self._lastExpressionResult) : node;
        });
    };

    clc.Calculator.prototype._initializeHelp = function (aliases)
    {
        var origHelp = this._mathJs.help;

        this._mathJs.help = function (search)
        {
            var name = typeof search === 'function' ? search.name : search;

            if (name && aliases[name])
                return aliases[name].help;

            return origHelp(search);
        };
    };
}(window.clc = window.clc || {}));
