describe ('Aliases', function ()
{
    beforeEach(function() { jasmine.addCustomEqualityTester(texIgnoringResultEqualityTester); });

    it ('Should process nCr exactly the same as combinations', function ()
    {
        var calc = createCalculatorInstance();

        expect(calc.evaluate('nCr(0, 0)').result).toEqual(createResult('1'));
        expect(calc.evaluate('nCr(5, 3)').result).toEqual(createResult('10'));
        expect(calc.evaluate('nCr(7, 2)').tex).toEqual('\\binom{7}{2}');
        expect(calc.evaluate('combinations(7, 2)').tex).toEqual('\\binom{7}{2}');
        expect(function () { calc.evaluate('nCr(1, 2)'); }).toThrowError(TypeError);
        expect(function () { calc.evaluate('nCr(1)'); }).toThrowError(TypeError);
        expect(function () { calc.evaluate('nCr()'); }).toThrowError(TypeError);
    });

    it ('Should process nPr exactly the same as permutations', function ()
    {
        var calc = createCalculatorInstance();

        expect(calc.evaluate('nPr(0, 0)').result).toEqual(createResult('1'));
        expect(calc.evaluate('nPr(5, 3)').result).toEqual(createResult('60'));
        expect(calc.evaluate('nPr(10)').result).toEqual(createResult('3628800'));
        expect(calc.evaluate('nPr(7, 2)').tex).toEqual('\\mathrm{permutations}\\left(7,2\\right)');
        expect(calc.evaluate('permutations(7, 2)').tex).toEqual('\\mathrm{permutations}\\left(7,2\\right)');
        expect(function () { calc.evaluate('nPr(1, 2)'); }).toThrowError(TypeError);
        expect(function () { calc.evaluate('nPr()'); }).toThrowError(TypeError);
    });

    it ('Should process ln exactly the same as log(x)', function ()
    {
        var calc = createCalculatorInstance();

        expect(calc.evaluate('ln(1)').result).toEqual(createResult('0'));
        expect(calc.evaluate('ln(e)').result).toEqual(createResult('1'));
        expect(calc.evaluate('ln(e^2)').result).toEqual(createResult('2'));
        expect(calc.evaluate('ln(e)').tex).toEqual('\\ln\\left( e\\right)');
        expect(function () { calc.evaluate('ln(1, 2)'); }).toThrowError(TypeError);
        expect(function () { calc.evaluate('ln()'); }).toThrowError(TypeError);
    });
});
