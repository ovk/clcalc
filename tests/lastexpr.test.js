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
    });

    it ('Should not update $ variable untill expression evaluation complete', function ()
    {
        var calc = createCalculatorInstance();

        expect(calc.evaluate('2+3').result).toEqual(createResult('5'));
        expect(calc.evaluate('$').result).toEqual(createResult('5'));
        expect(calc.evaluate('$ + 2').result).toEqual(createResult('7'));
        expect(calc.evaluate('$').result).toEqual(createResult('7'));
    });
});
