(function (clc)
{
    /**
     * Maximum length of bytes array for hash calculation.
     * @type {Number}
     */
    var MAX_DATA_LENGTH = 0xFFFFFF;

    /**
     * Bitwise rotate left for Uint32.
     * @param  {Number} n
     * @param  {Number} bits
     * @return {Number}
     */
    function rol(n, bits)
    {
        return ((n << bits) | (n >>> (32 - bits))) >>> 0;
    }

    /**
     * Bitwise rotate right for Uint32.
     * @param  {Number} n
     * @param  {Number} bits
     * @return {Number}
     */
    function ror(n, bits)
    {
        return ((n >>> bits) | (n << (32 - bits))) >>> 0;
    }

    /**
     * Change endianness of Uint32. I.e. big-endian becomes little-endian and vice versa.
     * @param  {Number} n
     * @return {Number}
     */
    function changeEndianness(n)
    {
        return (((n & 0xFF000000) >>> 24) |
                ((n & 0x00FF0000) >>>  8) |
                ((n & 0x0000FF00) <<   8) |
                ((n & 0x000000FF) <<  24)) >>> 0;
    }

    /**
     * Get Uint32 (little-endian) by index, from array of bytes, starting at byte offset blockOffset.
     * @param  {Array} array
     * @param  {Number} blockOffset
     * @param  {Number} index
     * @return {Number}
     */
    function getUint32LE(array, blockOffset, index)
    {
        return (clc.toUint8(array[blockOffset + index * 4 + 3]) << 24 |
                clc.toUint8(array[blockOffset + index * 4 + 2]) << 16 |
                clc.toUint8(array[blockOffset + index * 4 + 1]) << 8 |
                clc.toUint8(array[blockOffset + index * 4 ])) >>> 0;
    }

    /**
     * Same as getUint32LE but in big-endian.
     * @param  {Array} array
     * @param  {Number} blockOffset
     * @param  {Number} index
     * @return {Number}
     */
    function getUint32BE(array, blockOffset, index)
    {
        return changeEndianness(getUint32LE(array, blockOffset, index));
    }

    /**
     * Get closest multiple of given number, that is greater then or equal n.
     * Example: nextMultipleOf(100, 64) = 128.
     * @param  {Number} n
     * @param  {Number} multiple
     * @return {Number}
     */
    function nextMultipleOf(n, multiple)
    {
        return (n === 0) ? multiple : (((n - 1) | 63) + 1);
    }

    /**
     * Copy byte array while checking each byte and possibly converting from BigNumber.
     * @param  {Array} array
     * @return {Array}
     */
    function copyByteArray(array)
    {
        var result = [], i;

        for (i = 0; i < array.length; ++i)
            result.push(clc.toUint8(array[i]));

        return result;
    }

    /**
     * Append given value "count" times to the end of array.
     * @param  {Array} array
     * @param  {Number} value
     * @param  {Number} count
     */
    function appendToArray(array, value, count)
    {
        for (var i = 0; i < count; ++i)
            array.push(value);
    }

    /**
     * Append byte representation of Uint64 to the end of array.
     * @param  {Array}   array
     * @param  {Number}  hi
     * @param  {Number}  low
     * @param  {Boolean} isLittleEndian
     */
    function appendUint64ToArray(array, hi, low, isLittleEndian)
    {
        if (!isLittleEndian)
        {
            var temp = hi;
            hi = changeEndianness(low);
            low = changeEndianness(temp);
        }

        for (var i = 0; i < 8; ++i)
        {
            if (i < 4)
                array.push((low >>> (i * 8)) & 0xFF);
            else
                array.push((hi >>> ((i - 4) * 8)) & 0xFF);
        }
    }

    // MD5
    (function ()
    {
        // Per-round shift amounts.
        var SHIFT_AMOUNT = [
            7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
            5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
            4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
            6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21 ];

        // Precomputed sin constants.
        var K = [
            0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
            0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
            0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
            0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
            0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
            0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
            0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
            0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
            0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
            0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
            0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
            0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
            0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
            0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
            0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
            0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391 ];

        /**
         * Calculate MD5 hash of byte array.
         * @param  {Array} array
         * @return {String}
         */
        clc.md5 = function (array)
        {
            if (array.length > MAX_DATA_LENGTH)
                throw new Error('Array is too big. Maximum allowed size: ' + MAX_DATA_LENGTH);

            var bytes = copyByteArray(array),
                originalLengthInBytes = array.length;

            // Add padding
            bytes.push(0x80);
            appendToArray(bytes, 0 | 0, nextMultipleOf(originalLengthInBytes + 9) - originalLengthInBytes - 9);
            appendUint64ToArray(bytes, 0, originalLengthInBytes * 8, true);

            // Initial hash values
            var h0 = 0x67452301 >>> 0,
                h1 = 0xefcdab89 >>> 0,
                h2 = 0x98badcfe >>> 0,
                h3 = 0x10325476 >>> 0;

            // For each 512 bit chunk
            for (var c = 0; c < bytes.length; c += 64)
            {
                var A = h0, B = h1, C = h2, D = h3;

                // Main loop
                for (var i = 0; i < 64; ++i)
                {
                    var F, g;

                    if (i < 16)
                    {
                        F = (B & C) | ((~B) & D);
                        g = i;
                    }
                    else if (i < 32)
                    {
                        F = (D & B) | ((~D) & C);
                        g = (5 * i + 1) % 16;
                    }
                    else if (i < 48)
                    {
                        F = B ^ C ^ D;
                        g = (3 * i + 5) % 16;
                    }
                    else
                    {
                        F = C ^ (B | (~D));
                        g = (7 * i) % 16;
                    }

                    F = (F + A + K[i] + getUint32LE(bytes, c, g)) >>> 0;
                    A = D;
                    D = C;
                    C = B;
                    B = (B + rol(F, SHIFT_AMOUNT[i])) >>> 0;
                }

                // Update hash
                h0 = (h0 + A) >>> 0;
                h1 = (h1 + B) >>> 0;
                h2 = (h2 + C) >>> 0;
                h3 = (h3 + D) >>> 0;
            }

            // Combine final hash value
            return clc.padLeft(changeEndianness(h0).toString(16), '0', 8) +
                   clc.padLeft(changeEndianness(h1).toString(16), '0', 8) +
                   clc.padLeft(changeEndianness(h2).toString(16), '0', 8) +
                   clc.padLeft(changeEndianness(h3).toString(16), '0', 8);
        };
    }());

    // SHA1
    (function ()
    {
        /**
         * Calculate SHA1 hash of byte array.
         * @param  {Array} array
         * @return {String}
         */
        clc.sha1 = function (array)
        {
            if (array.length > MAX_DATA_LENGTH)
                throw new Error('Array is too big. Maximum allowed size: ' + MAX_DATA_LENGTH);

            var bytes = copyByteArray(array),
                originalLengthInBytes = array.length;

            // Add padding
            bytes.push(0x80);
            appendToArray(bytes, 0 | 0, nextMultipleOf(originalLengthInBytes + 9) - originalLengthInBytes - 9);
            appendUint64ToArray(bytes, 0, originalLengthInBytes * 8, false);

            // Initial hash values
            var h0 = 0x67452301 >>> 0,
                h1 = 0xEFCDAB89 >>> 0,
                h2 = 0x98BADCFE >>> 0,
                h3 = 0x10325476 >>> 0,
                h4 = 0xC3D2E1F0 >>> 0;

            // For each 512 bit chunk
            for (var c = 0; c < bytes.length; c += 64)
            {
                var A = h0, B = h1, C = h2, D = h3, E = h4, w = [], i;

                // Prepare 80 Uint32 array
                for (i = 0; i < 80; ++i)
                {
                    if (i < 16)
                        w.push(getUint32BE(bytes, c, i));
                    else
                        w.push(rol(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1));
                }

                // Main loop
                for (i = 0; i < 80; ++i)
                {
                    var F, k;

                    if (i < 20)
                    {
                        F = (B & C) | ((~B) & D);
                        k = 0x5A827999 >>> 0;
                    }
                    else if (i < 40)
                    {
                        F = B ^ C ^ D;
                        k = 0x6ED9EBA1 >>> 0;
                    }
                    else if (i < 60)
                    {
                        F = (B & C) | (B & D) | (C & D);
                        k = 0x8F1BBCDC >>> 0;
                    }
                    else
                    {
                        F = B ^ C ^ D;
                        k = 0xCA62C1D6 >>> 0;
                    }

                    var temp = (rol(A, 5) + F + E + k + w[i]) >>> 0;
                    E = D;
                    D = C;
                    C = rol(B, 30);
                    B = A;
                    A = temp;
                }

                h0 = (h0 + A) >>> 0;
                h1 = (h1 + B) >>> 0;
                h2 = (h2 + C) >>> 0;
                h3 = (h3 + D) >>> 0;
                h4 = (h4 + E) >>> 0;
            }

            // Combine final hash value
            return clc.padLeft(h0.toString(16), '0', 8) +
                   clc.padLeft(h1.toString(16), '0', 8) +
                   clc.padLeft(h2.toString(16), '0', 8) +
                   clc.padLeft(h3.toString(16), '0', 8) +
                   clc.padLeft(h4.toString(16), '0', 8);
        };
    }());

    // SHA2
    (function ()
    {
        // Round constants
        var K_SHA256_SHA224 = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

        function sha_256_224(array, K, h0, h1, h2, h3, h4, h5, h6, h7)
        {
            if (array.length > MAX_DATA_LENGTH)
                throw new Error('Array is too big. Maximum allowed size: ' + MAX_DATA_LENGTH);

            var bytes = copyByteArray(array),
                originalLengthInBytes = array.length;

            // Add padding
            bytes.push(0x80);
            appendToArray(bytes, 0 | 0, nextMultipleOf(originalLengthInBytes + 9) - originalLengthInBytes - 9);
            appendUint64ToArray(bytes, 0, originalLengthInBytes * 8, false);

            // For each 512 bit chunk
            for (var c = 0; c < bytes.length; c += 64)
            {
                var A = h0, B = h1, C = h2, D = h3, E = h4, F = h5, G = h6, H = h7, w = [], i;

                // Prepare 64 Uint32 array
                for (i = 0; i < 64; ++i)
                {
                    if (i < 16)
                        w.push(getUint32BE(bytes, c, i));
                    else
                    {
                        var s0 = ror(w[i - 15], 7) ^ ror(w[i - 15], 18) ^ (w[i - 15] >>> 3),
                            s1 = ror(w[i - 2], 17) ^ ror(w[i - 2],  19) ^ (w[i - 2] >>> 10);
                        w.push((w[i - 16] + s0 + w[i - 7] + s1) >>> 0);
                    }
                }

                // Main loop
                for (i = 0; i < 64; ++i)
                {
                    var S1 = ror(E, 6) ^ ror(E, 11) ^ ror(E, 25),
                        S0 = ror(A, 2) ^ ror(A, 13) ^ ror(A, 22),
                        ch = (E & F) ^ ((~E) & G),
                        maj = (A & B) ^ (A & C) ^ (B & C),
                        temp1 = (H + S1 + ch + K[i] + w[i]) >>> 0,
                        temp2 = (S0 + maj) >>> 0;

                    H = G;
                    G = F;
                    F = E;
                    E = (D + temp1) >>> 0;
                    D = C;
                    C = B;
                    B = A;
                    A = (temp1 + temp2) >>> 0;
                }

                h0 = (h0 + A) >>> 0;
                h1 = (h1 + B) >>> 0;
                h2 = (h2 + C) >>> 0;
                h3 = (h3 + D) >>> 0;
                h4 = (h4 + E) >>> 0;
                h5 = (h5 + F) >>> 0;
                h6 = (h6 + G) >>> 0;
                h7 = (h7 + H) >>> 0;
            }

            return [ h0, h1, h2, h3, h4, h5, h6, h7 ];
        }

        /**
         * Calculate SHA224 hash of byte array.
         * @param  {Array} array
         * @return {String}
         */
        clc.sha224 = function (array)
        {
            var h = sha_256_224(array, K_SHA256_SHA224, 0xc1059ed8 >>> 0, 0x367cd507 >>> 0, 0x3070dd17 >>> 0, 0xf70e5939 >>> 0,
                0xffc00b31 >>> 0, 0x68581511 >>> 0, 0x64f98fa7 >>> 0, 0xbefa4fa4 >>> 0);

            return clc.padLeft(h[0].toString(16), '0', 8) +
                   clc.padLeft(h[1].toString(16), '0', 8) +
                   clc.padLeft(h[2].toString(16), '0', 8) +
                   clc.padLeft(h[3].toString(16), '0', 8) +
                   clc.padLeft(h[4].toString(16), '0', 8) +
                   clc.padLeft(h[5].toString(16), '0', 8) +
                   clc.padLeft(h[6].toString(16), '0', 8);
        };

        /**
         * Calculate SHA256 hash of byte array.
         * @param  {Array} array
         * @return {String}
         */
        clc.sha256 = function (array)
        {
            var h = sha_256_224(array, K_SHA256_SHA224, 0x6a09e667 >>> 0, 0xbb67ae85 >>> 0, 0x3c6ef372 >>> 0,
                0xa54ff53a >>> 0, 0x510e527f >>> 0, 0x9b05688c >>> 0, 0x1f83d9ab >>> 0, 0x5be0cd19 >>> 0);

            return clc.padLeft(h[0].toString(16), '0', 8) +
                   clc.padLeft(h[1].toString(16), '0', 8) +
                   clc.padLeft(h[2].toString(16), '0', 8) +
                   clc.padLeft(h[3].toString(16), '0', 8) +
                   clc.padLeft(h[4].toString(16), '0', 8) +
                   clc.padLeft(h[5].toString(16), '0', 8) +
                   clc.padLeft(h[6].toString(16), '0', 8) +
                   clc.padLeft(h[7].toString(16), '0', 8);
        };
    }());
}(window.clc = window.clc || {}));
