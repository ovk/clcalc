describe ('Custom hex/bin number literals', function ()
{
    beforeEach(function() { jasmine.addCustomEqualityTester(texIgnoringResultEqualityTester); });

    describe ('Hex Literals', function ()
    {
        it ('Should convert from hex to decimal correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('0x0').result).toEqual(createResult('0'));
            expect(calc.evaluate('0X0').result).toEqual(createResult('0'));
            expect(calc.evaluate('-0x0').result).toEqual(createResult('0'));
            expect(calc.evaluate('0x1').result).toEqual(createResult('1'));
            expect(calc.evaluate('0xb').result).toEqual(createResult('11'));
            expect(calc.evaluate('0xFF').result).toEqual(createResult('255'));
            expect(calc.evaluate('0x1234567890abcdef').result).toEqual(createResult('1311768467294899695'));
            expect(calc.evaluate('-0XFEDCBA9876543210').result).toEqual(createResult('-18364758544493064720'));
            expect(calc.evaluate('0xF.8').result).toEqual(createResult('15.5'));
            expect(calc.evaluate('-0x.a1b2fF3e').result).toEqual(createResult('-0.6316375280730426311492919921875'));
        });

        it ('Should be preprocessed correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('  0x01+0xfa2+(0xff)+-0xef* 0x15 + 0xffff/0xff  ').result).toEqual(createResult('-504'));
            expect(calc.evaluate('0x2c!-0xf^0x11').result).toEqual(createResult('2658271574788448768043625811014615791793513192306640625'));
            expect(calc.evaluate('0xf3 > 0x3f').result).toEqual(createResult('true'));
            expect(calc.evaluate('0xabc.123==0Xabc.123').result).toEqual(createResult('true'));
            expect(calc.evaluate('- 0xf3>0x3f').result).toEqual(createResult('false'));
            expect(calc.evaluate('0xaf > 0x3d ? 0x3c<0x5a:false').result).toEqual(createResult('true'));
            expect(calc.evaluate('[0xbead]').result).toEqual(createResult('[48813]'));
            expect(calc.evaluate('[[0x10,0xf],[0x1f,0xffeef0.8]]').result).toEqual(createResult('[[16, 15], [31, 16772848.5]]'));
        });

        it ('Should not conflict with variables and functions', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('x = 42').result).toEqual(createResult('42'));
            expect(calc.evaluate('2x+0x+1.0x+x').result).toEqual(createResult('168'));
            expect(calc.evaluate('0xf-x').result).toEqual(createResult('-27'));
            expect(calc.evaluate('log(0xaf)').result).toEqual(createResult('5.164785973923514054306871409895555008688287438118896632284685933'));
        });

        it ('Should convert to hex literals correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('hex(0)').result).toEqual(createResult('"0x0"'));
            expect(calc.evaluate('hex(NaN)').result).toEqual(createResult('"NaN"'));
            expect(calc.evaluate('hex(Infinity)').result).toEqual(createResult('"Infinity"'));
            expect(calc.evaluate('hex(255)').result).toEqual(createResult('"0xff"'));
            expect(calc.evaluate('hex(-1311768467294899695)').result).toEqual(createResult('"-0x1234567890abcdef"'));
            expect(calc.evaluate('hex(pi)').result).toEqual(createResult('"0x3.243f6a8885a308d313198a2e03707344a4093822299f31d0082eda2e358c7c9"'));
            expect(calc.evaluate('hex(123456*35.5+0xabcdef)').result).toEqual(createResult('"0xeeadcf"'));
        });

        it ('Should convert matrices and lists to hex literals correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('hex([])').result).toEqual(createResult('[]'));
            expect(calc.evaluate('hex([ 128 ])').result).toEqual(createResult('["0x80"]'));
            expect(calc.evaluate('hex([ 0x123abcf, -0x0ffef, 0x1f.efafbc, 0x.abc ])').result).toEqual(createResult('["0x123abcf", "-0xffef", "0x1f.efafbc", "0x0.abc"]'));
            expect(calc.evaluate('hex([ [ 0xab, -0xcd ], [ 0x0, 0x1.2 ] ])').result).toEqual(createResult('[["0xab", "-0xcd"], ["0x0", "0x1.2"]]'));
            expect(calc.evaluate('hex(base64Decode("q80B"))').result).toEqual(createResult('["0xab", "0xcd", "0x1"]'));
        });

        it ('Should fail conversion to hex for unsupported types', function ()
        {
            var calc = createCalculatorInstance();

            expect(function () { calc.evaluate('hex(2+3i)'); }).toThrowError(TypeError);          // Complex
            expect(function () { calc.evaluate('hex("test")'); }).toThrowError(Error);            // String
            expect(function () { calc.evaluate('hex(2 ft)'); }).toThrowError(TypeError);          // Unit
            expect(function () { calc.evaluate('hex(sin)'); }).toThrowError(TypeError);           // Function
            expect(function () { calc.evaluate('hex(fraction(1,3))'); }).toThrowError(TypeError); // Fraction
        });
    });

    describe ('Binary Literals', function ()
    {
        it ('Should convert from binary to decimal correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('0b0').result).toEqual(createResult('0'));
            expect(calc.evaluate('0B0').result).toEqual(createResult('0'));
            expect(calc.evaluate('-0b0').result).toEqual(createResult('0'));
            expect(calc.evaluate('0b1').result).toEqual(createResult('1'));
            expect(calc.evaluate('0b101').result).toEqual(createResult('5'));
            expect(calc.evaluate('0b11111111').result).toEqual(createResult('255'));
            expect(calc.evaluate('0b11010011101001101001001010100100100100111100111100110').result).toEqual(createResult('7446796105316838'));
            expect(calc.evaluate('-0B1011010000111010111011011001001011010011001010011111001011110').result).toEqual(createResult('-1623369211292499550'));
            expect(calc.evaluate('0b1101.011').result).toEqual(createResult('13.375'));
            expect(calc.evaluate('-0b.011011011001').result).toEqual(createResult('-0.427978515625'));
        });

        it ('Should be preprocessed correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('  0b0100111+0b110+(0b011)+-0b1111* 0b11101 + 0b1111111111111111/0b11111111  ').result).toEqual(createResult('-130'));
            expect(calc.evaluate('0b10111!-0b0111^0b011').result).toEqual(createResult('25852016738884976639657'));
            expect(calc.evaluate('0b11101 > 0b11001').result).toEqual(createResult('true'));
            expect(calc.evaluate('0b110111.0111==0B110111.0111').result).toEqual(createResult('true'));
            expect(calc.evaluate('- 0b0101>0b1001').result).toEqual(createResult('false'));
            expect(calc.evaluate('0b1101 > 0b1011 ? 0b100011<0b111001:false').result).toEqual(createResult('true'));
            expect(calc.evaluate('[0b10100101000110101011]').result).toEqual(createResult('[676267]'));
            expect(calc.evaluate('[[0b10000,0b01111],[0b011111,0b111011000011.1]]').result).toEqual(createResult('[[16, 15], [31, 3779.5]]'));
        });

        it ('Should not conflict with variables and functions', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('b = 42').result).toEqual(createResult('42'));
            expect(calc.evaluate('2b+0b+1.0b+b').result).toEqual(createResult('168'));
            expect(calc.evaluate('0b1101-b').result).toEqual(createResult('-29'));
            expect(calc.evaluate('log(0b111101)').result).toEqual(createResult('4.110873864173311248751389103425614746315681743081261062937383646'));
        });

        it ('Should convert to binary literals correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('bin(0)').result).toEqual(createResult('"0b0"'));
            expect(calc.evaluate('bin(NaN)').result).toEqual(createResult('"NaN"'));
            expect(calc.evaluate('bin(Infinity)').result).toEqual(createResult('"Infinity"'));
            expect(calc.evaluate('bin(255)').result).toEqual(createResult('"0b11111111"'));
            expect(calc.evaluate('bin(-1623369211292499550)').result).toEqual(createResult('"-0b1011010000111010111011011001001011010011001010011111001011110"'));
            expect(calc.evaluate('bin(pi)').result).toEqual(createResult('"0b11.00100100001111110110101010001000100001011010001100001000110101"'));
            expect(calc.evaluate('bin(123456*35.5+0b110010101110101011)').result).toEqual(createResult('"0b10001100000101110001011"'));
        });

        it ('Should convert matrices and lists to binary literals correctly', function ()
        {
            var calc = createCalculatorInstance();

            expect(calc.evaluate('bin([])').result).toEqual(createResult('[]'));
            expect(calc.evaluate('bin([ 128 ])').result).toEqual(createResult('["0b10000000"]'));
            expect(calc.evaluate('bin([ 0b11101, -0b00111, 0b1110.10100, 0b.11101 ])').result).toEqual(createResult('["0b11101", "-0b111", "0b1110.101", "0b0.11101"]'));
            expect(calc.evaluate('bin([ [ 0b11, -0b0111 ], [ 0b0, 0b1.1 ] ])').result).toEqual(createResult('[["0b11", "-0b111"], ["0b0", "0b1.1"]]'));
            expect(calc.evaluate('bin(base64Decode("q80B"))').result).toEqual(createResult('["0b10101011", "0b11001101", "0b1"]'));
        });

        it ('Should fail conversion to binary for unsupported types', function ()
        {
            var calc = createCalculatorInstance();

            expect(function () { calc.evaluate('bin(2+3i)'); }).toThrowError(TypeError);          // Complex
            expect(function () { calc.evaluate('bin("test")'); }).toThrowError(Error);            // String
            expect(function () { calc.evaluate('bin(2 ft)'); }).toThrowError(TypeError);          // Unit
            expect(function () { calc.evaluate('bin(sin)'); }).toThrowError(TypeError);           // Function
            expect(function () { calc.evaluate('bin(fraction(1,3))'); }).toThrowError(TypeError); // Fraction
        });
    });
});
