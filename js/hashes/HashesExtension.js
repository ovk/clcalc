(function (clc)
{
    /**
     * Calculator extension that adds support for common hash functions.
     * @constructor
     */
    clc.HashesExtension = function ()
    {
        this._mathJs = null;
    };

    /**
     * Extend MathJS with this extension.
     * @param  {Object} mathJs
     */
    clc.HashesExtension.prototype.extend = function (mathJs)
    {
        var self = this;

        this._mathJs = mathJs;

        // Compute md5 hash
        if (!this._mathJs.md5)
        {
            var md5 = this._mathJs.typed('md5', {
                'Array': function (arg)
                {
                    return self._functionMd5(arg);
                }
            });
            this._mathJs.import({ 'md5': md5 });
        }

        // Compute sha1 hash
        if (!this._mathJs.sha1)
        {
            var sha1 = this._mathJs.typed('sha1', {
                'Array': function (arg)
                {
                    return self._functionSha1(arg);
                }
            });
            this._mathJs.import({ 'sha1': sha1 });
        }

        // Compute sha224 hash
        if (!this._mathJs.sha224)
        {
            var sha224 = this._mathJs.typed('sha224', {
                'Array': function (arg)
                {
                    return self._functionSha224(arg);
                }
            });
            this._mathJs.import({ 'sha224': sha224 });
        }

        // Compute sha256 hash
        if (!this._mathJs.sha256)
        {
            var sha256 = this._mathJs.typed('sha256', {
                'Array': function (arg)
                {
                    return self._functionSha256(arg);
                }
            });
            this._mathJs.import({ 'sha256': sha256 });
        }
    };

    /**
     * Compute MD5 hash of a byte array.
     * @param  {Array} array
     * @return {String}
     */
    clc.HashesExtension.prototype._functionMd5 = function (array)
    {
        if (typeof array === 'undefined' || array === null)
            throw new Error('Invalid argument');
        else
            return clc.md5(array);
    };

    /**
     * Compute SHA1 hash of a byte array.
     * @param  {Array} array
     * @return {String}
     */
    clc.HashesExtension.prototype._functionSha1 = function (array)
    {
        if (typeof array === 'undefined' || array === null)
            throw new Error('Invalid argument');
        else
            return clc.sha1(array);
    };

    /**
     * Compute SHA224 hash of a byte array.
     * @param  {Array} array
     * @return {String}
     */
    clc.HashesExtension.prototype._functionSha224 = function (array)
    {
        if (typeof array === 'undefined' || array === null)
            throw new Error('Invalid argument');
        else
            return clc.sha224(array);
    };

    /**
     * Compute SHA256 hash of a byte array.
     * @param  {Array} array
     * @return {String}
     */
    clc.HashesExtension.prototype._functionSha256 = function (array)
    {
        if (typeof array === 'undefined' || array === null)
            throw new Error('Invalid argument');
        else
            return clc.sha256(array);
    };
}(window.clc = window.clc || {}));
