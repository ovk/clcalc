describe('Plot 2D Function', function ()
{
    var svgTemplate =
    '<svg id="plot2d-[0-9a-zA-Z]+" class="function-plot2d" width="\\d+" height="\\d+">' +
        '<text class="function-plot2d-legend" text-anchor="end" x="\\d+" y="\\d+"></text>' +
        '<g class="function-plot2d-canvas" transform="translate\\(\\d+, \\d+\\)">' +
            '<defs>' +
                '<clipPath id="clip-path-plot2d-[0-9a-zA-Z]+">' +
                    '<rect width="\\d+" height="\\d+"></rect>' +
                '</clipPath>' +
            '</defs>' +
            '<g class="function-plot2d-axis-x" transform="translate\\(\\d+, \\d+\\)">' +
                '(<g transform="translate\\([0-9\\.-]+, 0\\)"><text.+>[0-9\\.-]+</text><line.+></line></g>)+' +
                '<path shape-rendering="crispedges" d="M0,0H\\d+"></path>' +
            '</g>' +
            '<g class="function-plot2d-axis-y" transform="translate\\(\\d+, \\d+\\)">' +
                '(<g transform="translate\\(0, [0-9\\.-]+\\)"><text.+>[0-9\\.-]+</text><line.+></line></g>)+' +
                '<path shape-rendering="crispedges" d="M0,0V\\d+"></path>' +
            '</g>' +
            '<g transform="translate\\(\\d+, 0\\)" clip-path="url\\(#clip-path-plot2d-[0-9a-zA-Z]+\\)">' +
                '<path class="function-plot2d-origin-x" stroke-width="1" shape-rendering="crispedges" d="M0,[0-9\\.-]+H[0-9\\.-]+"></path>' +
                '<path class="function-plot2d-origin-y" stroke-width="1" shape-rendering="crispedges" d="M[0-9\\.-]+,0V[0-9\\.-]+"></path>' +
                '<path class="function-plot2d-graph".+></path>' +
            '</g>' +
            '<rect class="function-plot2d-event-grab" width="\\d+" height="\\d+" fill="none" x="\\d+"></rect>' +
        '</g>' +
    '</svg>';

    it ('Should validate arguments', function ()
    {
        var calc = createCalculatorInstance();

        expect(function () { calc.evaluate('plot2d()'); }).toThrowError();
        expect(function () { calc.evaluate('plot2d(x, x, [0, 1], 1)'); }).toThrowError();
        expect(function () { calc.evaluate('plot2d("x", x, [0, 1])'); }).toThrowError();
        expect(function () { calc.evaluate('plot2d(x, 1, [0, 1])'); }).toThrowError();
        expect(function () { calc.evaluate('plot2d(x, x, 3)'); }).toThrowError();
        expect(function () { calc.evaluate('plot2d(x, x, [0, 1, 2])'); }).toThrowError();
        expect(function () { calc.evaluate('plot2d(x, x, [true, 1])'); }).toThrowError();
        expect(function () { calc.evaluate('plot2d(x, x, [0, "1"])'); }).toThrowError();
        expect(function () { calc.evaluate('plot2d(x, x, [1, 1])'); }).toThrowError();
        expect(function () { calc.evaluate('plot2d(x, x, [2, 1])'); }).toThrowError();
        calc.evaluate('dmin = 42');
        expect(function () { calc.evaluate('plot2d(x, x, [dmin, 0])'); }).toThrowError();
        expect(function () { calc.evaluate('plot2d(x, x, [0, NaN])'); }).toThrowError();
    });

    it ('Should return CallbackResult on success', function ()
    {
        var calc = createCalculatorInstance();

        expect(calc.evaluate('plot2d(sin(2*t + 3) / cos(t), t, [-pi, e^2])').result.raw instanceof clc.CallbackResult).toBeTruthy();
        expect(calc.evaluate('plot2d(x, x, [-1, 2])').result.raw instanceof clc.CallbackResult).toBeTruthy();
        expect(calc.evaluate('plot2d(3x, x, [-5, -3])').result.raw instanceof clc.CallbackResult).toBeTruthy();

        calc.evaluate('dmin = 42');
        calc.evaluate('dmax = 43');
        expect(calc.evaluate('plot2d(x^2, x, [dmin, dmax])').result.raw instanceof clc.CallbackResult).toBeTruthy();
    });

    it ('Should return correct SVG', function ()
    {
        var calc = createCalculatorInstance();

        expect(calc.evaluate('plot2d(x, x, [-0.5, 3.14])').result.raw.callback()).toMatch(svgTemplate);
    });
});
