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
});
