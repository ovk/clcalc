(function (clc)
{
    /**
     * Check if the given string entirely consists of the following characters:
     * - space/tab/non-breakable space/CR/LF
     * @param  {String} string
     * @return {Boolean}
     */
    clc.isStringBlank = function (string)
    {
        if (!string || !string.length)
            return true;

        for (var i = 0; i < string.length; ++i)
        {
            if (string[i] !== ' '  &&
                string[i] !== '\t' &&
                string[i] !== '\r' &&
                string[i] !== '\n' &&
                string.charCodeAt(i) !== 160)
                return false;
        }

        return true;
    };

    /**
     * Repeat given string n times.
     * @param  {String} string
     * @param  {Number} n
     * @return {String}
     */
    clc.repeatString = function (string, n)
    {
        var result = '';

        for (var i = 0; i < n; ++i)
            result += string;

        return result;
    };

    /**
     * Pad string with character from left to given length.
     * @param  {String} string
     * @param  {String} character
     * @param  {Number} length
     * @return {String}
     */
    clc.padLeft = function (string, character, length)
    {
        if (string.length >= length || character.length !== 1)
            return string;

        return clc.repeatString(character, length - string.length) + string;
    };

    /**
     * Get list of Unicode code points of a given string.
     * @param  {String} string
     * @return {Array}
     */
    clc.stringToUnicodeCodePointList = function (string)
    {
        var result = [];

        for (var i = 0; i < string.length; ++i)
        {
            var current = string.charCodeAt(i);

            // High surrogate
            if (current >= 0xD800 && current <= 0xDBFF && (i + 1) < string.length)
            {
                var next = string.charCodeAt(i + 1);

                // Low surrogate
                if (next >= 0xDC00 && next <= 0xDFFF)
                {
                    current = (current - 0xD800) * 0x400 + next - 0xDC00 + 0x10000;
                    ++i;
                }
            }

            result.push(current);
        }

        return result;
    };

    /**
     * Create a string from given Unicode code points array.
     * @param  {Array} array
     * @return {String}
     */
    clc.stringFromUnicodeCodePointList = function (array)
    {
        var result = '';

        for (var i = 0; i < array.length; ++i)
        {
            var code = clc.toUint32(array[i]);
            if (code > 0x10FFFF)
                throw new Error('Invalid code point value: ' + code + '. Must be less then or equal to 0x10FFFF.');

            // Has to be split into surrogate pair
            if (code > 0xFFFF)
            {
                var high = Math.floor((code - 0x10000) / 0x400) + 0xD800,
                    low  = (code - 0x10000) % 0x400 + 0xDC00;

                result += String.fromCharCode(high, low);
            }
            else
                result += String.fromCharCode(code);
        }

        return result;
    };

    /**
     * Encode string as UTF8 byte array.
     * @param  {String} string
     * @return {Array}
     */
    clc.stringToUtf8Array = function (string)
    {
        var result = [];

        string = unescape(encodeURIComponent(string));
        for (var i = 0; i < string.length; ++i)
            result.push(string.charCodeAt(i));

        return result;
    };

    /**
     * Create a string from given utf8 byte array.
     * @param  {Array} array
     * @return {String}
     */
    clc.stringFromUtf8Array = function (array)
    {
        var result = [];

        for (var i = 0; i < array.length;)
        {
            var byte = clc.toUint8(array[i]), code, byte1, byte2, byte3;

            // 0xxxxxxx
            if ((byte & 0x80) === 0)
            {
                code = byte & 0x7f;
                i += 1;
            }
            // 110xxxxx 10xxxxxx
            else if ((byte >>> 5) === 6)
            {
                if ((i + 1) >= array.length)
                    throw new Error('Failed to decode utf8 string: excepceted 1 byte after ' + byte);
                byte1 = clc.toUint8(array[i + 1]);
                code = ((byte & 0x1f) << 6) | (byte1 & 0x3f);
                i += 2;
            }
            // 1110xxxx 10xxxxxx 10xxxxxx
            else if ((byte >>> 4) === 14)
            {
                if ((i + 2) >= array.length)
                    throw new Error('Failed to decode utf8 string: excepceted 2 bytes after ' + byte);
                byte1 = clc.toUint8(array[i + 1]);
                byte2 = clc.toUint8(array[i + 2]);
                code = ((byte & 0xf) << 12) | ((byte1 & 0x3f) << 6) | (byte2 & 0x3f);
                i += 3;
            }
            // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
            else if ((byte >>> 3) === 30)
            {
                if ((i + 3) >= array.length)
                    throw new Error('Failed to decode utf8 string: excepceted 3 bytes after ' + byte);
                byte1 = clc.toUint8(array[i + 1]);
                byte2 = clc.toUint8(array[i + 2]);
                byte3 = clc.toUint8(array[i + 3]);
                code = ((byte & 7) << 18) | ((byte1 & 0x3f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f);
                i += 4;
            }
            else
            {
                throw new Error('Failed to decode utf8 string: unexpected byte ' + byte + ' at position ' + i);
            }

            result.push(code);
        }

        return clc.stringFromUnicodeCodePointList(result);
    };

    /**
     * Digits used in base64 encoding.
     * @type {String}
     */
    var BASE64_DIGITS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    /**
     * Encode byte array to string using Base64 encoding.
     * @param  {Array} array
     * @return {String}
     */
    clc.base64Encode = function (array)
    {
        if (array.length === 0)
            return '';

        var result = '', i, padding = (array.length % 3);

        if (padding)
        {
            padding = 3 - padding;
            for (i = 0; i < padding; ++i)
                array.push(0);
        }

        for (i = 0; i < array.length; i += 3)
        {
            var byte1 = clc.toUint8(array[i]),
                byte2 = clc.toUint8(array[i + 1]),
                byte3 = clc.toUint8(array[i + 2]);

            result += BASE64_DIGITS[byte1 >>> 2];
            result += BASE64_DIGITS[((byte1 & 3) << 4) | (byte2 >>> 4)];
            result += (i === array.length - 3 && padding === 2) ? '=' : BASE64_DIGITS[((byte2 & 15) << 2) | (byte3 >>> 6)];
            result += (i === array.length - 3 && padding) ? '=' : BASE64_DIGITS[byte3 & 63];
        }

        return result;
    };

    /**
     * Decode base64 encoded string into byte array.
     * @param  {String} string
     * @return {Array}
     */
    clc.base64Decode = function (string)
    {
        if (string.length === 0)
            return [];

        var result = [];

        for (var i = 0; i < string.length; i += 4)
        {
            // First 6 bits
            var e1 = BASE64_DIGITS.indexOf(string[i]);
            if (e1 === -1)
                throw new Error('Invalid character at index ' + i);

            // Second 6 bits
            if (i + 1 >= string.length)
                throw new Error('The string is not correctly base64 encoded: next character expected.');

            var e2 = BASE64_DIGITS.indexOf(string[i + 1]);
            if (e2 === -1)
                throw new Error('Invalid character at index ' + i);

            // Third 6 bits
            var e3 = (i + 2 < string.length) ? (string[i + 2] === '=' ? 0 : BASE64_DIGITS.indexOf(string[i + 2])) : 0;
            if (e3 === -1)
                throw new Error('Invalid character at index ' + i);

            // Fourth 6 bits
            var e4 = (i + 3 < string.length) ? (string[i + 3] === '=' ? 0 : BASE64_DIGITS.indexOf(string[i + 3])) : 0;
            if (e4 === -1)
                throw new Error('Invalid character at index ' + i);

            // Check padding
            if (((i + 2 < string.length) && string[i + 2] === '=') && ((i + 3 >= string.length) || string[i + 3] !== '='))
                throw new Error('The string is not correctly base64 encoded: improper padding.');

            result.push((e1 << 2) | (e2 >>> 4));

            if ((i + 2) < string.length && string[i + 2] !== '=')
            {
                result.push(((e2 & 15) << 4) | (e3 >>> 2));
                if ((i + 3) < string.length && string[i + 3] !== '=')
                    result.push(((e3 & 3) << 6) | e4);
            }
        }

        return result;
    };

    /**
     * Generate pseudo-random alphanumeric string of given length.
     * @param  {Number} length
     * @return {String}
     */
    clc.randomAlnumString = function (length)
    {
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', result = '';

        for (var i = 0; i < length; ++i)
            result += characters[Math.floor(Math.random() * characters.length)];

        return result;
    };

    /**
     * Generate pseudo-random DOM element ID.
     * The ID is generated as 'prefix' + alphanumeric string of length 10.
     * @param  {String} prefix
     * @return {String}
     */
    clc.randomId = function (prefix)
    {
        return prefix + clc.randomAlnumString(10);
    };

    /**
     * Round number to 1 decimal place. 0.5 is rounded away from zero.
     * Example: 2.7513 will be rounded to 2.8.
     * @param  {Number} number
     * @return {Number}
     */
    clc.round1Dec = function (number)
    {
        return Math.sign(number) * Math.round(Math.abs(number) * 10) / 10;
    };

    /**
     * Truncate number to the integer.
     * Example: 2.9999 will be truncated to 2, -2.9999 will be truncated to -2.
     * @param  {[type]} number [description]
     * @return {[type]}        [description]
     */
    clc.truncateNumber = function (number)
    {
        return number | 0;
    };

    /**
     * Clamp number n in range [min, max]
     * @param  {Number} n
     * @param  {Number} min
     * @param  {Number} max
     * @return {Number}
     */
    clc.clamp = function (n, min, max)
    {
        return n < min ? min : (n > max ? max : n);
    };

    /**
     * Calculate modulo of number.
     * @param  {Number} number
     * @param  {Number} mod
     * @return {Number}
     */
    clc.mod = function (number, mod)
    {
        return ((number % mod) + mod) % mod;
    };

    /**
     * Convert number to unsigned 32 bit integer.
     * This function throws exception if number of incorrect type, negative or can't fit in 4 bytes.
     * @param  {Number|BigInteger} number
     * @return {Number}
     */
    clc.toUint32 = function (number)
    {
        if (typeof number !== 'number' && !number.toNumber)
            throw new Error('Must be a numeric type: ' + number);

        var n = number.toNumber ? number.toNumber() : number;
        if (n < 0)
            throw new Error('Number must be non-negative: ' + n);
        else if (n > 0xFFFFFFFF)
            throw new Error('Number must fit in 4 byte unsigned integer: ' + n);

        return n >>> 0;
    };

    /**
     * Convert number to unsigned 8 bit integer.
     * This function throws exception if number of incorrect type, negative or can't fit in 1 byte.
     * @param  {Number|BigInteger} number
     * @return {Number}
     */
    clc.toUint8 = function (number)
    {
        var n = clc.toUint32(number);
        if (number > 0xFF)
            throw new Error('Number exceeds byte range: ' + n);
        return n;
    };

    /**
     * Drop insignificant trailing zeroes from string representation of decimal number.
     * Example: 1.02000 -> 1.02
     * @param  {String} number
     * @return {String}
     */
    clc.dropTrailingZeroes = function (number)
    {
        var dotIndex = number.indexOf('.');

        if (dotIndex !== -1)
        {
            var lastNonZeroIndex = number.length - 1;

            while (lastNonZeroIndex > dotIndex && number[lastNonZeroIndex] === '0')
                --lastNonZeroIndex;

            if (dotIndex === lastNonZeroIndex)
                return number.substring(0, dotIndex);
            else  if (lastNonZeroIndex < (number.length - 1))
                return number.substring(0, lastNonZeroIndex + 1);
        }

        return number;
    };

    /**
     * Add thousands separator to a given number.
     * @param  {String} number
     * @param  {String} separator
     * @return {String}
     */
    clc.addThousandsSeparator = function (number, separator)
    {
        if (!number.length || !separator.length)
            return number;

        var begin = (number[0] === '-' ? 1 : 0),
            dotIndex = number.indexOf('.'),
            intDigits = (dotIndex === -1 ? number.length : dotIndex) - begin,
            i, result = '';

        if (begin !== 0)
            result += number[0];

        for (i = begin; i < (intDigits + begin); ++i)
        {
            if (((intDigits - i + begin) % 3) === 0 && i !== begin)
                result += separator;

            result += number[i];
        }

        if (dotIndex !== -1)
        {
            result += '.';

            for (i = dotIndex + 1; i < number.length; ++i)
            {
                result += number[i];

                if (((i - dotIndex) % 3) === 0 && i !== (number.length - 1))
                    result += separator;
            }
        }

        return result;
    };

    /**
     * Test is given object is an array.
     * @param  {Object} object
     * @return {Boolean}
     */
    clc.isArray = function (object)
    {
        return Object.prototype.toString.call(object) === '[object Array]';
    };

    /**
     * Generate code for a HTML tag.
     * @param  {String} tag           Tag name.
     * @param  {Object} attributes    Object containing tag's attributes (optional).
     * @param  {String|Array} content Content to put inside tag (optional).
     * @return {String}
     */
    clc.htmlTag = function (tag, attributes, content)
    {
        var html = '<' + tag;

        if (attributes)
        {
            for (var key in attributes)
            {
                if (Object.prototype.hasOwnProperty.call(attributes, key))
                    html += ' ' + key + '="' + attributes[key] + '"';
            }
        }

        if (content && clc.isArray(content))
            content = content.join('');

        html += '>' + (content || '') + '</' + tag + '>';

        return html;
    };

    /**
     * Generate DOM element in a given namespace.
     * @param  {String} namespace            Namespace (i.e. http://www.w3.org/2000/svg).
     * @param  {String} tag                  Tag name.
     * @param  {Object} attributes           Object containing element's attributes (optional).
     * @param  {String|Array|Object} content Element content. String, other element or an array of elements. Optional.
     * @return {Object}
     */
    clc.domElement = function (namespace, tag, attributes, content)
    {
        var element = document.createElementNS(namespace, tag);

        if (attributes)
        {
            for (var key in attributes)
            {
                if (Object.prototype.hasOwnProperty.call(attributes, key))
                    element.setAttribute(key, attributes[key]);
            }
        }

        if (content)
        {
            if (clc.isArray(content))
            {
                for (var i = 0; i < content.length; ++i)
                    element.appendChild(content[i]);
            }
            else if (typeof content === 'string')
                element.innerHTML = content;
            else
                element.appendChild(content);
        }

        return element;
    };

    /**
     * Convert from numbers that can be returned by the MathJS library to Number.
     * This method insures that number is not a NaN and finite.
     * If number is an instance of BigNumber a precision loss may occur.
     * @param  {Number|BigNumber} number
     * @return {Number}
     */
    clc.mathJsToValidNumber = function (number)
    {
        if (typeof number === 'number' || number instanceof Number)
        {
            if (!isFinite(number)) // +/-Infinity or NaN
                throw new Error('Number is infinite or NaN');
            return number;
        }
        else if (number.toNumber)
        {
            if (!number.isFinite()) // +/-Infinity or NaN
                throw new Error('Number is infinite or NaN');
            else
                return number.toNumber();
        }
        else
            throw new Error('Not a recognized number type');
    };

    /**
     * Log string.
     * @param  {String} string
     */
    clc.log = function (string)
    {
        if (console && console.log)
            console.log(string);
    };
}(window.clc = window.clc || {}));
