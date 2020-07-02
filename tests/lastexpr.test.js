describe ('Last evaluated expression', function ()
{
    beforeEach(function() { jasmine.addCustomEqualityTester(texIgnoringResultEqualityTester); });

    it ('Should store last evaluated expressions value for all supported types', function ()
    {
        var calc = createCalculatorInstance();

        expect(calc.evaluate('0').result).toEqual(createResult('0'));
        expect(calc.evaluate('$').result).toEqual(createResult('0'));
        expect(calc.evaluate('$').result).toEqual(createResult('0'));

        expect(calc.evaluate('2+3*5').result).toEqual(createResult('17'));
        expect(calc.evaluate('$').result).toEqual(createResult('17'));

        expect(calc.evaluate('pi').result).toEqual(createResult('3.141592653589793238462643383279502884197169399375105820974944592'));
        expect(calc.evaluate('$').result).toEqual(createResult('3.141592653589793238462643383279502884197169399375105820974944592'));

        expect(calc.evaluate('fraction("2/3")').result).toEqual(createResult('2/3'));
        expect(calc.evaluate('$').result).toEqual(createResult('2/3'));

        expect(calc.evaluate('3 > 2 and 3 < 5').result).toEqual(createResult('true'));
        expect(calc.evaluate('$').result).toEqual(createResult('true'));

        expect(calc.evaluate('"test"').result).toEqual(createResult('"test"'));
        expect(calc.evaluate('$').result).toEqual(createResult('"test"'));

        expect(calc.evaluate('concat("Hello, ", "World")').result).toEqual(createResult('"Hello, World"'));
        expect(calc.evaluate('$').result).toEqual(createResult('"Hello, World"'));

        expect(calc.evaluate('[1, 2, 3] + 10').result).toEqual(createResult('[11, 12, 13]'));
        expect(calc.evaluate('$').result).toEqual(createResult('[11, 12, 13]'));

        expect(calc.evaluate('100 m to km').result).toEqual(createResult('0.1 km'));
        expect(calc.evaluate('$').result).toEqual(createResult('0.1 km'));

        expect(calc.evaluate('2 + 3i').result).toEqual(createResult('2 + 3i'));
        expect(calc.evaluate('$').result).toEqual(createResult('2 + 3i'));

        expect(calc.evaluate('f(x) = x + 3').result).toEqual(createResult(null));
        expect(calc.evaluate('$(4)').result).toEqual(createResult('7'));

        expect(calc.evaluate('#aabbccdd').result.raw).toEqual('#AABBCCDD');
        expect(calc.evaluate('$').result.raw).toEqual('#AABBCCDD');
    });

    it ('Should not update $ variable untill expression evaluation complete', function ()
    {
        var calc = createCalculatorInstance();

        expect(calc.evaluate('2+3').result).toEqual(createResult('5'));
        expect(calc.evaluate('$').result).toEqual(createResult('5'));
        expect(calc.evaluate('$ + 2').result).toEqual(createResult('7'));
        expect(calc.evaluate('$').result).toEqual(createResult('7'));
    });

    it ('Should not re-evaluate expression', function ()
    {
        var calc = createCalculatorInstance();

        expect(calc.evaluate('x = 1').result).toEqual(createResult('1'));
        expect(calc.evaluate('$').result).toEqual(createResult('1'));
        expect(calc.evaluate('x = x + 1').result).toEqual(createResult('2'));
        expect(calc.evaluate('$').result).toEqual(createResult('2'));
        expect(calc.evaluate('$').result).toEqual(createResult('2'));
    });

    it ('Should be a reference', function ()
    {
        var calc = createCalculatorInstance();

        expect(calc.evaluate('x = { "a": 1 }').result).toEqual(createResult('{"a": 1}'));
        expect(calc.evaluate('$').result).toEqual(createResult('{"a": 1}'));
        expect(calc.evaluate('x.a = 2; $.a').result).toEqual(createResult('[2]'));
        expect(calc.evaluate('$').result).toEqual(createResult('[2]'));
        expect(calc.evaluate('x').result).toEqual(createResult('{"a": 2}'));
    });

    it ('Should convert to Tex correctly', function ()
    {
        var calc = createCalculatorInstance();

        expect(calc.evaluate('2^2').result).toEqual(createResult('4'));
        expect(calc.evaluate('$').tex).toEqual('\\mathtt{\\$}');
        expect(calc.evaluate('f(x) = x^2').result).toEqual(createResult(null));
        expect(calc.evaluate('$(3)').tex).toEqual('\\mathrm{\\$}\\left(3\\right)');
    });
});
