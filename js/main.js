$(document).ready(function()
{
    // Don't appent query parameter to avoid caching
    $.ajaxSetup({ cache: true });

    // Initialize Bootstrap tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Welcome message that appears on top
    var welcomeMessage =
        '<div class="welcome-message">Type math expression and press enter to calculate the result. ' +
        'You can use up/down keys to navigate commands history and tab key for autocompletion. ' +
        'Check <a href="/help.html#quickstart" target="_blank">Quick Start</a> guide or type <strong>help</strong> for help.</div>';

    // Help string that is printed as output of 'help' command
    var helpMessage =
        'Simply type an expression (for example: \'sin(pi)^2 + cos(pi)^2\') in the calculator and press enter to see the result.\n\n' +

        'You can use up/down arrow keys for navigating the command history and tab key for autocompletion ' +
        '(double tap tab to see all completion suggestions).\n' +
        'Other typical terminal key combinations such as Ctrl+k/Ctrl+u or Ctrl+r are also available (see full list on the help page).\n\n' +

        'On the left panel (or top panel for small screen devices) there are buttons to open help page, ' +
        'configure calculator\'s precision and display options, open TeX panel and get shareable link to your calculations.\n' +
        'Additionally, you can get shareable link to any specific expression by clicking on the "link" icon on the right side of any expression.\n\n' +

        'To get help for any built-in function or constant, use the \'help()\' function with an argument, for example, ' +
        'try \'help(pi)\', \'help(sin)\' or \'help(derivative)\'.\n' +
        'To see the list of available functions or constant double tap the tab key.\n\n' +

        'To see detailed help for all calculator features go to the help page.';

    var clcalc, settingsHandler;

    function setColorTheme(theme)
    {
        $('body').toggleClass('dark', theme === 'dark');
    }

    // Create settings handler so it can load settings before Calculator is initialized
    function onSettingsChanged()
    {
        clcalc.setSettings(settingsHandler.getSettings());
        setColorTheme(settingsHandler.getSettings().colorTheme);
    }

    settingsHandler = new clc.SettingsHandler(onSettingsChanged);

    // Set color theme on loading
    setColorTheme(settingsHandler.getSettings().colorTheme);

    // Create Calculator instance and register all extensions
    clcalc = new clc.Calculator(math, settingsHandler.getSettings(), helpMessage);

    clcalc.installExtension(new clc.UnicodeEncodingExtension());
    clcalc.installExtension(new clc.Base64EncodingExtension());
    clcalc.installExtension(new clc.HashesExtension());
    clcalc.installExtension(new clc.ColorExtension(true));
    clcalc.installExtension(new clc.LerpExtension());
    clcalc.installExtension(new clc.PlotExtension());

    // Character that is used as prompt
    var prompt = '>';

    /**
     * Get expression contained inside given DOM element.
     * @param  {Object} element
     * @return {String}
     */
    function getSingleExpression(element)
    {
        var command = '';

        element.find('>div>span').each(function (i, e)
        {
            command += (i === 0) ? $(e).text().substr(prompt.length) : $(e).text();
        });

        return command;
    }

    /**
     * Get one or all expressions from current calculator console.
     * If element is provided, only its expression will be returned.
     * @param  {Object} element
     * @return {Array}
     */
    function getExpression(element)
    {
        if (typeof element !== 'undefined')
            return [ getSingleExpression(element) ];
        else
        {
            var commands = [];

            $('.terminal-output .terminal-command').each(function (_, e)
            {
                var command = getSingleExpression($(e));
                if (!clc.isStringBlank(command))
                    commands.push(command);
            });

            return commands;
        }
    }

    // Initialize additional services
    var linksHandler = new clc.LinksHandler(getExpression),
        texHandler = new clc.TexHandler(),
        syntaxHighlighter = new clc.SyntaxHighlighter();

    // Button is disabled until at least one command evaluated
    linksHandler.setLogLinkButtonEnabled(false);

    // Setup default formatter for syntax highlighting
    $.terminal.defaults.formatters.push(function (string)
    {
        return syntaxHighlighter.highlight(string);
    });

    /**
     * Callback to intercept each echo command to inject expression link button.
     * @param  {Object} element
     */
    function onEchoCommand(element)
    {
        var e = element.find('div'),
            command = e.length ? e.text().substring(prompt.length) : '';

        if (!clc.isStringBlank(command))
            linksHandler.injectExpressionLinkButton(element.find('>div').last());
    }

    /**
     * Main terminal command handler.
     * @param  {String} string
     */
    function onCommand(string)
    {
        // Don't process commands that consist entirely of spaces
        if (clc.isStringBlank(string))
            return;

        // Enable log link button, since at least one non-empty command have been entered
        linksHandler.setLogLinkButtonEnabled(true);

        try
        {
            // Evaluate expression
            var expression = clcalc.evaluate(string);

            // Submit expression to TeX handler for rendering
            texHandler.addEvaluatedExpression(expression.tex, expression.result.tex || null);

            // Add expression value to terminal
            if (expression.result.postprocessed)
                this.echo(expression.result.postprocessed, { 'raw': true });
            else if (expression.result.raw instanceof clc.CallbackResult)
                this.echo(expression.result.raw.callback, { 'raw': true });
        }
        catch (error)
        {
            if (error.message && error.message.indexOf('No documentation found on') === 0)
                error.message += '. If you believe the documentation is missing please open an issue at github.com/ovk/clcalc/issues.';

            this.echo('[[;;;terminal-output-error;]' + error.name + ': ' + error.message + ']');
        }
    }

    /**
     * Completion suggestions handler.
     */
    function onCompletion()
    {
        var expr = this.before_cursor();

        if (!expr.length)
            return clc.COMPLETION_KEYWORDS;
        else
        {
            var i = expr.length;
            var identifierChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_';

            for (; i > 0 && identifierChars.indexOf(expr[i - 1]) !== -1; --i)
            {
                // Intentionally empty
            }

            var prefix = expr.substr(i);

            var candidates = prefix.length ? clc.COMPLETION_KEYWORDS.filter(function (keyword)
            {
                return keyword.indexOf(prefix) === 0;
            }) : clc.COMPLETION_KEYWORDS;

            return candidates.map(function (candidate)
            {
                var fullCandidate = new String(expr + candidate.substr(prefix.length));
                fullCandidate.token = candidate;
                return fullCandidate;
            });
        }
    }

    /**
     * Double tap completion suggestions handler.
     * @param {String} string
     * @param {Array} matches
     * @param {Function} echoCommand
     */
    function onCompletionDoubleTap(string, matches, echoCommand)
    {
        echoCommand();

        this.echo(matches.map(function (candidate)
        {
            return candidate.token || candidate;
        }));
    }

    /**
     * Initialize jquery.terminal
     */
    var terminal = $('.console-panel').terminal(onCommand, {
        'onEchoCommand': onEchoCommand,
        'name':          'clcalc',
        'prompt':        '[[;;;prompt-wrapper]' + prompt + ']',
        'exit':          false,
        'memory':        true,
        'enabled':       true,
        'greetings':     function ()
        {
            this.echo(welcomeMessage, { 'raw': true });
        },
        'onClear':       function ()
        {
            linksHandler.setLogLinkButtonEnabled(false);
            texHandler.clear();
        },
        'completionEscape': false,
        'wordAutocomplete': false,
        'doubleTab': onCompletionDoubleTap,
        'completion': onCompletion
    });

    /**
     * Intercept mousewheel events from terminal, since some events may be consumed by function graphs.
     */
    terminal.option('mousewheel', function (e)
    {
        if (clc.FunctionPlot2D.isEventConsumed(e))
            e.preventDefault();
        return true;
    });

    /**
     * Reload window when hash value is changed (to force restore content from hash).
     */
    window.onhashchange = function ()
    {
        window.location.reload();
    };

    // If there are any expressions encoded in the current URL: replay them in the terminal.
    var expressions = linksHandler.getExpressionsListFromUrl();
    if (expressions)
    {
        var re = new RegExp(String.fromCharCode(160), 'g');
        for (var i in expressions)
            terminal.exec(expressions[i].replace(re, ' '));
    }
});

// Register service worker for PWA support
if ('serviceWorker' in navigator)
{
    navigator.serviceWorker.register('./sw.js').catch(function (error)
    {
        console.log('Failed to register service worker', error);
    });
}
