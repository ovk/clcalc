describe ('Help', function ()
{
    beforeEach(function() { jasmine.addCustomEqualityTester(texIgnoringResultEqualityTester); });

    it ('Should print general help on \'help\' command', function ()
    {
        var calc = createCalculatorInstance();

        var help = calc.evaluate('help').result;
        expect(help.raw).toEqual(testHelpMessage);
        expect(help.postprocessed).toEqual('<pre>' + testHelpMessage + '</pre>');
        expect(help.tex).toBeUndefined();
    });

    it ('Should print help for all built-in MathJS constants', function ()
    {
        var calc = createCalculatorInstance();

        for (var i = 0; i < clc.MATH_JS_CONSTANTS.length; ++i)
        {
            var constant = clc.MATH_JS_CONSTANTS[i];

            // version constant has no help
            if (constant === 'version')
                continue;

            checkHelp(calc, constant);
        }
    });

    it ('Should print help for all built-in MathJS functions', function ()
    {
        var calc = createCalculatorInstance();
        // FIXME: remove 'not' from this list once https://github.com/josdejong/mathjs/issues/1905 is fixed
        var noHelp = [ 'chain', 'compile', 'parse', 'parser', 'print', 'not' ];

        for (var i = 0; i < clc.MATH_JS_FUNCTIONS.length; ++i)
        {
            var fn = clc.MATH_JS_FUNCTIONS[i];

            // Skip some internal MathJS functions that have no help
            if (noHelp.indexOf(fn) !== -1)
                continue;

            checkHelp(calc, fn);
        }
    });

    function checkHelp(calc, identifier)
    {
        var help = calc.evaluate('help(' + identifier + ')').result;

        expect(typeof help.raw).toEqual('string');
        expect(help.raw.length).toBeGreaterThan(1);
        // FIXME: this is disabled due to bug in Firefox. Uncomment once it is fixed.
        // expect(help.postprocessed).toMatch(/<pre>.*<\/pre>/s);
        expect(help.tex).toBeUndefined();
    };
});
