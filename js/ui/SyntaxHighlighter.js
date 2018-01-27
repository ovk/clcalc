(function (clc)
{
    /**
     * Class that parses expression and adds syntax highlighting markup.
     * @constructor
     */
    clc.SyntaxHighlighter = function ()
    {
        this._constants = [].concat(clc.MATH_JS_CONSTANTS, [ 'true', 'false' ]);
        this._keywords = [].concat(clc.MATH_JS_FUNCTIONS, clc.CLCALC_FUNCTIONS, clc.ALIASES, '$');

        this._re = {
            'identifier': new RegExp('([0-9]*)([A-Za-z_$][A-Za-z0-9_$]*)', 'g'),
            'color':      new RegExp('#[A-Fa-f0-9]{6,8}', 'g')
        };

        this._classes = {
            'constant': 'highlight-constant',
            'keyword':  'highlight-keyword',
            'color':    'highlight-color'
        };
    };

    /**
     * Highlight given expression string.
     * @param  {String} string
     * @return {String}
     */
    clc.SyntaxHighlighter.prototype.highlight = function (string)
    {
        var self = this;

        return string.replace(this._re.identifier, function (fullMatch, numericPrefix, identifier)
        {
            if (self._isValidIdentifier(numericPrefix, identifier))
            {
                if (self._constants.indexOf(identifier) !== -1)
                    return numericPrefix + '[[;;;highlight-constant;]' + identifier + ']';
                else if (self._keywords.indexOf(identifier) !== -1)
                    return numericPrefix + '[[;;;highlight-keyword;]' + identifier + ']';
            }

            return fullMatch;
        }).replace(this._re.color, function (color)
        {
            return (color.length === 7 || color.length === 9) ? '[[;;;highlight-color;]' + color + ']' : color;
        });
    };

    /**
     * Check if matched identifier is valid identifier, and not part of another construct.
     * @param  {String} numericPrefix
     * @param  {String} identifier
     * @return {Boolean}
     */
    clc.SyntaxHighlighter.prototype._isValidIdentifier = function (numericPrefix, identifier)
    {
        return (!identifier || identifier.length === 0) ? false :
            ((numericPrefix && numericPrefix.length === 1 && numericPrefix[0] === '0' && (
                identifier[0] === 'x' ||
                identifier[0] === 'X' ||
                identifier[0] === 'b' ||
                identifier[0] === 'B')) ? false : true);
    };
}(window.clc = window.clc || {}));
