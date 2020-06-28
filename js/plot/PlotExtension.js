(function (clc)
{
    /**
     * Extension that adds function plot support.
     * @constructor
     */
    clc.PlotExtension = function ()
    {
        this._mathJs = null;
        this._plots = {};

        this._defaultPlotParameters = {
            'totalWidth':   500,
            'totalHeight':  350,
            'legendHeight': 20,
            'axisXHeight':  25,
            'axisYWidth':   50
        };

        this._initializeEventListeners();
    };

    /**
     * Extend MathJS with this extension.
     * @param  {Object} mathJs
     */
    clc.PlotExtension.prototype.extend = function (mathJs)
    {
        var self = this;

        this._mathJs = mathJs;

        // Register plot2d function
        if (!this._mathJs.plot2d)
        {
            var plot2d = function (args, math, scope)
            {
                return self._functionPlot2D(args, scope);
            };

            plot2d.rawArgs = true;
            this._mathJs.import({ 'plot2d': plot2d });
        }
    };

    /**
     * Setup event listeners for all plots.
     */
    clc.PlotExtension.prototype._initializeEventListeners = function ()
    {
        var self = this;

        function getPlotSvg(target)
        {
            return $(target).parent().parent();
        }

        $(document).on({
            'mousemove': function (e)
            {
                var plotSvg = getPlotSvg(e.target),
                    plot = self._plots[plotSvg.attr('id')],
                    offset = plotSvg.offset();

                plot.setPointerCoordinates(Math.round(e.pageX - offset.left), Math.round(e.pageY - offset.top));
                plot.onDrag(e.clientX, e.clientY);
                e.preventDefault();
            },
            'mouseout': function (e)
            {
                var plot = self._plots[getPlotSvg(e.target).attr('id')];
                plot.clearLegend();
                plot.endDrag();
            },
            'mousedown': function (e)
            {
                var plot = self._plots[getPlotSvg(e.target).attr('id')];
                plot.beginDrag(e.clientX, e.clientY);
                e.preventDefault();
            },
            'mouseup': function (e)
            {
                var plot = self._plots[getPlotSvg(e.target).attr('id')];
                plot.endDrag();
                e.preventDefault();
            },
            'mousewheel': function (e)
            {
                var plot = self._plots[getPlotSvg(e.target).attr('id')];
                plot.zoom(e.deltaY);
            }
        }, '.function-plot2d-event-grab');
    };

    /**
     * Generate 2d function plot.
     * @param  {Array} args
     * @param  {Object} scope
     * @return {CallbackResult}
     */
    clc.PlotExtension.prototype._functionPlot2D = function (args, scope)
    {
        var arguments = this._getPlot2dArguments(args, scope),
            plot = new clc.FunctionPlot2D(arguments.expression, arguments.variable, arguments.domain, scope, this._defaultPlotParameters, this._mathJs);

        this._plots[plot.id] = plot;

        return new clc.CallbackResult(function () { return plot.svg(); });
    };

    /**
     * Validate and convert arguments for plot2d.
     * @param  {Array} args
     * @param  {Object} scope
     * @return {Object}
     */
    clc.PlotExtension.prototype._getPlot2dArguments = function (args, scope)
    {
        var result = {};

        if (!args || args.length !== 3)
            throw new Error('\'plot2d\' function expects 3 arguments: function expression, argument variable, argument domain interval');

        if (args[0].type !== 'FunctionNode' && args[0].type !== 'OperatorNode' && args[0].type !== 'SymbolNode' && args[1].type !== 'ConstantNode')
            throw new Error('First argument must be an expression');

        if (args[1].type !== 'SymbolNode')
            throw new Error('Second argument must be an independent variable name');

        if (args[2].type !== 'ArrayNode' || args[2].items.length !== 2)
            throw new Error('Third argument must be an interval representing domain of a function');

        result.domain = [ clc.mathJsToValidNumber(args[2].items[0].evaluate(scope)), clc.mathJsToValidNumber(args[2].items[1].evaluate(scope)) ];

        if (result.domain[0] >= result.domain[1])
            throw new Error('Domain interval must be in form [min, max] where min < max');

        // Widen domain by 10% to add more visibility
        result.domain[0] = result.domain[0] - Math.abs(result.domain[0] * 0.1);
        result.domain[1] = result.domain[1] + Math.abs(result.domain[1] * 0.1);

        result.expression = args[0].compile();
        result.variable = args[1].name;

        return result;
    };
}(window.clc = window.clc || {}));
