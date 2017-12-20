(function (clc)
{
    /**
     * Calculator extension that adds support for base64 encoding.
     * @constructor
     */
    clc.Base64EncodingExtension = function ()
    {
        this._mathJs = null;
    };

    /**
     * Extend MathJS with this extension.
     * @param  {Object} mathJs
     */
    clc.Base64EncodingExtension.prototype.extend = function (mathJs)
    {
        var self = this;

        this._mathJs = mathJs;

        // Convert byte array to base64 encoded string
        if (!this._mathJs.base64Encode)
        {
            var base64Encode = this._mathJs.typed('base64Encode', {
                'Array': function (arg)
                {
                    return self._functionBase64Encode(arg);
                }
            });
            this._mathJs.import({ 'base64Encode': base64Encode });
        }

        // Convert base64 encoded string to byte array
        if (!this._mathJs.base64Decode)
        {
            var base64Decode = this._mathJs.typed('base64Decode', {
                'string': function (arg)
                {
                    return self._functionBase64Decode(arg);
                }
            });
            this._mathJs.import({ 'base64Decode': base64Decode });
        }
    };

    /**
     * Encode bytes array to base64 encoded string
     * @param  {Array} array
     * @return {String}
     */
    clc.Base64EncodingExtension.prototype._functionBase64Encode = function (array)
    {
        if (typeof array === 'undefined' || array === null)
            return '';
        else
            return clc.base64Encode(array);
    };

    /**
     * Decode base64 encoded string into bytes array
     * @param  {String} string
     * @return {Array}
     */
    clc.Base64EncodingExtension.prototype._functionBase64Decode = function (string)
    {
        if (typeof string === 'undefined' || string === null)
            return [];
        else
            return clc.base64Decode(string);
    };
}(window.clc = window.clc || {}));
