(function (clc)
{
    /* FIXME: Reconsider this extension once lerp PR is accepted in MathJS
     * https://github.com/josdejong/mathjs/pull/663
     */

    /**
     * Calculator extension that adds linear interpolation (lerp) function.
     * @constructor
     */
    clc.LerpExtension = function ()
    {
        this._mathJs = null;
    };

    /**
     * Extend MathJS with this extension.
     * @param  {Object} mathJs
     */
    clc.LerpExtension.prototype.extend = function (mathJs)
    {
        var self = this;

        this._mathJs = mathJs;

        if (!this._mathJs.lerp)
        {
            var lerp = this._mathJs.typed('lerp', {
                'BigNumber, BigNumber, BigNumber': function (x, y, t)
                {
                    return self._functionLerpNumber(x, y, t);
                },
                'Color, Color, BigNumber': function (x, y, t)
                {
                    return self._functionLerpColor(x, y, t);
                }
            });
            this._mathJs.import({ 'lerp': lerp });
        }
    };

    /**
     * Interpolate between two numbers (x and y) with the coefficient of t:
     * x * (1 - t) + y * t
     * @param  {BigNumber} x
     * @param  {BigNumber} y
     * @param  {BigNumber} t
     * @return {BigNumber}
     */
    clc.LerpExtension.prototype._functionLerpNumber = function (x, y, t)
    {
        if (t.lessThan(0) || t.greaterThan(1))
            throw new Error('Interpolation coefficient must be in range [0, 1]');

        var t0 = new this._mathJs.bignumber(1).minus(t).times(x),
            t1 = t.times(y);

        return t0.plus(t1);
    };

    /**
     * Interpolate between two colors (x and y) with the coefficient of t (aka mix colors).
     * @param  {Color} x
     * @param  {Color} y
     * @param  {BigNumber} t
     * @return {Color}
     */
    clc.LerpExtension.prototype._functionLerpColor = function (x, y, t)
    {
        if (t.lessThan(0) || t.greaterThan(1))
            throw new Error('Interpolation coefficient must be in range [0, 1]');

        var r = clc.mathJsToValidNumber(t),
            t0 = x.op([ 1 - r, 1 - r, 1 - r, 1 - r ],  function (a, b) { return a * b; }),
            t1 = y.op([ r, r, r, r ],  function (a, b) { return a * b; });

        return t0.op(t1.toArgbf(), function (a, b) { return a + b; });
    };
}(window.clc = window.clc || {}));
