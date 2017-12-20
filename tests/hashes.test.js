describe ('Hash Functions', function ()
{
    beforeEach(function() { jasmine.addCustomEqualityTester(texIgnoringResultEqualityTester); });

    var testVectors = [
        '[]',
        '[48]',
        '[97]',
        '[97, 98, 99]',
        '[109, 101, 115, 115, 97, 103, 101, 32, 100, 105, 103, 101, 115, 116]',
        '[97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122]',
        '[65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, ' +
        '100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]',
        '[49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 49, ' +
        '50, 51, 52, 53, 54, 55, 56, 57, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 49, 50, ' +
        '51, 52, 53, 54, 55, 56, 57, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48]',
        '[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, ' +
        '29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, ' +
        '56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, ' +
        '83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, ' +
        '108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, ' +
        '130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, ' +
        '152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, ' +
        '174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, ' +
        '196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, ' +
        '218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, ' +
        '240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255]',
        '[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, ' +
        '29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54]',
        '[63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, ' +
        '30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]',
        '[97, 98, 99, 100, 98, 99, 100, 101, 99, 100, 101, 102, 100, 101, 102, 103, 101, 102, 103, 104, 102, 103, 104, 105, 103, 104, ' +
        '105, 106, 104, 105, 106, 107, 105, 106, 107, 108, 106, 107, 108, 109, 107, 108, 109, 110, 108, 109, 110, 111, 109, 110, 111, 112, 110, 111, 112, 113]',
        '[97, 98, 99, 100, 101, 102, 103, 104, 98, 99, 100, 101, 102, 103, 104, 105, 99, 100, 101, 102, 103, 104, 105, 106, 100, 101, 102, 103, 104, 105, 106, ' +
        '107, 101, 102, 103, 104, 105, 106, 107, 108, 102, 103, 104, 105, 106, 107, 108, 109, 103, 104, 105, 106, 107, 108, 109, 110, 104, 105, 106, 107, 108, ' +
        '109, 110, 111, 105, 106, 107, 108, 109, 110, 111, 112, 106, 107, 108, 109, 110, 111, 112, 113, 107, 108, 109, 110, 111, 112, 113, 114, 108, 109, 110, ' +
        '111, 112, 113, 114, 115, 109, 110, 111, 112, 113, 114, 115, 116, 110, 111, 112, 113, 114, 115, 116, 117]'
    ];

    describe ('MD5', function ()
    {
        var md5Hashes = [
            '"d41d8cd98f00b204e9800998ecf8427e"',
            '"cfcd208495d565ef66e7dff9f98764da"',
            '"0cc175b9c0f1b6a831c399e269772661"',
            '"900150983cd24fb0d6963f7d28e17f72"',
            '"f96b697d7cb7938d525a2f31aaf161d0"',
            '"c3fcd3d76192e4007dfb496cca67e13b"',
            '"d174ab98d277d9f5a5611c2c9f419d9f"',
            '"57edf4a22be3c955ac49da2e2107b67a"',
            '"e2c865db4162bed963bfaa9ef6ac18f0"',
            '"6912ee65fff2d9f9ce2508cddf8bcda0"',
            '"4411cc56f5a41c6e303c3c497155c2a9"',
            '"8215ef0796a20bcaaae116d3876c664a"',
            '"03dd8807a93175fb062dfb55dc7d359c"'];

        it ('Should compute MD5 correctly', function ()
        {
            expect(testVectors.length).toEqual(md5Hashes.length);

            var calc = createCalculatorInstance();

            for (var i = 0; i < md5Hashes.length; ++i)
                expect(calc.evaluate('md5(' + testVectors[i] + ')').result).toEqual(createResult(md5Hashes[i]));

            expect(function () { calc.evaluate('md5([-1])'); }).toThrowError(Error);
            expect(function () { calc.evaluate('md5([256])'); }).toThrowError(Error);
            expect(function () { calc.evaluate('md5([true])'); }).toThrowError(Error);
            expect(function () { calc.evaluate('md5(["a"])'); }).toThrowError(Error);
        });
    });

    describe ('SHA1', function ()
    {
        var sha1Hashes = [
            '"da39a3ee5e6b4b0d3255bfef95601890afd80709"',
            '"b6589fc6ab0dc82cf12099d1c2d40ab994e8410c"',
            '"86f7e437faa5a7fce15d1ddcb9eaeaea377667b8"',
            '"a9993e364706816aba3e25717850c26c9cd0d89d"',
            '"c12252ceda8be8994d5fa0290a47231c1d16aae3"',
            '"32d10c7b8cf96570ca04ce37f2a19d84240d3a89"',
            '"761c457bf73b14d27e9e9265c46f4b4dda11f940"',
            '"50abf5706a150990a08b2c5ea40fa0e585554732"',
            '"4916d6bdb7f78e6803698cab32d1586ea457dfc8"',
            '"8ae2d46729cfe68ff927af5eec9c7d1b66d65ac2"',
            '"2544dfa05445cfb96d7a551c26f9b2f698d57078"',
            '"84983e441c3bd26ebaae4aa1f95129e5e54670f1"',
            '"a49b2446a02c645bf419f995b67091253a04a259"'];

        it ('Should compute SHA1 correctly', function ()
        {
            expect(testVectors.length).toEqual(sha1Hashes.length);

            var calc = createCalculatorInstance();

            for (var i = 0; i < sha1Hashes.length; ++i)
                expect(calc.evaluate('sha1(' + testVectors[i] + ')').result).toEqual(createResult(sha1Hashes[i]));

            expect(function () { calc.evaluate('sha1([-1])'); }).toThrowError(Error);
            expect(function () { calc.evaluate('sha1([256])'); }).toThrowError(Error);
            expect(function () { calc.evaluate('sha1([true])'); }).toThrowError(Error);
            expect(function () { calc.evaluate('sha1(["a"])'); }).toThrowError(Error);
        });
    });

    describe ('SHA224', function ()
    {
        var sha224Hashes = [
            '"d14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f"',
            '"dfd5f9139a820075df69d7895015360b76d0360f3d4b77a845689614"',
            '"abd37534c7d9a2efb9465de931cd7055ffdb8879563ae98078d6d6d5"',
            '"23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7"',
            '"2cb21c83ae2f004de7e81c3c7019cbcb65b71ab656b22d6d0c39b8eb"',
            '"45a5f72c39c5cff2522eb3429799e49e5f44b356ef926bcf390dccc2"',
            '"bff72b4fcb7d75e5632900ac5f90d219e05e97a7bde72e740db393d9"',
            '"b50aecbe4e9bb0b57bc5f3ae760a8e01db24f203fb3cdcd13148046e"',
            '"88702e63237824c4eb0d0fcfe41469a462493e8beb2a75bbe5981734"',
            '"8991dfba74284e04dc7581c7c3e4068ff6cb7a63733361429834bb56"',
            '"21210f19cf53f0d4b182960ca814dcd6dbc1d0fd63b3ca7788bb5773"',
            '"75388b16512776cc5dba5da1fd890150b0c6455cb4f58b1952522525"',
            '"c97ca9a559850ce97a04a96def6d99a9e0e0e2ab14e6b8df265fc0b3"'];

        it ('Should compute SHA224 correctly', function ()
        {
            expect(testVectors.length).toEqual(sha224Hashes.length);

            var calc = createCalculatorInstance();

            for (var i = 0; i < sha224Hashes.length; ++i)
                expect(calc.evaluate('sha224(' + testVectors[i] + ')').result).toEqual(createResult(sha224Hashes[i]));

            expect(function () { calc.evaluate('sha224([-1])'); }).toThrowError(Error);
            expect(function () { calc.evaluate('sha224([256])'); }).toThrowError(Error);
            expect(function () { calc.evaluate('sha224([true])'); }).toThrowError(Error);
            expect(function () { calc.evaluate('sha224(["a"])'); }).toThrowError(Error);
        });
    });

    describe ('SHA256', function ()
    {
        var sha256Hashes = [
            '"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"',
            '"5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9"',
            '"ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb"',
            '"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"',
            '"f7846f55cf23e14eebeab5b4e1550cad5b509e3348fbc4efa3a1413d393cb650"',
            '"71c480df93d6ae2f1efad1447c66c9525e316218cf51fc8d9ed832f2daf18b73"',
            '"db4bfcbd4da0cd85a60c3c37d3fbd8805c77f15fc6b1fdfe614ee0a7c8fdb4c0"',
            '"f371bc4a311f2b009eef952dd83ca80e2b60026c8e935592d0f9c308453c813e"',
            '"40aff2e9d2d8922e47afd4648e6967497158785fbd1da870e7110266bf944880"',
            '"463eb28e72f82e0a96c0a4cc53690c571281131f672aa229e0d45ae59b598b59"',
            '"1afda31897528e6af55362d1dac3cc0049541cc1e3afe7af0cf1f74e5bdb998c"',
            '"248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1"',
            '"cf5b16a778af8380036ce59e7b0492370b249b11e8f07a51afac45037afee9d1"'];

        it ('Should compute SHA256 correctly', function ()
        {
            expect(testVectors.length).toEqual(sha256Hashes.length);

            var calc = createCalculatorInstance();

            for (var i = 0; i < sha256Hashes.length; ++i)
                expect(calc.evaluate('sha256(' + testVectors[i] + ')').result).toEqual(createResult(sha256Hashes[i]));

            expect(function () { calc.evaluate('sha256([-1])'); }).toThrowError(Error);
            expect(function () { calc.evaluate('sha256([256])'); }).toThrowError(Error);
            expect(function () { calc.evaluate('sha256([true])'); }).toThrowError(Error);
            expect(function () { calc.evaluate('sha256(["a"])'); }).toThrowError(Error);
        });
    });
});
