(function (clc)
{
    /**
     * Class that corresponds for pretty printing math expressions using TeX.
     * @constructor
     */
    clc.TexHandler = function ()
    {
        // List of expressions that haven't been rendered yet.
        this._pendingExpressions = [];

        this._elements =
        {
            'togglePanelButton': $('#toggle-tex-panel-button'),
            'panel':             $('.tex-panel'),
            'panelWrapper':      $('.tex-wrapper')
        };

        this._katexLoadUrl = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.js';
        this._katexLoadInProgress = false;

        this._initializeUi();
    };

    /**
     * Add expression and it's value to render queue.
     * @param  {String} expression
     * @param  {String} value
     */
    clc.TexHandler.prototype.addEvaluatedExpression = function (expression, value)
    {
        this._pendingExpressions.push({ 'expression': expression, 'value': (value || null) });
        this._render();
    };

    /**
     * Clear all pending and rendered expressions.
     */
    clc.TexHandler.prototype.clear = function ()
    {
        this._pendingExpressions = [];
        this._elements.panel.empty();
    };

    /**
     * Check if tex panel is currently visible.
     * @return {Boolean}
     */
    clc.TexHandler.prototype._isPanelVisible = function ()
    {
        return this._elements.panelWrapper.css('display') !== 'none';
    };

    /**
     * Set TeX panel visible/hidden.
     * @param  {Boolean} isVisible
     */
    clc.TexHandler.prototype._setPanelVisible = function (isVisible)
    {
        if (isVisible)
            this._elements.panelWrapper.css('display', $(window).width() < 768 ? 'table-row' : 'table-cell');
        else
            this._elements.panelWrapper.css('display', 'none');
    };

    /**
     * Initialize UI.
     */
    clc.TexHandler.prototype._initializeUi = function ()
    {
        var self = this;

        this._elements.togglePanelButton.click(function ()
        {
            if (!self._isPanelVisible())
                self._showPanel();
            else
                self._hidePanel();
        });
    };

    /**
     * Show TeX panel and render all expressions.
     * On first invocation will load katex library.
     */
    clc.TexHandler.prototype._showPanel = function ()
    {
        var self = this;

        this._elements.togglePanelButton.addClass('active');

        if (typeof katex === 'undefined')
            this._loadKatex(function () { self._showPanel(); });
        else
        {
            this._setPanelVisible(true);
            this._render();
        }
    };

    /**
     * Hide panel.
     */
    clc.TexHandler.prototype._hidePanel = function ()
    {
        this._elements.togglePanelButton.removeClass('active');
        this._setPanelVisible(false);
    };

    /**
     * Load katex library.
     * @param  {Function} callback
     */
    clc.TexHandler.prototype._loadKatex = function (callback)
    {
        var self = this;

        if (this._katexLoadInProgress)
            return;

        this._katexLoadInProgress = true;

        $.getScript(this._katexLoadUrl).done(function ()
        {
            self._katexLoadInProgress = false;
            callback();
        }).fail(function (xhr, settings, exception)
        {
            self._katexLoadInProgress = false;
            clc.log('Failed to load Katex library: ' + exception.name + ', ' + exception.message);
        });
    };

    /**
     * Render all pending expressions, if panel is visible.
     */
    clc.TexHandler.prototype._render = function ()
    {
        if (this._isPanelVisible())
        {
            for (var i = 0; i < this._pendingExpressions.length; ++i)
            {
                var e = this._pendingExpressions[i],
                    blockElement = $('<div class="tex-block"></div>'),
                    expressionElement = $('<div class="tex-expression"></div>');

                this._elements.panel.append(blockElement);
                blockElement.append(expressionElement);

                katex.render(e.expression, expressionElement[0]);

                if (e.value !== null)
                {
                    var valueElement = $('<div class="tex-value"></div>');

                    blockElement.append(valueElement);
                    katex.render(e.value, valueElement[0]);
                }
            }

            if (this._pendingExpressions.length)
            {
                this._pendingExpressions = [];

                // Scroll TeX panel to the bottom.
                this._elements.panel.scrollTop(this._elements.panel[0].scrollHeight);
            }
        }
    };
}(window.clc = window.clc || {}));
