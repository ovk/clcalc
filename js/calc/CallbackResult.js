(function (clc)
{
    /**
     * A wrapper type to return a callback function as a result of calculation
     * (used only for plots so far).
     * @constructor
     * @param {Function} callback Callback function to be called to get the result.
     */
    clc.CallbackResult = function (callback)
    {
        this.callback = callback;
    };
}(window.clc = window.clc || {}));
