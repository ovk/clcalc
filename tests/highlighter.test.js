describe('Syntax Highlighter', function ()
{
    it ('Should highlight constants, functions and colors', function ()
    {
        var h = new clc.SyntaxHighlighter();

        expect(h.highlight('nothing_to highlight 0xadd 0b11 0Xadd 0B11   123 12.123 -123.123 []'))
            .toEqual('nothing_to highlight 0xadd 0b11 0Xadd 0B11   123 12.123 -123.123 []');
        expect(h.highlight('e')).toEqual('[[;;;highlight-constant;]e]');
        expect(h.highlight('tau+2pi-LOG10E'))
            .toEqual('[[;;;highlight-constant;]tau]+2[[;;;highlight-constant;]pi]-[[;;;highlight-constant;]LOG10E]');
        expect(h.highlight('e_pi^e-pi'))
            .toEqual('e_pi^[[;;;highlight-constant;]e]-[[;;;highlight-constant;]pi]');
        expect(h.highlight('add'))
            .toEqual('[[;;;highlight-keyword;]add]');
        expect(h.highlight('2sin(pi)*3cos(10)'))
            .toEqual('2[[;;;highlight-keyword;]sin]([[;;;highlight-constant;]pi])*3[[;;;highlight-keyword;]cos](10)');
        expect(h.highlight('#ffeef+#abcdef-#12abcdef'))
            .toEqual('#ffeef+[[;;;highlight-color;]#abcdef]-[[;;;highlight-color;]#12abcdef]');
    });

});
