var settings =
{
    'precision': 64,
    'thousandsSeparatorEnabled': false
};

var testHelpMessage = 'Test help';

function createCalculatorInstance(extensions)
{
    var calc = new clc.Calculator(math, settings, testHelpMessage),
        ext = extensions || {};

    calc.installExtension(new clc.HexBinLiteralsExtension());
    calc.installExtension(new clc.UnicodeEncodingExtension());
    calc.installExtension(new clc.Base64EncodingExtension());
    calc.installExtension(new clc.HashesExtension());
    calc.installExtension(ext.color || new clc.ColorExtension());
    calc.installExtension(new clc.LerpExtension());
    calc.installExtension(new clc.PlotExtension());

    return calc;
}

function createResult(raw, postprocessed)
{
    return { 'raw': raw, 'postprocessed': (postprocessed || raw) };
}

function texIgnoringResultEqualityTester(a, b)
{
    if (typeof a === 'object' && typeof b === 'object' && a && b && typeof a.tex !== 'undefined' && typeof b.tex === 'undefined')
        return a.raw === b.raw && a.postprocessed === b.postprocessed;
}

function createEvaluatedExpression(tex, raw, postprocessed)
{
    var ee = new clc.EvaluatedExpression();

    ee.tex = tex;
    ee.result.raw = raw;
    ee.result.postprocessed = postprocessed || raw;

    return ee;
}

function repeatString(string, times)
{
    var result = '';
    for (var i = 0; i < times; ++i)
        result += string;
    return result;
}
