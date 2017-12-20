describe('Linear Interpolation', function ()
{
    beforeEach(function() { jasmine.addCustomEqualityTester(texIgnoringResultEqualityTester); });

    it ('Should return boundaries when t is 0 or 1', function ()
    {
        var calc = createCalculatorInstance();

        expect(calc.evaluate('lerp(0, 1, 0)').result).toEqual(createResult('0'));
        expect(calc.evaluate('lerp(0, 1, 1)').result).toEqual(createResult('1'));
        expect(calc.evaluate('lerp(-10.321456987456321, 0.456654123878987, 0)').result).toEqual(createResult('-10.321456987456321'));
        expect(calc.evaluate('lerp(-10.321456987456321, 0.456654123878987, 1)').result).toEqual(createResult('0.456654123878987'));
        expect(calc.evaluate('lerp(42, 42, 0)').result).toEqual(createResult('42'));
        expect(calc.evaluate('lerp(42, 42, 1)').result).toEqual(createResult('42'));
    });

    it ('Should interpolate numbers correctly', function ()
    {
        var calc = createCalculatorInstance();

        expect(calc.evaluate('lerp(10, 50, 0.3)').result).toEqual(createResult('22'));
        expect(calc.evaluate('lerp(-30, 500, 0.1)').result).toEqual(createResult('23'));
        expect(calc.evaluate('lerp(-100, -10, 0.7)').result).toEqual(createResult('-37'));
        expect(calc.evaluate('lerp(48016783720461873502938.1837128397012300012367, 480167837204618735029380.1837128397012300012367, 0.5463739572846194192747263221)').result)
            .toEqual(createResult('284132864957317876625463.2805316958815938376392589682'));
        expect(calc.evaluate('lerp(0, 1, 0.123)').result).toEqual(createResult('0.123'));
        expect(function () { calc.evaluate('lerp(0, 1, -0.1)'); }).toThrowError(Error);
        expect(function () { calc.evaluate('lerp(0, 1, 1.1)'); }).toThrowError(Error);
    });

    it ('Should interpolate colors correctly', function ()
    {
        var calc = createCalculatorInstance();

        expect(calc.evaluate('lerp(#00000000, #ffffffff, 0.5)').result.raw).toEqual('#80808080');
        expect(calc.evaluate('lerp(#11223344, #ffeeddcc, 0.7)').result.raw).toEqual('#B8B1AAA3');
        expect(calc.evaluate('lerp(#abcdef12, #fedcba21, 0)').result.raw).toEqual('#ABCDEF12');
        expect(calc.evaluate('lerp(#abcdef12, #fedcba21, 1)').result.raw).toEqual('#FEDCBA21');
    });
});
