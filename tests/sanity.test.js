describe ('Calculator:Sanity', function ()
{
    beforeEach(function() { jasmine.addCustomEqualityTester(texIgnoringResultEqualityTester); });

    describe ('Formatting', function ()
    {
        it ('Should format numbers correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('0')).toEqual(createEvaluatedExpression('0', '0'));
            expect(calc.evaluate('-0')).toEqual(createEvaluatedExpression('-0', '0'));
            expect(calc.evaluate('000')).toEqual(createEvaluatedExpression('0', '0'));
            expect(calc.evaluate('0.0')).toEqual(createEvaluatedExpression('0', '0'));
            expect(calc.evaluate('1.000')).toEqual(createEvaluatedExpression('1', '1'));
            expect(calc.evaluate(repeatString('1', settings.precision)))
                .toEqual(createEvaluatedExpression('1.' + repeatString('1', settings.precision - 1) + '\\cdot10^{+' + (settings.precision - 1) + '}', repeatString('1', settings.precision)));
            expect(calc.evaluate(repeatString('1', settings.precision) + '.000'))
                .toEqual(createEvaluatedExpression('1.' + repeatString('1', settings.precision - 1) + '\\cdot10^{+' + (settings.precision - 1) + '}', repeatString('1', settings.precision)));
            expect(calc.evaluate('0.' + repeatString('0', settings.precision - 1) + '1000'))
                .toEqual(createEvaluatedExpression('1\\cdot10^{-' + settings.precision + '}', '0.' + repeatString('0', settings.precision - 1) + '1'));
            expect(calc.evaluate('1e+2')).toEqual(createEvaluatedExpression('100', '100'));
        });
    });

    describe ('Input', function ()
    {
        it ('Should ignore empty input', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('')).toEqual(new clc.EvaluatedExpression());
            expect(calc.evaluate('\n')).toEqual(new clc.EvaluatedExpression());
            expect(calc.evaluate(' ')).toEqual(new clc.EvaluatedExpression());
            expect(calc.evaluate('        ')).toEqual(new clc.EvaluatedExpression());
            expect(calc.evaluate(' \t \r \n ' + String.fromCharCode(160))).toEqual(new clc.EvaluatedExpression());
        });
    });

    describe ('Precision', function ()
    {
        it ('Should have correct precision', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate(repeatString('1', settings.precision) + ' + 1').result).toEqual(createResult(repeatString('1', settings.precision - 1) + '2'));
            expect(calc.evaluate(repeatString('1', settings.precision + 1) + ' + 1').result).toEqual(createResult(repeatString('1', settings.precision) + '0'));
            expect(calc.evaluate('0.' + repeatString('0', settings.precision - 2) + '1 + 1').result).toEqual(createResult('1.' + repeatString('0', settings.precision - 2) + '1'));
            expect(calc.evaluate('0.' + repeatString('0', settings.precision - 1) + '1 + 1').result).toEqual(createResult('1'));
        });
    });

    describe ('Math', function ()
    {
        it ('Should give correct results', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('50!').result).toEqual(createResult('30414093201713378043612608166064768844377641568960512000000000000'));
            expect(calc.evaluate('123.456^2.8').result).toEqual(createResult('718181.4186963520214901021098224731041010020903002420469909309641'));
            expect(calc.evaluate('25^42').result).toEqual(createResult('51698788284564229679463043254372678347863256931304931640625'));
            // TODO: figure out the inconsistency between Chrome and Firefox: 
            // expect(calc.evaluate('sin(2.4568789842432156)').result).toEqual(createResult('0.6324512456727145331306148516661550440908815286239466922474346734'));
            expect(calc.evaluate('log(2.4568789842432156)').result).toEqual(createResult('0.8988918388637857481742500749824069745678428353943294394088822395'));
            expect(calc.evaluate('3869888484.674541272*589093131 / (-702628549 + 0) - (-1) - 0 + (-604540353705946799.896693804)').result)
                .toEqual(createResult('-604540356950512832.1191369670818955407973324465641660114212068545'));
            expect(calc.evaluate('(3.76+7.4i)*(.24+7.85i)').result).toEqual(createResult('-57.1876 + 31.291999999999998i'));
            expect(calc.evaluate('0!').result).toEqual(createResult('1'));
            expect(calc.evaluate('0^0').result).toEqual(createResult('1'));
            expect(calc.evaluate('1/0').result).toEqual(createResult('Infinity'));
            expect(calc.evaluate('-1/0').result).toEqual(createResult('-Infinity'));
            expect(calc.evaluate('1/-0').result).toEqual(createResult('-Infinity'));
            expect(calc.evaluate('0/0').result).toEqual(createResult('NaN'));
            expect(calc.evaluate('sin(PI*0.74823465)^2 + cos(PI*0.74823465)^2').result).toEqual(createResult('1'));
        });
    });
});
