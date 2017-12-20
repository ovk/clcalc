(function (clc)
{
    /**
     * Class that is returned as a result of evaluating expression in calculator.
     * @constructor
     */
    clc.EvaluatedExpression = function ()
    {
        // TeX representation of the original expression (for pretty printing).
        this.tex = null;

        // Evaluated result of the expression
        this.result =
        {
            'raw': null,
            'postprocessed': null
        };
    };
}(window.clc = window.clc || {}));
