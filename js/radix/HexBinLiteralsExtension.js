(function (clc)
{
    /*
     * FIXME:
     * This extension should become unnecessary MathJS issue #909 is addressed.
     * https://github.com/josdejong/mathjs/issues/909
     */

    /**
     * Calculator extension that adds support for hexadecimal and binary number literals,
     * as well as hex() and bin() function.
     * @constructor
     */
    clc.HexBinLiteralsExtension = function ()
    {
        this._mathJs = null;
        this._literalRegexp = new RegExp('(?:^|[^A-Za-z0-9_\\\\$\\.])((0[bB][10\\.]+)|(0[xX][A-Fa-f0-9\\.]+))\\b', 'g');
    };

    /**
     * Extend MathJS with this extension.
     * @param  {Object} mathJs
     */
    clc.HexBinLiteralsExtension.prototype.extend = function (mathJs)
    {
        var self = this;

        this._mathJs = mathJs;

        // Convert to hexadecimal
        if (!this._mathJs.hex)
        {
            var hex = this._mathJs.typed('hex', {
                'Array | Matrix': function (arg)
                {
                    return self._mathJs.map(arg, function (x) { return self._functionHex(x); });
                },
                'BigNumber': function (arg)
                {
                    return self._functionHex(arg);
                }
            });
            this._mathJs.import({ 'hex': hex });
        }

        // Convert to binary
        if (!this._mathJs.bin)
        {
            var bin = this._mathJs.typed('bin', {
                'Array | Matrix': function (arg)
                {
                    return self._mathJs.map(arg, function (x) { return self._functionBin(x); });
                },
                'BigNumber': function (arg)
                {
                    return self._functionBin(arg);
                }
            });
            this._mathJs.import({ 'bin': bin });
        }
    };

    /**
     * Preprocess expression to convert hex/bin literals to decimal literals.
     * @param  {String} expression
     * @return {String}
     */
    clc.HexBinLiteralsExtension.prototype.preprocess = function (expression)
    {
        var self = this;

        return expression.replace(this._literalRegexp, function (fullMatch, match)
        {
            if (match && match.length > 2)
            {
                var number = self._mathJs.bignumber(match);
                return (fullMatch.length === match.length) ? number.toString() : (fullMatch[0] + number.toString());
            }
        });
    };

    /**
     * Convert a number to hex.
     * @param  {BigNumber|Number} number
     * @return {String}
     */
    clc.HexBinLiteralsExtension.prototype._functionHex = function (number)
    {
        return (typeof number === 'number') ? ('0x' + number.toString(16)) : number.toHex();
    };

    /**
     * Convert a number to bin.
     * @param  {BigNumber|Number} number
     * @return {String}
     */
    clc.HexBinLiteralsExtension.prototype._functionBin = function (number)
    {
        return (typeof number === 'number') ? ('0b' + number.toString(2)) : number.toBinary();
    };
}(window.clc = window.clc || {}));
