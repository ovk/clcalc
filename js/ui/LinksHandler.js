(function (clc)
{
    /**
     * Class that corresponds for expression/log link generation, processing and UI.
     * @param {Function} getExpressionCallback
     * @constructor
     */
    clc.LinksHandler = function (getExpressionCallback)
    {
        this._getExpressionCallback = getExpressionCallback || null;
        this._isLogLinkButtonEnabled = true;

        this._elements =
        {
            'logLinkButton': $('#generate-log-link-button')
        };

        var isCopyingToClipboardSupported = this._isCopyingToClipboardSupported();

        this._popoverTemplateId = isCopyingToClipboardSupported ? '#template-create-link-popover' : '#template-create-link-popover-no-copy';
        this._expressionLinkButtonHtml = $('#template-create-expression-link-button').html();

        if (getExpressionCallback)
        {
            this._initializeLogLinkUi();
            this._initializeExpressionLinkUi();

            // FIXME: Need this workaround for Bootstrap 3.4.1
            // Otherwise popower won't show up on click after previous one was closed
            $(document).on('hidden.bs.popover', function (e)
            {
                $(e.target).data('bs.popover').inState.click = false;
            });

            // Set a global event delegate for button to copy from link popovers into clipboard (if supported)
            if (isCopyingToClipboardSupported)
            {
                $(document).on('click', '.copy-link-to-clipboard', function (e)
                {
                    try
                    {
                        // Select text inside text fiel that contains URL
                        $(e.target).parents('.input-group').find('input').select();

                        // Try to copy it to clipboard
                        if (!document.execCommand('copy'))
                            throw new Error('Failed to execute execCommand("copy")');
                    }
                    catch (err)
                    {
                        clc.log('Failed to copy to clipboard: ' + err.name + ', ' + err.message);
                    }
                });
            }
        }
    };

    /**
     * Set log link button enabled/disabled.
     * @param {Boolean} isEnabled
     */
    clc.LinksHandler.prototype.setLogLinkButtonEnabled = function (isEnabled)
    {
        if (this._isLogLinkButtonEnabled !== isEnabled)
        {
            this._isLogLinkButtonEnabled = isEnabled;
            this._elements.logLinkButton.toggleClass('disabled', !this._isLogLinkButtonEnabled);
        }
    };

    /**
     * Get list of expressions from the current URL.
     * Returns null if URL doesn't contain list of expressions.
     * @return {Array}
     */
    clc.LinksHandler.prototype.getExpressionsListFromUrl = function ()
    {
        var serialized = this._getExpressonsListFromUrl();
        if (serialized === null)
            return null;

        try
        {
            return this._deserializeExpressionsList(serialized);
        }
        catch (e)
        {
            clc.log(e.name + ', ' + e.message);
            return null;
        }
    };

    /**
     * Inject expression link button into given DOM element.
     * @param {Object} element
     */
    clc.LinksHandler.prototype.injectExpressionLinkButton = function (element)
    {
        element.append(this._expressionLinkButtonHtml);
    };

    /**
     * Check whether copying to clipboard from JS is supported (document.execCommand('copy')).
     * @return {Boolean}
     */
    clc.LinksHandler.prototype._isCopyingToClipboardSupported = function ()
    {
        try
        {
            return document.queryCommandSupported('copy') ? true : false;
        }
        catch (e)
        {
            return false;
        }
    };

    /**
     * Initialize UI components for log link popover.
     */
    clc.LinksHandler.prototype._initializeLogLinkUi = function ()
    {
        var self = this;

        // Initialize popover
        this._elements.logLinkButton.popover({
            'placement': function() { return $(window).width() < 768 ? 'bottom' : 'right'; },
            'container': 'body',
            'html':      true,
            'title':     'Link Generated',
            'trigger':   'manual',
            'sanitize':  false,
            'content':   function ()
            {
                return $(self._popoverTemplateId).html().replace('{link}', self._getExpressionsLink());
            }
        });

        // Show when log link button clicked
        this._elements.logLinkButton.click(function ()
        {
            if (self._isLogLinkButtonEnabled)
                $(this).popover('show');
        });

        // Automatically focus and select link when popover is shown
        this._elements.logLinkButton.on('shown.bs.popover', function()
        {
            var id = $(this).attr('aria-describedby');
            $('#' + id + ' input').focus().select();
            $(this).addClass('active');
        });

        // Remove active css class from link button when popover is hidden
        this._elements.logLinkButton.on('hidden.bs.popover', function()
        {
            $(this).removeClass('active');
        });

        // Global event delegate to dismiss popover when clicked on log link button or eslewhere
        $(document).on('click', function (e)
        {
            var a = self._elements.logLinkButton,
                id = a.attr('aria-describedby') || null;

            if (id)
            {
                if (a.hasClass('active') && $('#' + id).has(e.target).length === 0)
                    a.popover('hide');
            }
        });
    };

    /**
     * Initialize UI components for expression link popover.
     */
    clc.LinksHandler.prototype._initializeExpressionLinkUi = function ()
    {
        var self = this;

        this._visibleExpressionLinkPopover = null;

        // Initialize popover
        $('body').popover({
            'placement': 'left',
            'container': 'body',
            'html':      true,
            'title':     'Expression Link Generated',
            'trigger':   'click',
            'selector':  '.create-expression-link-button',
            'sanitize':  false,
            'content':   function ()
            {
                return $(self._popoverTemplateId).html().replace('{link}', self._getExpressionsLink($(this).parents('.terminal-command')));
            }
        });

        // Automatically focus and select link when popover is shown
        $('body').on('shown.bs.popover', function(e)
        {
            var target = $(e.target);

            if (target.hasClass('create-expression-link-button'))
            {
                target.parents('.terminal-command').addClass('active');

                var id = target.attr('aria-describedby');
                $('#' + id  + ' input').focus().select();
                self._visibleExpressionLinkPopover = $('#' + id);
            }
        });

        // Remove active css class from expression when popover is hidden
        $('body').on('hidden.bs.popover', function(e)
        {
            var target = $(e.target);

            if (target.hasClass('create-expression-link-button'))
                target.parents('.terminal-command').removeClass('active');
        });

        // Global event delegate to dismiss popovers
        $(document).on('click', function (e)
        {
            if (self._visibleExpressionLinkPopover)
            {
                if (self._visibleExpressionLinkPopover.has(e.target).length === 0)
                {
                    self._visibleExpressionLinkPopover.popover('hide');
                    self._visibleExpressionLinkPopover = null;
                }
            }
        });
    };

    /**
     * Create a link that contains all or one serialized expressions.
     * @param  {Object} element
     * @return {String}
     */
    clc.LinksHandler.prototype._getExpressionsLink = function (element)
    {
        var expressionsList = this._getExpressionCallback(element),
            serializedExpressions = this._serializeExpressionsList(expressionsList);
        return this._buildLink(serializedExpressions);
    };

    /**
     * Serialize given list of expressions to ASCII string.
     * @param  {Array} list
     * @return {String}
     */
    clc.LinksHandler.prototype._serializeExpressionsList = function (list)
    {
        var obj = { 'c': list, 'v': '1' },
            str = JSON.stringify(obj),
            encodedStr = clc.base64Encode(clc.stringToUtf8Array(str));
        return encodedStr;
    };

    /**
     * Deserialize list of expressions.
     * @param  {String} serialized
     * @return {Array}
     */
    clc.LinksHandler.prototype._deserializeExpressionsList = function (serialized)
    {
        var str = clc.stringFromUtf8Array(clc.base64Decode(serialized)),
            obj = JSON.parse(str);
        return obj.c;
    };

    /**
     * Build URL that contains given serialized expressions.
     * @param  {String} serializedExpressions
     * @return {String}
     */
    clc.LinksHandler.prototype._buildLink = function (serializedExpressions)
    {
        var arr = window.location.href.split('/'),
            url = arr[0] + '//' + arr[2] + '#' + serializedExpressions;
        return url;
    };

    /**
     * Get serialized list of expressions from current URL.
     * @return {String}
     */
    clc.LinksHandler.prototype._getExpressonsListFromUrl = function ()
    {
        if (!window.location.hash)
            return null;

        var serializedCommands = window.location.hash.substring(1);

        return serializedCommands.length ? serializedCommands : null;
    };
}(window.clc = window.clc || {}));
