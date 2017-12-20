(function (clc)
{
    /**
     * Calculator extension that adds Color type.
     * @param  {Boolean} colorTooltips
     * @constructor
     */
    clc.ColorExtension = function (colorTooltips)
    {
        this._mathJs = null;

        this._colorLiteral4bRegexp = new RegExp('#[A-Fa-f0-9]{8}', 'g');
        this._colorLiteral43bRegexp = new RegExp('#[A-Fa-f0-9]{6,8}', 'g');

        if (colorTooltips)
        {
            this._visibleTooltipIds = [];
            this._initializeColorTooltips();
        }
    };

    /**
     * Extend MathJS with this extension.
     * @param  {Object} mathJs
     */
    clc.ColorExtension.prototype.extend = function (mathJs)
    {
        //var self = this;

        this._mathJs = mathJs;

        // Register Color type
        this._mathJs.typed.addType({
            'name': 'Color',
            'test': function (x)
            {
                return x && x instanceof clc.Color;
            }
        });

        // Special constructor which is called when color is constructed from literal. Needed to provide conversion to TeX for color literals.
        this._registerFunction('Color4b', 'BigNumber, BigNumber, BigNumber, BigNumber', function (a, r, g, b)
        {
            return clc.Color.from4b(a, r, g, b);
        }, false, function (node)
        {
            return '\\mathtt{\\' + clc.Color.from4b(parseInt(node.args[0].value), parseInt(node.args[1].value),
                parseInt(node.args[2].value), parseInt(node.args[3].value)).toString() + '}';
        });

        // Register explicit Color constructors
        this._registerFunction('color4b', 'BigNumber, BigNumber, BigNumber, BigNumber', function (a, r, g, b)
        {
            return clc.Color.from4b(a, r, g, b);
        });

        this._registerFunction('color3b', 'BigNumber, BigNumber, BigNumber', function (r, g, b)
        {
            return clc.Color.from4b(0xFF, r, g, b);
        });

        this._registerFunction('color4f', 'BigNumber, BigNumber, BigNumber, BigNumber', function (a, r, g, b)
        {
            return clc.Color.from4f(a, r, g, b);
        });

        this._registerFunction('colorU32', 'BigNumber', function (argb)
        {
            return clc.Color.fromU32(argb);
        });

        this._registerFunction('colorHsv', 'BigNumber, BigNumber, BigNumber', function (h, s, v)
        {
            return clc.Color.fromHsv(h, s, v);
        });

        this._registerFunction('colorHsl', 'BigNumber, BigNumber, BigNumber', function (h, s, l)
        {
            return clc.Color.fromHsl(h, s, l);
        });

        // Register conversion functions to HSV, HSL, RGB, ARGB, ARGBF
        this._registerFunction('hsv', 'Color', function (color)
        {
            return color.toHsv();
        }, true);

        this._registerFunction('hsl', 'Color', function (color)
        {
            return color.toHsl();
        }, true);

        this._registerFunction('rgb', 'Color', function (color)
        {
            return color.toArgb().splice(1);
        }, true);

        this._registerFunction('argb', 'Color', function (color)
        {
            return color.toArgb();
        }, true);

        this._registerFunction('argbf', 'Color', function (color)
        {
            return color.toArgbf();
        }, true);

        // Register arithmetic operations
        this._registerFunction('add', 'Color, Color', function (lhs, rhs)
        {
            return lhs.op(rhs.toArgbf(), function (a, b) { return a + b; });
        });

        this._registerFunction('subtract', 'Color, Color', function (lhs, rhs)
        {
            return lhs.op(rhs.toArgbf(), function (a, b) { return a - b; });
        });

        this._registerFunction('multiply', 'Color, Color', function (lhs, rhs)
        {
            return lhs.op(rhs.toArgbf(), function (a, b) { return a * b; });
        });

        this._registerFunction('multiply', 'Color, BigNumber', function (lhs, rhs)
        {
            return lhs.op([ rhs, rhs, rhs, rhs ], function (a, b) { return a * b; });
        });

        this._registerFunction('multiply', 'BigNumber, Color', function (lhs, rhs)
        {
            return rhs.op([ lhs, lhs, lhs, lhs ], function (a, b) { return a * b; });
        });

        this._registerFunction('divide', 'Color, Color', function (lhs, rhs)
        {
            return lhs.op(rhs.toArgbf(), function (a, b) { return a / b; });
        });

        this._registerFunction('divide', 'Color, BigNumber', function (lhs, rhs)
        {
            return lhs.op([ rhs, rhs, rhs, rhs ], function (a, b) { return a / b; });
        });
    };

    /**
     * Preprocess expression to construct color from literals.
     * @param  {String} expression
     * @return {String}
     */
    clc.ColorExtension.prototype.preprocess = function (expression)
    {
        return expression.replace(this._colorLiteral43bRegexp, function (match)
        {
            if (match.length !== 9 && match.length !== 7)
                throw new Error('Invalid color literal: ' + match);

            var rgbHex = match.substr(match.length === 9 ? 3 : 1),
                rHex = rgbHex.substr(0, 2), gHex = rgbHex.substr(2, 2), bHex = rgbHex.substr(4, 2),
                alphaHex = (match.length === 9) ? match.substr(1, 2) : 'FF';

            return 'Color4b(' + parseInt(alphaHex, 16) + ', '  + parseInt(rHex, 16) + ', ' + parseInt(gHex, 16) + ', ' + parseInt(bHex, 16) +  ')';
        });
    };

    /**
     * Postprocess expression to replace color literals with HTML template.
     * @param  {String} expression
     * @return {String}
     */
    clc.ColorExtension.prototype.postprocess = function (expression)
    {
        var self = this;

        return expression.replace(this._colorLiteral4bRegexp, function (match)
        {
            return self._generateColorSampleHtml(match);
        });
    };

    /**
     * Generate HTML code for color sample.
     * @param  {String} colorCode4b
     * @return {String}
     */
    clc.ColorExtension.prototype._generateColorSampleHtml = function (colorCode4b)
    {
        var colorCode3b = '#' + colorCode4b.substr(3),
            opacity = parseInt(colorCode4b.substr(1, 2), 16) / 255.0;
        return '<div class="color-sample" data-color="' + colorCode4b + '"><div style="background-color: ' + colorCode3b + '; opacity: ' + opacity + '">&nbsp;</div></div>';
    };

    /**
     * Initialize tooltips showing color codes.
     */
    clc.ColorExtension.prototype._initializeColorTooltips = function ()
    {
        var self = this;

        // Initialize tooltips for color-sample.
        $('body').tooltip({
            'placement': 'top',
            'container': 'body',
            'selector':  '.color-sample',
            'trigger':   'click',
            'template':  '<div class="tooltip color-sample-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
            'title': function ()
            {
                return $(this).data('color');
            }
        });

        // Store ID of each visible tooltip
        $(document).on('shown.bs.tooltip', '.color-sample', function(e)
        {
            self._visibleTooltipIds.push($(e.target).attr('aria-describedby'));
        });

        // Close all visible tooltips by click elsewhere
        $(document).on('click', function (e)
        {
            if (self._visibleTooltipIds.length)
            {
                var target = $(e.target),
                    parent = $(e.target).parent();

                if ($('.color-sample-tooltip').has(e.target).length)
                    return;

                if (target.hasClass('color-sample') || (parent && parent.length && parent.hasClass('color-sample')))
                    return;

                for (var i = 0; i < self._visibleTooltipIds.length; ++i)
                    $('#' + self._visibleTooltipIds[i]).tooltip('hide');

                self._visibleTooltipIds = [];
            }
        });

        // FIXME: Need this workaround for Bootstrap 3.3.7
        $(document).on('hidden.bs.tooltip', function (e)
        {
            $(e.target).data('bs.tooltip').inState.click = false;
        });
    };

    /**
     * Helper method to register function in MathJS.
     * @param  {String}   name
     * @param  {String}   types
     * @param  {Function} callback
     * @param  {Boolean}  arrayAndMatrix
     */
    clc.ColorExtension.prototype._registerFunction = function (name, types, callback, arrayAndMatrix, toTex)
    {
        try
        {
            var typed = {}, imp = {}, toTexFunction = toTex || null, self = this;
            typed[types] = callback;

            if (arrayAndMatrix)
            {
                typed['Array | Matrix'] = function (arg)
                {
                    return self._mathJs.map(arg, callback);
                };
            }

            imp[name] = this._mathJs.typed(name, typed);

            if (toTexFunction)
                imp[name].toTex = toTexFunction;

            this._mathJs.import(imp);
        }
        catch (e)
        {
            if (!e.data || !e.data.signature)
                throw e;
        }
    };
}(window.clc = window.clc || {}));
