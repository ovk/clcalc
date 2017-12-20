/**
 * log10 polyfill for IE
 */
if (!Math.log10)
{
    Math.log10 = function (n)
    {
        return Math.log(n) / Math.LN10;
    };
}

/**
 * sign polyfill for IE
 */
if (!Math.sign)
{
    Math.sign = function (n)
    {
        return ((n > 0) - (n < 0)) || +n;
    };
}
