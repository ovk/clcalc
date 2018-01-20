describe ('Util', function ()
{
    it ('Should round to one decimal place correctly', function ()
    {
        expect(clc.round1Dec(0)).toEqual(0);
        expect(clc.round1Dec(1)).toEqual(1);
        expect(clc.round1Dec(1.24)).toEqual(1.2);
        expect(clc.round1Dec(1.25)).toEqual(1.3);
        expect(clc.round1Dec(-1.24)).toEqual(-1.2);
        expect(clc.round1Dec(-1.25)).toEqual(-1.3);
    });

    it ('Should truncate number correctly', function ()
    {
        expect(clc.truncateNumber(0)).toEqual(0);
        expect(clc.truncateNumber(1)).toEqual(1);
        expect(clc.truncateNumber(2.1)).toEqual(2);
        expect(clc.truncateNumber(2.9)).toEqual(2);
        expect(clc.truncateNumber(-3.9)).toEqual(-3);
    });

    it ('Should drop trailing zeroes correctly', function ()
    {
        expect(clc.dropTrailingZeroes('0')).toEqual('0');
        expect(clc.dropTrailingZeroes('-0')).toEqual('-0');
        expect(clc.dropTrailingZeroes('123')).toEqual('123');
        expect(clc.dropTrailingZeroes('123.')).toEqual('123');
        expect(clc.dropTrailingZeroes('123.0')).toEqual('123');
        expect(clc.dropTrailingZeroes('.1')).toEqual('.1');
        expect(clc.dropTrailingZeroes('.10')).toEqual('.1');
        expect(clc.dropTrailingZeroes('123.00012300000')).toEqual('123.000123');
    });

    it ('Should add thousands separator correctly', function ()
    {
        var testVectors = {
            '1':           '1',
            '12':          '12',
            '123':         '123',
            '1234':        '1|234',
            '12345':       '12|345',
            '123456':      '123|456',
            '1234567':     '1|234|567',
            '12345678':    '12|345|678',
            '123456789':   '123|456|789',
            '1234567891':  '1|234|567|891',
            '12345678912': '12|345|678|912',
            '0.1':           '0.1',
            '0.12':          '0.12',
            '0.123':         '0.123',
            '0.1234':        '0.123|4',
            '0.12345':       '0.123|45',
            '0.123456':      '0.123|456',
            '0.1234567':     '0.123|456|7',
            '0.12345678':    '0.123|456|78',
            '0.123456789':   '0.123|456|789',
            '0.1234567891':  '0.123|456|789|1',
            '0.12345678912': '0.123|456|789|12',
            '1234567.1234567': '1|234|567.123|456|7'
        };

        expect(clc.addThousandsSeparator('0', '|')).toEqual('0');
        expect(clc.addThousandsSeparator('-0', '|')).toEqual('-0');

        for (var n in testVectors)
        {
            expect(clc.addThousandsSeparator(n, '|')).toEqual(testVectors[n]);
            expect(clc.addThousandsSeparator('-' + n, '|')).toEqual('-' + testVectors[n]);
        }
    });
});
