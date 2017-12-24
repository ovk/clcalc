(function (clc)
{
    /**
     * Construct 2D function graph.
     * @constructor
     * @param  {Object} expression
     * @param  {String} variable
     * @param  {Object} domain
     * @param  {Object} scope
     * @param  {Object} parameters
     * @param  {Object} mathJs
     */
    clc.FunctionPlot2D = function (expression, variable, domain, scope, plotParameters, mathJs)
    {
        this.id = clc.randomId('plot2d-');
        this._mathJs = mathJs;

        var graphWidth = plotParameters.totalWidth - plotParameters.axisYWidth,
            graphHeight = plotParameters.totalHeight - plotParameters.axisXHeight - plotParameters.legendHeight,
            initialScale = Math.abs(graphWidth / (domain[1] - domain[0])),
            initialOffsetX = (graphWidth / 2) - (domain[0] + domain[1]) * 0.5 * initialScale;

        this._graphParameters = {
            'size': {
                'width':  graphWidth,
                'height': graphHeight
            },
            'transform': {
                'x': { 'scale':  initialScale, 'offset': initialOffsetX },
                'y': { 'scale': -initialScale, 'offset': graphHeight / 2 }
            },
            'scale': {
                'x': { 'begin': 0, 'step': 0 },
                'y': { 'begin': 0, 'step': 0 }
            },
            'offset': {
                'x': plotParameters.axisYWidth,
                'y': plotParameters.legendHeight
            },
            'state': {
                'isDragging': false,
                'beginDragX': 0,
                'beginDragY': 0
            }
        };

        this._function = {
            'expression': expression,
            'variable':   variable,
            'domain':     domain,
            'scope':      scope
        };

        this._attributes = {
            'svg': {
                'id':     this.id,
                'class':  'function-plot2d',
                'width':  plotParameters.totalWidth,
                'height': plotParameters.totalHeight
            },
            'svg.legend.text': {
                'class':       'function-plot2d-legend',
                'text-anchor': 'end',
                'x':           plotParameters.totalWidth,
                'y':           15
            },
            'svg.canvas.g': {
                'class':     'function-plot2d-canvas',
                'transform': 'translate(0, ' + plotParameters.legendHeight + ')'
            },
            'svg.canvas.defs.clipPath': {
                'id': 'clip-path-' + this.id
            },
            'svg.canvas.defs.clipPath.rect': {
                'width':  this._graphParameters.size.width,
                'height': this._graphParameters.size.height
            },
            'svg.canvas.axisX.g': {
                'class':     'function-plot2d-axis-x',
                'transform': 'translate(' + plotParameters.axisYWidth + ', ' + this._graphParameters.size.height + ')'
            },
            'svg.canvas.axisX.g.path': {
                'shape-rendering': 'crispedges',
                'd':      'M0,0H' + this._graphParameters.size.width
            },
            'svg.canvas.axisX.g.scale.g.text': {
                'style': 'text-anchor: middle;',
                'y':     '1.5em'
            },
            'svg.canvas.axisX.g.scale.g.line': {
                'x1': 0,
                'y1': 0,
                'x2': 0,
                'y2': 5,
                'shape-rendering': 'crispedges',
                'stroke-width': 1,
            },
            'svg.canvas.axisY.g': {
                'class':     'function-plot2d-axis-y',
                'transform': 'translate(' + plotParameters.axisYWidth + ', 0)'
            },
            'svg.canvas.axisY.g.path': {
                'shape-rendering': 'crispedges',
                'd':      'M0,0V' + (this._graphParameters.size.height)
            },
            'svg.canvas.axisY.g.scale.g.text': {
                'style': 'text-anchor: end;',
                'x':     '-0.5em',
                'dy':    '0.31em'
            },
            'svg.canvas.axisY.g.scale.g.line': {
                'x1': 0,
                'y1': 0,
                'x2': -5,
                'y2': 0,
                'shape-rendering': 'crispedges',
                'stroke-width': 1
            },
            'svg.canvas.eventGrabArea.rect': {
                'class':  'function-plot2d-event-grab',
                'width':  this._graphParameters.size.width,
                'height': this._graphParameters.size.height,
                'fill':   'none',
                'x':      plotParameters.axisYWidth
            },
            'svg.canvas.graph.g': {
                'transform': 'translate(' + plotParameters.axisYWidth + ', 0)',
                'clip-path': 'url(#clip-path-' + this.id + ')'
            },
            'svg.canvas.graph.originX.path': {
                'class':        'function-plot2d-origin-x',
                'stroke-width': '1',
                'shape-rendering': 'crispedges',
                'd':            'M0,' + this._toScreenY(0) + 'H' + this._graphParameters.size.width
            },
            'svg.canvas.graph.originY.path': {
                'class':        'function-plot2d-origin-y',
                'stroke-width': '1',
                'shape-rendering': 'crispedges',
                'd':            'M' + this._toScreenX(0) + ',0' + 'V' + this._graphParameters.size.height
            },
            'svg.canvas.graph.data.path': {
                'class':          'function-plot2d-graph',
                'stroke-width':   1,
                'fill':           'none',
                'stroke-linecap': 'round',
                'd':              ''
            }
        };

        this._xmlns = 'http://www.w3.org/2000/svg';

        this._elements = {};

        this.update();
    };

    /**
     * Check if given mousescroll event will be consumed by one of the function graphs.
     * @param  {Object} e
     * @return {Boolean}
     */
    clc.FunctionPlot2D.isEventConsumed = function (e)
    {
        return $(e.target).closest('.function-plot2d-event-grab').length === 1;
    };

    /**
     * Generate complete SVG code for this plot in it's current state.
     * @return {String}
     */
    clc.FunctionPlot2D.prototype.svg = function ()
    {
        this._elements = {};

        return clc.htmlTag('svg', this._attributes.svg, [
            this._legend(),
            this._canvas() ]);
    };

    /**
     * Update this plot.
     */
    clc.FunctionPlot2D.prototype.update = function ()
    {
        if (!this._elements.svg)
        {
            var svg = $('#' + this.id);
            if (svg.length)
            {
                this._elements.svg = svg.eq(0);
                this._elements.axis = {
                    'x': this._elements.svg.find('.' + this._attributes['svg.canvas.axisX.g']['class']).eq(0),
                    'y': this._elements.svg.find('.' + this._attributes['svg.canvas.axisY.g']['class']).eq(0)
                };
                this._elements.origin = {
                    'x': this._elements.svg.find('.' + this._attributes['svg.canvas.graph.originX.path']['class']).eq(0),
                    'y': this._elements.svg.find('.' + this._attributes['svg.canvas.graph.originY.path']['class']).eq(0)
                };
                this._elements.graph = this._elements.svg.find('.' + this._attributes['svg.canvas.graph.data.path']['class']).eq(0);
            }
        }

        this._updateAxisScale();
        this._updateOrigin();
        this._updateFunctionData();
    };

    /**
     * Set current mouse point coordinates (to update legend).
     * @param  {Number} clientX
     * @param  {Number} clientY
     */
    clc.FunctionPlot2D.prototype.setPointerCoordinates = function (svgX, svgY)
    {
        if (!this._elements.legend)
            this._elements.legend = $('#' + this.id + ' .' + this._attributes['svg.legend.text']['class']);

        var unitsPerPixel = 1 / this._graphParameters.transform.x.scale,
            magnitudePerPixel = Math.floor(Math.log10(unitsPerPixel)),
            precision = Math.abs(clc.clamp(magnitudePerPixel - 1, -15, 0)),
            x = (+(this._fromScreenX(svgX - this._graphParameters.offset.x)).toFixed(precision)).toString(),
            y = (+(this._fromScreenY(svgY - this._graphParameters.offset.y)).toFixed(precision)).toString();

        this._elements.legend.text('X: ' + x + ', Y: ' + y);
    };

    /**
     * Clear legend text.
     */
    clc.FunctionPlot2D.prototype.clearLegend = function ()
    {
        if (!this._elements.legend)
            this._elements.legend = $('#' + this.id + ' .' + this._attributes['svg.legend.text']['class']);
        this._elements.legend.text('');
    };

    /**
     * Zoom in/out by one step depending on the direction.
     * @param  {Number} direction
     */
    clc.FunctionPlot2D.prototype.zoom = function (direction)
    {
        var factor = direction > 0 ? 1.1 : 0.9;

        this._graphParameters.transform.x.scale *= factor;
        this._graphParameters.transform.y.scale *= factor;

        this.update();
    };

    /**
     * Begin draggin the graph. X and Y are in screen coordinate space.
     * @param  {Number} x
     * @param  {Number} y
     */
    clc.FunctionPlot2D.prototype.beginDrag = function (x, y)
    {
        this._graphParameters.state.isDragging = true;
        this._graphParameters.state.beginDragX = x;
        this._graphParameters.state.beginDragY = y;
    };

    /**
     * End dragging the graph.
     */
    clc.FunctionPlot2D.prototype.endDrag = function ()
    {
        this._graphParameters.state.isDragging = false;
    };

    /**
     * On graph drag.
     * @param  {Number} x
     * @param  {Number} y
     */
    clc.FunctionPlot2D.prototype.onDrag = function (x, y)
    {
        if (this._graphParameters.state.isDragging)
        {
            this._graphParameters.transform.x.offset += x - this._graphParameters.state.beginDragX;
            this._graphParameters.transform.y.offset += y - this._graphParameters.state.beginDragY;

            this._graphParameters.state.beginDragX = x;
            this._graphParameters.state.beginDragY = y;

            this.update();
        }
    };

    /**
     * Generate SVG code for plot legend.
     * @return {String}
     */
    clc.FunctionPlot2D.prototype._legend = function ()
    {
        return clc.htmlTag('text', this._attributes['svg.legend.text']);
    };

    /**
     * Generate SVG code for canvas element.
     * @return {String}
     */
    clc.FunctionPlot2D.prototype._canvas = function ()
    {
        return clc.htmlTag('g', this._attributes['svg.canvas.g'], [
            this._defs(),
            this._axisX(),
            this._axisY(),
            this._graph(),
            this._eventGrabArea() ]);
    };

    /**
     * Generate SVG code for clip path definitions.
     * @return {String}
     */
    clc.FunctionPlot2D.prototype._defs = function ()
    {
        return clc.htmlTag('defs', null,
            clc.htmlTag('clipPath', this._attributes['svg.canvas.defs.clipPath'],
                clc.htmlTag('rect', this._attributes['svg.canvas.defs.clipPath.rect'])));
    };

    /**
     * Generate SVG code for X axis and scale.
     * @return {String}
     */
    clc.FunctionPlot2D.prototype._axisX = function ()
    {
        var axis = this._axisXScale(false);

        axis.push(clc.htmlTag('path', this._attributes['svg.canvas.axisX.g.path']));

        return clc.htmlTag('g', this._attributes['svg.canvas.axisX.g'], axis);
    };

    /**
     * Generate SVG code for Y axis and scale.
     * @return {String}
     */
    clc.FunctionPlot2D.prototype._axisY = function ()
    {
        var axis = this._axisYScale(false);

        axis.push(clc.htmlTag('path', this._attributes['svg.canvas.axisY.g.path']));

        return clc.htmlTag('g', this._attributes['svg.canvas.axisY.g'], axis);
    };

    /**
     * Generate SVG code for X axis scale (ticks and numbers).
     * @param  {Boolean} isElementsMode
     * @return {Array}
     */
    clc.FunctionPlot2D.prototype._axisXScale = function (isElementsMode)
    {
        var self = this, result = [],
            tag = isElementsMode ? function (t, a, c) { return clc.domElement(self._xmlns, t, a, c); } : clc.htmlTag,
            bounds = this._boundsX();

        for (var x = this._graphParameters.scale.x.begin; x <= bounds[1]; x += this._graphParameters.scale.x.step)
        {
            var e = tag('g', { 'transform': 'translate(' + this._toScreenX(x) + ', 0)' }, [
                tag('text', this._attributes['svg.canvas.axisX.g.scale.g.text'], this._prettyPrintNumber(x)),
                tag('line', this._attributes['svg.canvas.axisX.g.scale.g.line']) ]);
            result.push(e);
        }

        return result;
    };

    /**
     * Generate SVG code for Y axis scale (ticks and numbers).
     * @param  {Boolean} isElementsMode
     * @return {Array}
     */
    clc.FunctionPlot2D.prototype._axisYScale = function (isElementsMode)
    {
        var self = this, result = [],
            tag = isElementsMode ? function (t, a, c) { return clc.domElement(self._xmlns, t, a, c); } : clc.htmlTag,
            bounds = this._boundsY();

        for (var y = this._graphParameters.scale.y.begin; y <= bounds[1]; y += this._graphParameters.scale.y.step)
        {
            var e = tag('g', { 'transform': 'translate(0, ' + this._toScreenY(y)+ ')' }, [
                tag('text', this._attributes['svg.canvas.axisY.g.scale.g.text'], this._prettyPrintNumber(y)),
                tag('line', this._attributes['svg.canvas.axisY.g.scale.g.line']) ]);
            result.push(e);
        }

        return result;
    };

    /**
     * Generate SVG code for the graph area.
     * @return {String}
     */
    clc.FunctionPlot2D.prototype._graph = function ()
    {
        this._attributes['svg.canvas.graph.data.path'].d = this._data;

        return clc.htmlTag('g', this._attributes['svg.canvas.graph.g'], [
            this._origin(),
            clc.htmlTag('path', this._attributes['svg.canvas.graph.data.path']) ]);
    };

    /**
     * Generate SVG code for the origin lines (x = 0, y = 0).
     * @return {String}
     */
    clc.FunctionPlot2D.prototype._origin = function ()
    {
        return clc.htmlTag('path', this._attributes['svg.canvas.graph.originX.path']) +
               clc.htmlTag('path', this._attributes['svg.canvas.graph.originY.path']);
    };

    /**
     * Update origin lines.
     */
    clc.FunctionPlot2D.prototype._updateOrigin = function ()
    {
        if (this._elements.origin)
        {
            this._elements.origin.x.attr('d', 'M0,' + this._toScreenY(0) + 'H' + this._graphParameters.size.width);
            this._elements.origin.y.attr('d', 'M' + this._toScreenX(0) + ',0' + 'V' + this._graphParameters.size.height);
        }
    };

    /**
     * Generate SVG code for pointer events grab area.
     * @return {String}
     */
    clc.FunctionPlot2D.prototype._eventGrabArea = function ()
    {
        return clc.htmlTag('rect', this._attributes['svg.canvas.eventGrabArea.rect']);
    };

    /**
     * Resample and update current graph function data.
     */
    clc.FunctionPlot2D.prototype._updateFunctionData = function ()
    {
        this._data = this._sampleFunctionData();

        if (this._elements.graph)
            this._elements.graph.attr('d', this._data);
    };

    /**
     * Sample function value at each pixel and retun SVG data string for path.
     * @return {String}
     */
    clc.FunctionPlot2D.prototype._sampleFunctionData = function ()
    {
        var step = 1 / this._graphParameters.transform.x.scale,
            maxCoordinate = 0x40000000, // To avoid weird bug that makes graph path hidden
            domain = this._boundsX(), mode = 'M', y, isDefined, isNumber, isBigNumber, result = '';

        for (var x = domain[0]; x <= domain[1]; x += step)
        {
            // Inject current argument variable into the scope
            this._function.scope[this._function.variable] = this._mathJs.bignumber(x);

            // Evaluate expression value at given point
            y = this._function.expression.eval(this._function.scope);

            // Check if function is defined at this point
            isDefined = !(typeof y === 'undefined' || y === null);
            isNumber = (typeof y === 'number' || y instanceof Number);
            isBigNumber = y.toNumber ? true : false;

            if (isDefined && ((isNumber && isFinite(y)) || (isBigNumber && y.isFinite())))
            {
                var n = clc.clamp(this._toScreenY(isBigNumber ? y.toNumber() : y), -maxCoordinate, maxCoordinate);

                result += mode + clc.round1Dec(this._toScreenX(x)) + ', ' + clc.round1Dec(n);
                mode = 'L';
            }
            else
                mode = 'M'; // If function is undefined at this point, switch to "move" mode until it becomes defined again.
        }

        return result;
    };

    /**
     * Update axis scale parameters based on current scale.
     */
    clc.FunctionPlot2D.prototype._updateAxisScale = function ()
    {
        this._graphParameters.scale.x = this._calculateScaleParameters(this._boundsX()[0], this._graphParameters.size.width / this._graphParameters.transform.x.scale);
        this._graphParameters.scale.y = this._calculateScaleParameters(this._boundsY()[0], -this._graphParameters.size.height / this._graphParameters.transform.y.scale);

        if (this._elements.axis)
        {
            // Update X axis scale ticks and numbers
            this._elements.axis.x.find('g').remove();

            var elements = this._axisXScale(true), i;

            for (i = 0; i < elements.length; ++i)
                this._elements.axis.x.append(elements[i]);

            // Update Y axis scale ticks and numbers
            this._elements.axis.y.find('g').remove();

            elements = this._axisYScale(true);

            for (i = 0; i < elements.length; ++i)
                this._elements.axis.y.append(elements[i]);
        }
    };

    /**
     * Calculate axis scale parameters (first tick, step).
     * @param  {Number} intervalBegin
     * @param  {Number} unitsVisible
     * @return {Object}
     */
    clc.FunctionPlot2D.prototype._calculateScaleParameters = function (intervalBegin, unitsVisible)
    {
        var magnitude = Math.pow(10, Math.floor(Math.log10(unitsVisible) + 0.2)),
            relativeScale = unitsVisible / magnitude,
            quantifiedScale = (relativeScale <= 1.5 ? 1 : (relativeScale <= 3 ? 2 : 5)),
            step = quantifiedScale * magnitude / 10,
            beginStepNumber = Math.ceil(intervalBegin / step),
            begin = (step >= 1 ? beginStepNumber * step : (beginStepNumber * ((10 / magnitude) * step) / (10 / magnitude)));

        return { 'begin': begin, 'step': step };
    };

    /**
     * Convert number to string.
     * @param  {Number} number
     * @return {Number}
     */
    clc.FunctionPlot2D.prototype._prettyPrintNumber = function (number)
    {
        return (number == 0) ? '0': ((+(number).toFixed(14)).toString());
    };

    /**
     * Convert x coordinate from function space to graph (screen) space.
     * @param  {Number} x
     * @return {Number}
     */
    clc.FunctionPlot2D.prototype._toScreenX = function (x)
    {
        return x * this._graphParameters.transform.x.scale + this._graphParameters.transform.x.offset;
    };

    /**
     * Convert y coordinate from function space to graph (screen) space.
     * @param  {Number} y
     * @return {Number}
     */
    clc.FunctionPlot2D.prototype._toScreenY = function (y)
    {
        return y * this._graphParameters.transform.y.scale + this._graphParameters.transform.y.offset;
    };

    /**
     * Convert x coordinate from graph (screen) space to function space.
     * @param  {Number} x
     * @return {Number}
     */
    clc.FunctionPlot2D.prototype._fromScreenX = function (x)
    {
        return (x - this._graphParameters.transform.x.offset) / this._graphParameters.transform.x.scale;
    };

    /**
     * Convert y coordinate from graph (screen) space to function space.
     * @param  {Number} y
     * @return {Number}
     */
    clc.FunctionPlot2D.prototype._fromScreenY = function (y)
    {
        return (y - this._graphParameters.transform.y.offset) / this._graphParameters.transform.y.scale;
    };

    /**
     * Get interval [min, max] in function coordinate space so that on graph it covers X axis completely.
     * @return {Array}
     */
    clc.FunctionPlot2D.prototype._boundsX = function ()
    {
        return [ this._fromScreenX(0), this._fromScreenX(this._graphParameters.size.width) ];
    };

    /**
     * Get interval [min, max] in function coordinate space so that on graph it covers Y axis completely.
     * @return {Array}
     */
    clc.FunctionPlot2D.prototype._boundsY = function ()
    {
        return [ this._fromScreenY(this._graphParameters.size.height), this._fromScreenY(0) ];
    };

}(window.clc = window.clc || {}));
