describe ('Custom hex/bin number literals', function ()
{
    beforeEach(function() { jasmine.addCustomEqualityTester(texIgnoringResultEqualityTester); });

    describe ('Hex/Bin/Oct Literals', function ()
    {
        it ('Should convert big integer hex/oct/bin to decimal correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('0x0').result).toEqual(createResult('0'));
            expect(calc.evaluate('0b0').result).toEqual(createResult('0'));
            expect(calc.evaluate('0o0').result).toEqual(createResult('0'));
            expect(calc.evaluate('0x0123ABcde.fa').result).toEqual(createResult('305839326.9765625'));
            expect(calc.evaluate('-0x.a1b2fF3e').result).toEqual(createResult('-0.6316375280730426311492919921875'));
            expect(calc.evaluate('0b110.010').result).toEqual(createResult('6.25'));
            expect(calc.evaluate('0b110.010').result).toEqual(createResult('6.25'));
            expect(calc.evaluate('0o123.45670').result).toEqual(createResult('83.591552734375'));
        });

        it ('Should convert to hex/oct/bin correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('hex(0)').result).toEqual(createResult('"0x0"'));
            expect(calc.evaluate('hex(NaN)').result).toEqual(createResult('"NaN"'));
            expect(calc.evaluate('hex(Infinity)').result).toEqual(createResult('"Infinity"'));
            expect(calc.evaluate('hex(255)').result).toEqual(createResult('"0xff"'));
            expect(calc.evaluate('hex(-1311768467294899695)').result).toEqual(createResult('"-0x1234567890abcdef"'));
            expect(calc.evaluate('hex(pi)').result).toEqual(createResult('"0x3.243f6a8885a308d313198a2e03707344a4093822299f31d0082eda2e358c7c9"'));
            expect(calc.evaluate('hex(123456*35.5+0xabcdef)').result).toEqual(createResult('"0xeeadcf"'));
            expect(calc.evaluate('bin(0)').result).toEqual(createResult('"0b0"'));
            expect(calc.evaluate('bin(-1623369211292499550)').result).toEqual(createResult('"-0b1011010000111010111011011001001011010011001010011111001011110"'));
            expect(calc.evaluate('bin(pi)').result).toEqual(createResult('"0b11.00100100001111110110101010001000100001011010001100001000110101"'));
            expect(calc.evaluate('oct(0)').result).toEqual(createResult('"0o0"'));
            expect(calc.evaluate('oct(pi)').result).toEqual(createResult('"0o3.110375524210264302151423063050560067016321122011160210514763072"'));
        });

        it ('Should convert hex/oct/bin literals correctly if word size specified', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('hex(-1, number(32))').result).toEqual(createResult('"0xffffffffi32"'));
            expect(calc.evaluate('0xffi8').result).toEqual(createResult('-1'));
            expect(calc.evaluate('0xabcdef12i32').result).toEqual(createResult('-1412567278'));
            expect(calc.evaluate('0b10110110i8').result).toEqual(createResult('-74'));
            expect(calc.evaluate('0o177253i16').result).toEqual(createResult('-341'));
        });

        it ('Should fail conversion to hex for unsupported types', function ()
        {
            var calc = createCalculatorInstance();

            expect(function () { calc.evaluate('hex([1])'); }).toThrowError(TypeError);           // Array
            expect(function () { calc.evaluate('hex(2+3i)'); }).toThrowError(TypeError);          // Complex
            expect(function () { calc.evaluate('hex("test")'); }).toThrowError(Error);            // String
            expect(function () { calc.evaluate('hex(2 ft)'); }).toThrowError(TypeError);          // Unit
            expect(function () { calc.evaluate('hex(sin)'); }).toThrowError(TypeError);           // Function
            expect(function () { calc.evaluate('hex(fraction(1,3))'); }).toThrowError(TypeError); // Fraction
        });
    });
});
