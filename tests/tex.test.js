describe ('TeX', function ()
{
    it ('Should convert expressions to TeX correctly', function ()
    {
        var calc = createCalculatorInstance();

        expect(calc.evaluate('12345').tex).toEqual('12345');
        expect(calc.evaluate('-12345.123456789').tex).toEqual('-12345.123456789');
        expect(calc.evaluate('2/3').tex).toEqual('\\frac{2}{3}');
        expect(calc.evaluate('2^2').tex).toEqual('{2}^{2}');
        expect(calc.evaluate('pi').tex).toEqual('\\pi');
        expect(calc.evaluate('true').tex).toEqual('\\mathrm{True}');
        expect(calc.evaluate('"hello"').tex).toEqual('\\mathtt{"hello"}');
        expect(calc.evaluate('2+3i').tex).toEqual('2+3~ i');
        expect(calc.evaluate('0xff').tex).toEqual('255');
        expect(calc.evaluate('[1, 2, 3]').tex).toEqual('\\begin{bmatrix}1\\\\2\\\\3\\\\\\end{bmatrix}');
        expect(calc.evaluate('[[1,2],[3,4]]').tex).toEqual('\\begin{bmatrix}1&2\\\\3&4\\\\\\end{bmatrix}');
        expect(calc.evaluate('#abcdef').tex).toEqual('\\mathtt{\\#FFABCDEF}');
        expect(calc.evaluate('sin(pi)+cos(tau)').tex).toEqual('\\sin\\left(\\pi\\right)+\\cos\\left(\\tau\\right)');
        expect(calc.evaluate('simplify("a+2a")').tex).toEqual('\\mathrm{simplify}\\left(\\mathtt{"a+2a"}\\right)');
        expect(calc.evaluate('lerp(0, 1, 0.3)').tex).toEqual('\\mathrm{lerp}\\left(0,1,0.3\\right)');
        expect(calc.evaluate('x = 1.5').tex).toEqual(' x:=1.5');
        expect(calc.evaluate('f(x) = x!').tex).toEqual('\\mathrm{f}\\left(x\\right):= x!');
    });

    it ('Should convert expression values to TeX correctly', function ()
    {
        var calc = createCalculatorInstance();

        expect(calc.evaluate('12345').result.tex).toEqual('12345');
        expect(calc.evaluate('-1/2').result.tex).toEqual('-0.5');
        expect(calc.evaluate('true').result.tex).toEqual('\\mathrm{True}');
        expect(calc.evaluate('"hello"').result.tex).toEqual('\\mathtt{"hello"}');
        expect(calc.evaluate('2+3i').result.tex).toEqual('2+3~ i');
        expect(calc.evaluate('0xff').result.tex).toEqual('255');
        expect(calc.evaluate('[1, 2, 3] * 2').result.tex).toEqual('\\begin{bmatrix}2\\\\4\\\\6\\\\\\end{bmatrix}');
        expect(calc.evaluate('[[1,2],[3,4]]*2').result.tex).toEqual('\\begin{bmatrix}2&4\\\\6&8\\\\\\end{bmatrix}');
        expect(calc.evaluate('#abcdef').result.tex).toEqual('\\mathtt{\\#FFABCDEF}');
        expect(calc.evaluate('simplify("a+2a")').result.tex).toEqual('3\\cdot a');
        expect(calc.evaluate('hex(123)').result.tex).toEqual('\\mathtt{"123"}');
        expect(calc.evaluate('md5([ 1, 2, 3])').result.tex).toEqual('\\mathtt{"5289df737df57326fcdd22597afb1fac"}');
    });
});
