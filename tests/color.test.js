describe ('Color', function ()
{
    describe ('Contructor', function ()
    {
        it ('Should construct colors explicitly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('color4f(0, 0, 0, 0)').result.raw).toEqual('#00000000');
            expect(calc.evaluate('color4f(1, 1, 1, 1)').result.raw).toEqual('#FFFFFFFF');
            expect(calc.evaluate('color4f(0.5, 0.3125, 0.2, 0.1)').result.raw).toEqual('#8050331A');
            expect(calc.evaluate('Color4b(171, 205, 239, 18)').result.raw).toEqual('#ABCDEF12');
            expect(calc.evaluate('color4b(0, 0, 0, 0)').result.raw).toEqual('#00000000');
            expect(calc.evaluate('color4b(171, 205, 239, 18)').result.raw).toEqual('#ABCDEF12');
            expect(calc.evaluate('color3b(0, 0, 0)').result.raw).toEqual('#FF000000');
            expect(calc.evaluate('color3b(254, 250, 251)').result.raw).toEqual('#FFFEFAFB');
            expect(calc.evaluate('colorU32(0)').result.raw).toEqual('#00000000');
            expect(calc.evaluate('colorU32(305419896)').result.raw).toEqual('#12345678');

            expect(function () { calc.evaluate('color4b(-1, 0, 0, 0)'); }).toThrowError(Error);
            expect(function () { calc.evaluate('color3b(256, 0, 0)'); }).toThrowError(Error);
            expect(function () { calc.evaluate('colorU32(-1)'); }).toThrowError(Error);
            expect(function () { calc.evaluate('colorU32(4294967296)'); }).toThrowError(Error);
            expect(function () { calc.evaluate('color4f(-1, 0, 0, 0)'); }).toThrowError(Error);
            expect(function () { calc.evaluate('color4f(1.001, 0, 0, 0)'); }).toThrowError(Error);
        });

        it ('Should construct colors from HSV values', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('colorHsv(0, 0, 0)').result.raw).toEqual('#FF000000');
            expect(calc.evaluate('colorHsv(0, 0, 100)').result.raw).toEqual('#FFFFFFFF');
            expect(calc.evaluate('colorHsv(0, 100, 100)').result.raw).toEqual('#FFFF0000');
            expect(calc.evaluate('colorHsv(60, 100, 100)').result.raw).toEqual('#FFFFFF00');
            expect(calc.evaluate('colorHsv(120, 100, 100)').result.raw).toEqual('#FF00FF00');
            expect(calc.evaluate('colorHsv(180, 100, 100)').result.raw).toEqual('#FF00FFFF');
            expect(calc.evaluate('colorHsv(240, 100, 100)').result.raw).toEqual('#FF0000FF');
            expect(calc.evaluate('colorHsv(300, 100, 100)').result.raw).toEqual('#FFFF00FF');
            expect(calc.evaluate('colorHsv(359, 42, 29)').result.raw).toEqual('#FF4A2B2B');
            expect(calc.evaluate('colorHsv(0, 0, 75)').result.raw).toEqual('#FFBFBFBF');
            expect(calc.evaluate('colorHsv(220, 69, 31)').result.raw).toEqual('#FF192B4F');
            expect(calc.evaluate('colorHsv(22, 91, 98)').result.raw).toEqual('#FFFA6A16');
            expect(calc.evaluate('colorHsv(204, 8, 52)').result.raw).toEqual('#FF7A8085');
        });

        it ('Should construct colors from HSL values', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('colorHsl(0, 0, 0)').result.raw).toEqual('#FF000000');
            expect(calc.evaluate('colorHsl(0, 0, 100)').result.raw).toEqual('#FFFFFFFF');
            expect(calc.evaluate('colorHsl(0, 100, 50)').result.raw).toEqual('#FFFF0000');
            expect(calc.evaluate('colorHsl(60, 100, 50)').result.raw).toEqual('#FFFFFF00');
            expect(calc.evaluate('colorHsl(120, 100, 50)').result.raw).toEqual('#FF00FF00');
            expect(calc.evaluate('colorHsl(180, 100, 50)').result.raw).toEqual('#FF00FFFF');
            expect(calc.evaluate('colorHsl(240, 100, 50)').result.raw).toEqual('#FF0000FF');
            expect(calc.evaluate('colorHsl(300, 100, 50)').result.raw).toEqual('#FFFF00FF');
            expect(calc.evaluate('colorHsl(359, 42, 29)').result.raw).toEqual('#FF692B2C');
            expect(calc.evaluate('colorHsl(0, 0, 75)').result.raw).toEqual('#FFBFBFBF');
            expect(calc.evaluate('colorHsl(220, 69, 31)').result.raw).toEqual('#FF193D86');
            expect(calc.evaluate('colorHsl(22, 91, 98)').result.raw).toEqual('#FFFFF9F5');
            expect(calc.evaluate('colorHsl(204, 8, 52)').result.raw).toEqual('#FF7B878E');
        });

        it ('Should construct colors from literals', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('#00000000').result.raw).toEqual('#00000000');
            expect(calc.evaluate('#000000').result.raw).toEqual('#FF000000');
            expect(calc.evaluate('#1f2A30CF').result.raw).toEqual('#1F2A30CF');
            expect(calc.evaluate('#AbcdeF').result.raw).toEqual('#FFABCDEF');

            expect(function () { calc.evaluate('#abcdeff'); }).toThrowError(Error);
            expect(function () { calc.evaluate('#abcdefgh'); }).toThrowError(Error);
        });

        it ('Should generate color sample HTML fragment', function ()
        {
            var calc = createCalculatorInstance(),
                e = new clc.ColorExtension();

            expect(calc.evaluate('#00000000').result.postprocessed).toEqual(e._generateColorSampleHtml('#00000000'));
            expect(calc.evaluate('#0f12abcd').result.postprocessed).toEqual(e._generateColorSampleHtml('#0F12ABCD'));
        });

        it ('Should generate TeX markup for colors', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('#00000000').tex).toEqual('\\mathtt{\\#00000000}');
            expect(calc.evaluate('#123455').tex).toEqual('\\mathtt{\\#FF123455}');
        });
    });

    describe ('Formats', function ()
    {
        it ('Should convert color to HSV correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('hsv(#00000000)').result.raw).toEqual('[0, 0, 0]');
            expect(calc.evaluate('hsv(#FFFFFF)').result.raw).toEqual('[0, 0, 100]');
            expect(calc.evaluate('hsv(#FF0000)').result.raw).toEqual('[0, 100, 100]');
            expect(calc.evaluate('hsv(#00FF00)').result.raw).toEqual('[120, 100, 100]');
            expect(calc.evaluate('hsv(#0000FF)').result.raw).toEqual('[240, 100, 100]');
            expect(calc.evaluate('hsv(#FF00FF)').result.raw).toEqual('[300, 100, 100]');
            expect(calc.evaluate('hsv(#c0c0c0)').result.raw).toEqual('[0, 0, 75]');
            expect(calc.evaluate('hsv(#182a4e)').result.raw).toEqual('[220, 69, 31]');
            expect(calc.evaluate('hsv(#fb6b17)').result.raw).toEqual('[22, 91, 98]');
            expect(calc.evaluate('hsv(#7a8084)').result.raw).toEqual('[204, 8, 52]');
            expect(calc.evaluate('hsv([ #FF0000, #00FF00, #0000FF ])').result.raw).toEqual('[[0, 100, 100], [120, 100, 100], [240, 100, 100]]');
            expect(calc.evaluate('hsv([[ #FF0000, #00FF00 ], [ #0000FF, #FFFFFF ] ])').result.raw).toEqual('[[[0, 100, 100], [120, 100, 100]], [[240, 100, 100], [0, 0, 100]]]');
        });

        it ('Should convert color to HSL correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('hsl(#00000000)').result.raw).toEqual('[0, 0, 0]');
            expect(calc.evaluate('hsl(#FFFFFF)').result.raw).toEqual('[0, 0, 100]');
            expect(calc.evaluate('hsl(#FF0000)').result.raw).toEqual('[0, 100, 50]');
            expect(calc.evaluate('hsl(#00FF00)').result.raw).toEqual('[120, 100, 50]');
            expect(calc.evaluate('hsl(#0000FF)').result.raw).toEqual('[240, 100, 50]');
            expect(calc.evaluate('hsl(#FF00FF)').result.raw).toEqual('[300, 100, 50]');
            expect(calc.evaluate('hsl(#c0c0c0)').result.raw).toEqual('[0, 0, 75]');
            expect(calc.evaluate('hsl(#182a4e)').result.raw).toEqual('[220, 53, 20]');
            expect(calc.evaluate('hsl(#fb6b17)').result.raw).toEqual('[22, 97, 54]');
            expect(calc.evaluate('hsl(#7a8084)').result.raw).toEqual('[204, 4, 50]');
            expect(calc.evaluate('hsl([ #FF0000, #00FF00, #0000FF ])').result.raw).toEqual('[[0, 100, 50], [120, 100, 50], [240, 100, 50]]');
        });

        it ('Should convert color to RGB/ARGB/ARGBF correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('rgb(#00000000)').result.raw).toEqual('[0, 0, 0]');
            expect(calc.evaluate('rgb(#FFFFFF)').result.raw).toEqual('[255, 255, 255]');
            expect(calc.evaluate('rgb(#010203)').result.raw).toEqual('[1, 2, 3]');
            expect(calc.evaluate('argb(#00000000)').result.raw).toEqual('[0, 0, 0, 0]');
            expect(calc.evaluate('argb(#FFFFFF)').result.raw).toEqual('[255, 255, 255, 255]');
            expect(calc.evaluate('argb(#80010203)').result.raw).toEqual('[128, 1, 2, 3]');
            expect(calc.evaluate('argbf(#00000000)').result.raw).toEqual('[0, 0, 0, 0]');
            expect(calc.evaluate('argbf(#FFFFFFFF)').result.raw).toEqual('[1, 1, 1, 1]');
            expect(calc.evaluate('argbf(#33551101)').result.raw).toEqual('[0.2, 0.3333333333333333, 0.06666666666666667, 0.00392156862745098]');
        });
    });

    describe ('Arithmetic Operations', function ()
    {
        it ('Should add colors correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('#00000000 + #00000000').result.raw).toEqual('#00000000');
            expect(calc.evaluate('#FFFFFFFF + #FFFFFFFF').result.raw).toEqual('#FFFFFFFF');
            expect(calc.evaluate('#FF0000 + #00FF00').result.raw).toEqual('#FFFFFF00');
            expect(calc.evaluate('#0000FF + #00FF00').result.raw).toEqual('#FF00FFFF');
            expect(calc.evaluate('#01020304 + #A0B0C0D0').result.raw).toEqual('#A1B2C3D4');
        });

        it ('Should subtract colors correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('#00000000 - #00000000').result.raw).toEqual('#00000000');
            expect(calc.evaluate('#FFFFFFFF - #FFFFFFFF').result.raw).toEqual('#00000000');
            expect(calc.evaluate('#00000000 - #FFFFFFFF').result.raw).toEqual('#00000000');
            expect(calc.evaluate('#FFFFFF - #00FF00').result.raw).toEqual('#00FF00FF');
            expect(calc.evaluate('#F0F0F0F0 - #0000FFF0').result.raw).toEqual('#F0F00000');
            expect(calc.evaluate('#A1B2C3D4 - #A0B0C0D0').result.raw).toEqual('#01020304');
        });

        it ('Should multiply colors correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('#00000000 * #00000000').result.raw).toEqual('#00000000');
            expect(calc.evaluate('#FFFFFFFF * #FFFFFFFF').result.raw).toEqual('#FFFFFFFF');
            expect(calc.evaluate('#00000000 * #FFFFFFFF').result.raw).toEqual('#00000000');
            expect(calc.evaluate('#FFFFFFFF * #80808080').result.raw).toEqual('#80808080');
            expect(calc.evaluate('#FFFFFFFF * 0.5').result.raw).toEqual('#80808080');
            expect(calc.evaluate('0.2*#FFFFFFFF').result.raw).toEqual('#33333333');
        });

        it ('Should divide colors correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('#00000000 / #FFFFFFFF').result.raw).toEqual('#00000000');
            expect(calc.evaluate('#FFFFFFFF / #FFFFFFFF').result.raw).toEqual('#FFFFFFFF');
            expect(calc.evaluate('#80808080 / #FFFFFFFF').result.raw).toEqual('#80808080');
            expect(calc.evaluate('#FFFFFFFF / 2').result.raw).toEqual('#80808080');
            expect(calc.evaluate('#FFFFFFFF / 5').result.raw).toEqual('#33333333');
        });
    });

    describe ('Color Tooltips', function ()
    {
        it ('Should show correct color tooltips', function ()
        {
            var ext = new clc.ColorExtension(true),
                calc = createCalculatorInstance({ 'color': ext });

            // Add 3 colors
            var colors = [ '#00000000', '#FA12BCED', '#FFFFFFFF' ], i;
            $('body').append(calc.evaluate('#00000000').result.postprocessed);
            $('body').append(calc.evaluate('#fa12bced').result.postprocessed);
            $('body').append(calc.evaluate('#ffffff').result.postprocessed);

            // No tooltips should be visible
            expect($('.tooltip').length).toBe(0);

            // Click and verify tooltips one by one
            for (i = 0; i < 3; ++i)
            {
                $('.color-sample')[i].click(); // Click on color sample to trigger tooltip
                expect($('.tooltip').length).toBe(i + 1); // Tooltips should stay opened

                // Verify tooltip color code
                expect($('.tooltip').eq(i).find('.tooltip-inner').text()).toBe(colors[i]);
            }

            // Double check that all 3 tooltips are visible with correct color codes
            for (i = 0; i < 3; ++i)
                expect($('.tooltip').eq(i).find('.tooltip-inner').text()).toBe(colors[i]);

            // Click elsewhere to trigger all tooltips close
            $('body').append('<div id="dummy">dummy</div>');
            $('#dummy').click();
        });
    });
});
