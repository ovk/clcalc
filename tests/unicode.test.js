describe ('Unicode extension', function ()
{
    beforeEach(function() { jasmine.addCustomEqualityTester(texIgnoringResultEqualityTester); });
    
    describe ('Unicode code points', function ()
    {
        it ('Should convert string to code points list correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('toCodePoints("")').result).toEqual(createResult('[]'));
            expect(calc.evaluate('toCodePoints("0")').result).toEqual(createResult('[48]'));
            expect(calc.evaluate('toCodePoints("$¢€𐍈")').result).toEqual(createResult('[36, 162, 8364, 66376]'));
            expect(calc.evaluate('toCodePoints(" \tascii^")').result).toEqual(createResult('[32, 9, 97, 115, 99, 105, 105, 94]'));
            expect(calc.evaluate('toCodePoints("𝐀𝐁♡💩")').result).toEqual(createResult('[119808, 119809, 9825, 128169]'));
            expect(calc.evaluate('toCodePoints("ññ")').result).toEqual(createResult('[241, 110, 771]'));
            expect(calc.evaluate('toCodePoints("Iñtërnâtiônàlizætiøn☃")').result)
                .toEqual(createResult('[73, 241, 116, 235, 114, 110, 226, 116, 105, 244, 110, 224, 108, 105, 122, 230, 116, 105, 248, 110, 9731]'));
        });

        it ('Should create string from code points list correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('fromCodePoints([])').result).toEqual(createResult('""'));
            expect(calc.evaluate('fromCodePoints([49])').result).toEqual(createResult('"1"'));
            expect(calc.evaluate('fromCodePoints([36, 162, 8364, 66376])').result).toEqual(createResult('"$¢€𐍈"'));
            expect(calc.evaluate('fromCodePoints([32, 9, 97, 115, 99, 105, 105, 94])').result).toEqual(createResult('" \tascii^"'));
            expect(calc.evaluate('fromCodePoints([119808, 119809, 9825, 128169])').result).toEqual(createResult('"𝐀𝐁♡💩"'));
            expect(calc.evaluate('fromCodePoints([241, 110, 771])').result).toEqual(createResult('"ññ"'));
            expect(calc.evaluate('fromCodePoints([73, 241, 116, 235, 114, 110, 226, 116, 105, 244, 110, 224, 108, 105, 122, 230, 116, 105, 248, 110, 9731])').result)
                .toEqual(createResult('"Iñtërnâtiônàlizætiøn☃"'));
            expect(function () { calc.evaluate('fromCodePoints([-1])'); }).toThrowError(Error);
            expect(function () { calc.evaluate('fromCodePoints([1114112])'); }).toThrowError(Error);
        });
    });

    describe('UTF8', function ()
    {
        it ('Should convert string to utf8 array correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('toUtf8("")').result).toEqual(createResult('[]'));
            expect(calc.evaluate('toUtf8("0")').result).toEqual(createResult('[48]'));
            expect(calc.evaluate('toUtf8("$¢€𐍈")').result).toEqual(createResult('[36, 194, 162, 226, 130, 172, 240, 144, 141, 136]'));
            expect(calc.evaluate('toUtf8(" \tascii^")').result).toEqual(createResult('[32, 9, 97, 115, 99, 105, 105, 94]'));
            expect(calc.evaluate('toUtf8("𝐀𝐁♡💩")').result).toEqual(createResult('[240, 157, 144, 128, 240, 157, 144, 129, 226, 153, 161, 240, 159, 146, 169]'));
            expect(calc.evaluate('toUtf8("ññ")').result).toEqual(createResult('[195, 177, 110, 204, 131]'));
            expect(calc.evaluate('toUtf8("Iñtërnâtiônàlizætiøn☃")').result)
                .toEqual(createResult('[73, 195, 177, 116, 195, 171, 114, 110, 195, 162, 116, 105, 195, 180, 110, 195, 160, 108, 105, 122, 195, 166, 116, 105, 195, 184, 110, 226, 152, 131]'));
        });

        it ('Should create string from utf8 byte array correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('fromUtf8([])').result).toEqual(createResult('""'));
            expect(calc.evaluate('fromUtf8([48])').result).toEqual(createResult('"0"'));
            expect(calc.evaluate('fromUtf8([36, 194, 162, 226, 130, 172, 240, 144, 141, 136])').result).toEqual(createResult('"$¢€𐍈"'));
            expect(calc.evaluate('fromUtf8([32, 9, 97, 115, 99, 105, 105, 94])').result).toEqual(createResult('" \tascii^"'));
            expect(calc.evaluate('fromUtf8([240, 157, 144, 128, 240, 157, 144, 129, 226, 153, 161, 240, 159, 146, 169])').result).toEqual(createResult('"𝐀𝐁♡💩"'));
            expect(calc.evaluate('fromUtf8([195, 177, 110, 204, 131])').result).toEqual(createResult('"ññ"'));
            expect(calc.evaluate('fromUtf8([73, 195, 177, 116, 195, 171, 114, 110, 195, 162, 116, 105, 195, 180, 110, 195, 160, 108, 105, 122, 195, 166, 116, 105, 195, 184, 110, 226, 152, 131])').result)
                .toEqual(createResult('"Iñtërnâtiônàlizætiøn☃"'));
            expect(function () { calc.evaluate('fromUtf8([-1])'); }).toThrowError(Error);
            expect(function () { calc.evaluate('fromUtf8([256])'); }).toThrowError(Error);
        });
    });
});
