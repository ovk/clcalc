(function (clc)
{
    /**
     * Calculator extension that adds support for encoding strings to unicode/utf8.
     * @constructor
     */
    clc.UnicodeEncodingExtension = function ()
    {
        this._mathJs = null;
    };

    /**
     * Extend MathJS with this extension.
     * @param  {Object} mathJs
     */
    clc.UnicodeEncodingExtension.prototype.extend = function (mathJs)
    {
        var self = this;

        this._mathJs = mathJs;

        // Convert string to code points list
        if (!this._mathJs.toCodePoints)
        {
            var toCodePoints = this._mathJs.typed('toCodePoints', {
                'string': function (arg)
                {
                    return self._functionToCodePoints(arg);
                }
            });
            this._mathJs.import({ 'toCodePoints': toCodePoints });
        }

        // Convert code points list to string
        if (!this._mathJs.fromCodePoints)
        {
            var fromCodePoints = this._mathJs.typed('fromCodePoints', {
                'Array': function (arg)
                {
                    return self._functionFromCodePoints(arg);
                }
            });
            this._mathJs.import({ 'fromCodePoints': fromCodePoints });
        }

        // Convert string to utf8 byte array
        if (!this._mathJs.toUtf8)
        {
            var toUtf8 = this._mathJs.typed('toUtf8', {
                'string': function (arg)
                {
                    return self._functionToUtf8(arg);
                }
            });
            this._mathJs.import({ 'toUtf8': toUtf8 });
        }

        // Convert utf8 byte array to string
        if (!this._mathJs.fromUtf8)
        {
            var fromUtf8 = this._mathJs.typed('fromUtf8', {
                'Array': function (arg)
                {
                    return self._functionFromUtf8(arg);
                }
            });
            this._mathJs.import({ 'fromUtf8': fromUtf8 });
        }
    };

    /**
     * Convert string to unicode code points array.
     * @param  {String} string
     * @return {Array}
     */
    clc.UnicodeEncodingExtension.prototype._functionToCodePoints = function (string)
    {
        if (typeof string === 'undefined' || string === null || string.length === 0)
            return [];
        else
            return clc.stringToUnicodeCodePointList(string);
    };

    /**
     * Convert code points array to string.
     * @param  {Array} array
     * @return {String}
     */
    clc.UnicodeEncodingExtension.prototype._functionFromCodePoints = function (array)
    {
        if (typeof array === 'undefined' || array === null || array.length === 0)
            return '';
        else
            return clc.stringFromUnicodeCodePointList(array);
    };

    /**
     * Convert string to utf8 byte array.
     * @param  {String} string
     * @return {Array}
     */
    clc.UnicodeEncodingExtension.prototype._functionToUtf8 = function (string)
    {
        if (typeof string === 'undefined' || string === null || string.length === 0)
            return [];
        else
            return clc.stringToUtf8Array(string);
    };

    /**
     * Convert utf8 byte array to string.
     * @param  {Array} array
     * @return {String}
     */
    clc.UnicodeEncodingExtension.prototype._functionFromUtf8 = function (array)
    {
        if (typeof array === 'undefined' || array === null || array.length === 0)
            return '';
        else
            return clc.stringFromUtf8Array(array);
    };
}(window.clc = window.clc || {}));
