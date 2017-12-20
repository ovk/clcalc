describe ('Base64 extension', function ()
{
    beforeEach(function() { jasmine.addCustomEqualityTester(texIgnoringResultEqualityTester); });

    var samples = [
        [ '[]', '""' ],
        [ '[0]', '"AA=="' ],
        [ '[0, 0]', '"AAA="' ],
        [ '[0, 0, 0]', '"AAAA"' ],
        [ '[105]', '"aQ=="' ],
        [ '[105, 183]', '"abc="' ],
        [ '[105, 183, 29]', '"abcd"' ],
        [ '[1, 0]', '"AQA="' ],
        [ '[1, 2, 0]', '"AQIA"' ],
        [ '[1, 2, 3]', '"AQID"' ],
        [ '[252, 15, 192]', '"/A/A"' ],
        [ '[102]', '"Zg=="' ],
        [ '[102, 111]', '"Zm8="' ],
        [ '[102, 111, 111]', '"Zm9v"' ],
        [ '[102, 111, 111, 98]', '"Zm9vYg=="' ],
        [ '[102, 111, 111, 98, 97]', '"Zm9vYmE="' ],
        [ '[102, 111, 111, 98, 97, 114]', '"Zm9vYmFy"' ],
        [ '[72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]', '"SGVsbG8gV29ybGQ="' ],
        [ '[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, ' +
            '33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, ' +
            '65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, ' +
            '97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, ' +
            '123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, ' +
            '149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, ' +
            '175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, ' +
            '201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, ' +
            '227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, ' +
            '253, 254, 255]',
        '"AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9' +
        'QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6C' +
        'hoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy' +
        '8/T19vf4+fr7/P3+/w=="']
    ];

    it ('Should encode to base64 correctly', function ()
    {
        var calc = createCalculatorInstance();

        for (var i = 0; i < samples.length; ++i)
            expect(calc.evaluate('base64Encode(' + samples[i][0] + ')').result).toEqual(createResult(samples[i][1]));

        expect(function () { calc.evaluate('base64Encode([-1])'); }).toThrowError(Error);
        expect(function () { calc.evaluate('base64Encode([true])'); }).toThrowError(Error);
        expect(function () { calc.evaluate('base64Encode([sin])'); }).toThrowError(Error);
        expect(function () { calc.evaluate('base64Encode([256])'); }).toThrowError(Error);
    });

    it ('Should decode base64 correctly', function ()
    {
        var calc = createCalculatorInstance();

        for (var i = 0; i < samples.length; ++i)
            expect(calc.evaluate('base64Decode(' + samples[i][1] + ')').result).toEqual(createResult(samples[i][0]));

        expect(calc.evaluate('base64Decode("Zg")').result).toEqual(createResult('[102]'));
        expect(calc.evaluate('base64Decode("Zm8")').result).toEqual(createResult('[102, 111]'));
        expect(calc.evaluate('base64Decode("Zm9vYg")').result).toEqual(createResult('[102, 111, 111, 98]'));
        expect(calc.evaluate('base64Decode("Zm9vYmE")').result).toEqual(createResult('[102, 111, 111, 98, 97]'));

        expect(function () { calc.evaluate('base64Decode(" ")'); }).toThrowError(Error);
        expect(function () { calc.evaluate('base64Decode("+")'); }).toThrowError(Error);
        expect(function () { calc.evaluate('base64Decode("A")'); }).toThrowError(Error);
        expect(function () { calc.evaluate('base64Decode("AA=")'); }).toThrowError(Error);
        expect(function () { calc.evaluate('base64Decode("AA=A")'); }).toThrowError(Error);
    });
});
