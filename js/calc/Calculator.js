(function (clc)
{
    /**
     * Class that performs expression evaluation.
     * @constructor
     * @param  {Object} mathJs Reference to MathJS library object.
     * @param  {Object} settings Reference to current settings.
     */
    clc.Calculator = function (mathJs, settings)
    {
        var self = this;

        this._mathJs = mathJs;
        this._mathJs.config({ 'number': 'BigNumber', 'precision': settings.precision });
        this._scope = {};
        this._extensions = [];
        this._settings = {
            'precision': settings.precision,
            'enableThousandsSeparator': settings.thousandsSeparatorEnabled
        };

        this._decimalNumberRegexp = new RegExp('^[\\d\\.-]+$', '');
        this._thousandsSeparator = '<span class="ts"></span>';
        this._thousandsSeparatorRegexp = new RegExp('<span class="ts"><\\/span>', 'g');

        this._numberFormatter = function (number)
        {
            var n = number.isBigNumber ?
                clc.dropTrailingZeroes(number.toFixed(self._settings.precision)) : number.toString();
            return self._settings.enableThousandsSeparator ? self._formatNumberAddDigitGrouping(n) : n;
        };

        this._registerAliases();
    };

    /**
     * Update calculator settings.
     * @param  {Object} settings
     */
    clc.Calculator.prototype.setSettings = function (settings)
    {
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
        var value = new clc.EvaluatedExpression();

        if (!clc.isStringBlank(expression))
        {
            var preprocessedExpression = this._preprocessExpression(expression);

            try
            {
                // Parse expression to AST
                var node = this._mathJs.parse(preprocessedExpression);

                // Get TeX representation of the original expression in case next commands will throw.
                value.tex = this._nodeToTex(node);

                // Evaluate expression in the global scope
                var evaluatedExpression = node.compile().evaluate(this._scope);

                // Evaluate and store command as a last evaluated command
                this._assignLastEvaluatedCommand(node, this._scope);

                if (this._isValidValue(evaluatedExpression))
                {
                    if (evaluatedExpression instanceof clc.CallbackResult)
                        value.result.raw = evaluatedExpression;
                    else
                    {
                        value.result.raw = this._mathJs.format(evaluatedExpression, this._numberFormatter);
                        value.result.postprocessed = this._postprocessValue(value.result.raw);
                        value.result.tex = this._valueToTex(value.result.raw);
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

        return value;
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
     * @param  {Object} value
     * @return {String}
     */
    clc.Calculator.prototype._postprocessValue = function (value)
    {
        for (var i = 0; i < this._extensions.length; ++i)
        {
            var extension = this._extensions[i];

            if (extension.postprocess)
                value = extension.postprocess(value);
        }

        return value;
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
            return node.toTex();
        }
        catch (e)
        {
            clc.log(e.name + ', ' + e.message);
            return 'Failed to convert expression to TeX';
        }
    };

    /**
     * Convert expression value to TeX.
     * @param  {String} value
     * @return {String}
     */
    clc.Calculator.prototype._valueToTex = function (value)
    {
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
     */
    clc.Calculator.prototype._registerAliases = function ()
    {
        var self = this;

        // nCr(n, k) -> combinations(n, k)
        if (!this._mathJs.nCr)
        {
            var nCr = this._mathJs.typed('nCr', {
                'BigNumber, BigNumber': function (n, k)
                {
                    return self._mathJs.combinations(n, k);
                }
            });
            nCr.toTex = self._mathJs.combinations.toTex;
            this._mathJs.import({ 'nCr': nCr });
        }

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
     * Store value of the given node into built-in '$' variable that represents last command.
     * @param {Object} node
     * @param {Object} scope
     */
    clc.Calculator.prototype._assignLastEvaluatedCommand = function (node, scope)
    {
        try
        {
            var expressionNode = node.clone(),
                symbolNode = new this._mathJs.SymbolNode('$'),
                assignmentNode = new this._mathJs.AssignmentNode(symbolNode, expressionNode);

            assignmentNode.compile();
            assignmentNode.evaluate(scope);
        }
        catch (e)
        {
            clc.log('Failed to create $ node for last evaluated expression: ' + e.name + ' ' + e.message);
        }
    };
}(window.clc = window.clc || {}));
