(function (clc)
{
    /**
     * Convert from floating point number in range [0, 1] to unsigned byte.
     * @param  {Number|BigNumber} number
     * @return {Number}
     */
    function ftob(number)
    {
        var n = clc.mathJsToValidNumber(number);
        if (n < 0 || n > 1)
            throw new Error('Must be floating point number in range [0, 1]');
        return Math.round(n * 255.0);
    }

    /**
     * Construct color from ARGB Uint32.
     * @param  {Number} argb
     * @constructor
     */
    clc.Color = function (argb)
    {
        this._argb = argb >>> 0;
    };

    /**
     * Construct color from ARGB bytes.
     * @param  {Number} a
     * @param  {Number} r
     * @param  {Number} g
     * @param  {Number} b
     * @return {Color}
     */
    clc.Color.from4b = function (a, r, g, b)
    {
        return new clc.Color((clc.toUint8(a) << 24) | (clc.toUint8(r) << 16) | (clc.toUint8(g) << 8) | clc.toUint8(b));
    };

    /**
     * Construct number from 4 floating point numbers in the range [0, 1].
     * @param  {Number} a
     * @param  {Number} r
     * @param  {Number} g
     * @param  {Number} b
     * @return {Color}
     */
    clc.Color.from4f = function (a, r, g, b)
    {
        return new clc.Color.from4b(ftob(a), ftob(r), ftob(g), ftob(b));
    };

    /**
     * Construct color from Uint32.
     * @param  {Number} argb
     * @return {Color}
     */
    clc.Color.fromU32 = function (argb)
    {
        return new clc.Color(clc.toUint32(argb));
    };

    /**
     * Construc color from HSV values.
     * @param  {Number} h [0 - 360)
     * @param  {Number} s [0 - 100]
     * @param  {Number} v [0- 100]
     * @return {Color}
     */
    clc.Color.fromHsv = function (h, s, v)
    {
        // Check input
        h = clc.toUint32(h);
        s = clc.toUint32(s);
        v = clc.toUint32(v);

        if (h >= 360)
            throw new Error('Hue must be in range [0, 360)');
        if (s > 100)
            throw new Error('Saturation must be in range [0, 100]');
        if (v > 100)
            throw new Error('Value must be in range [0, 100]');

        // S, V -> [0, 1]
        s /= 100.0;
        v /= 100.0;

        // Convert to RGB
        var C = v * s,
            X = C * (1 - Math.abs(((h / 60) % 2) - 1)),
            m = v - C, rgb;

        if (h < 60)
            rgb = [ C, X, 0 ];
        else if (h < 120)
            rgb = [ X, C, 0 ];
        else if (h < 180)
            rgb = [ 0, C, X ];
        else if (h < 240)
            rgb = [ 0, X, C ];
        else if (h < 300)
            rgb = [ X, 0, C ];
        else
            rgb = [ C, 0, X ];

        return clc.Color.from4b(0xFF, Math.round((rgb[0] + m) * 255), Math.round((rgb[1] + m) * 255), Math.round((rgb[2] + m) * 255));
    };

    /**
     * Construc color from HSL values.
     * @param  {Number} h [0 - 360)
     * @param  {Number} s [0 - 100]
     * @param  {Number} l [0- 100]
     * @return {Color}
     */
    clc.Color.fromHsl = function (h, s, l)
    {
        // Check input
        h = clc.toUint32(h);
        s = clc.toUint32(s);
        l = clc.toUint32(l);

        if (h >= 360)
            throw new Error('Hue must be in range [0, 360)');
        if (s > 100)
            throw new Error('Saturation must be in range [0, 100]');
        if (l > 100)
            throw new Error('Lightness must be in range [0, 100]');

        // S, L -> [0, 1]
        s /= 100.0;
        l /= 100.0;

        // Convert to RGB
        var C = (1 - Math.abs(2 * l - 1)) * s,
            X = C * (1 - Math.abs(((h / 60) % 2) - 1)),
            m = l - 0.5 * C, rgb;

        if (h < 60)
            rgb = [ C, X, 0 ];
        else if (h < 120)
            rgb = [ X, C, 0 ];
        else if (h < 180)
            rgb = [ 0, C, X ];
        else if (h < 240)
            rgb = [ 0, X, C ];
        else if (h < 300)
            rgb = [ X, 0, C ];
        else
            rgb = [ C, 0, X ];

        return clc.Color.from4b(0xFF, Math.round((rgb[0] + m) * 255), Math.round((rgb[1] + m) * 255), Math.round((rgb[2] + m) * 255));
    };

    /**
     * Get i-th component of ARGB color. A - 0, B - 3.
     * @param  {Number} i
     * @return {Number}
     */
    clc.Color.prototype.get = function (i)
    {
        return (this._argb >>> (24 - i * 8)) & 0xFF;
    };

    /**
     * Convert Color to String.
     * @return {String}
     */
    clc.Color.prototype.toString = function ()
    {
        return '#' + (clc.padLeft(this.get(0).toString(16), '0', 2) +
                      clc.padLeft(this.get(1).toString(16), '0', 2) +
                      clc.padLeft(this.get(2).toString(16), '0', 2) +
                      clc.padLeft(this.get(3).toString(16), '0', 2)).toUpperCase();
    };

    /**
     * Perform an operation (specified by callback) between this color and 4 component vector v.
     * @param  {Array}    v
     * @param  {Function} callback
     * @return {Color}
     */
    clc.Color.prototype.op = function (v, callback)
    {
        var color = this.toArgbf(), i;

        for (i = 0; i < 4; ++i)
            color[i] = clc.clamp(callback(color[i], clc.mathJsToValidNumber(v[i])), 0, 1);

        return clc.Color.from4f(color[0], color[1], color[2], color[3]);
    };

    /**
     * Get HSV representation of this color.
     * Note: alpha is ignored during conversion.
     * @return {Array}
     */
    clc.Color.prototype.toHsv = function ()
    {
        var r = this.get(1) / 255.0,
            g = this.get(2) / 255.0,
            b = this.get(3) / 255.0,
            Cmax = Math.max(r, g, b),
            Cmin = Math.min(r, g, b),
            delta = Cmax - Cmin,
            h, s, v;

        // Hue
        if (delta == 0)
            h = 0;
        else if (Cmax === r)
            h = 60 * clc.mod(((g - b) / delta), 6);
        else if (Cmax === g)
            h = 60 * (((b - r) / delta) + 2);
        else if (Cmax === b)
            h = 60 * (((r - g) / delta) + 4);

        // Saturation
        s = (Cmax == 0) ? 0 : (delta / Cmax);

        // Value
        v = Cmax;

        return [ Math.round(h), Math.round(s * 100), Math.round(v * 100) ];
    };

    /**
     * Get HSL representation of this color.
     * Note: alpha is ignored during conversion.
     * @return {Array}
     */
    clc.Color.prototype.toHsl = function ()
    {
        var r = this.get(1) / 255.0,
            g = this.get(2) / 255.0,
            b = this.get(3) / 255.0,
            Cmax = Math.max(r, g, b),
            Cmin = Math.min(r, g, b),
            delta = Cmax - Cmin,
            h, s, l;

        // Hue
        if (delta == 0)
            h = 0;
        else if (Cmax === r)
            h = 60 * clc.mod(((g - b) / delta), 6);
        else if (Cmax === g)
            h = 60 * (((b - r) / delta) + 2);
        else if (Cmax === b)
            h = 60 * (((r - g) / delta) + 4);

        // Lightness
        l = (Cmax + Cmin) / 2.0;

        // Saturation
        s = (delta == 0) ? 0 : (delta / (1 - Math.abs(2 * l - 1)));

        return [ Math.round(h), Math.round(s * 100), Math.round(l * 100) ];
    };

    /**
     * Get ARGB bytes representing this color.
     * @return {Array} [description]
     */
    clc.Color.prototype.toArgb = function ()
    {
        return [ this.get(0), this.get(1), this.get(2), this.get(3) ];
    };

    /**
     * Get 4 numbers representing ARGB where each number is in range [0, 1].
     * @return {Array} [description]
     */
    clc.Color.prototype.toArgbf = function ()
    {
        return [ this.get(0) / 255.0, this.get(1) / 255.0, this.get(2) / 255.0, this.get(3) / 255.0 ];
    };
}(window.clc = window.clc || {}));
