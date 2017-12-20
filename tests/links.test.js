describe('Links', function ()
{
    it ('Should serialize/deserialize expressions into links correctly', function ()
    {
        var linksHandler = new clc.LinksHandler(),
            test = [ [], [ '', ' ', '   ', '   \t' ], ['1', '2+3', '!@#$%^&*()_+'] ];

        expect(linksHandler.getExpressionsListFromUrl()).toBeNull();

        for (var i in test)
        {
            var serialized = linksHandler._serializeExpressionsList(test[i]);
            expect(serialized.length).toBeGreaterThan(0);
            expect(linksHandler._deserializeExpressionsList(serialized)).toEqual(test[i]);
        }
    });
});
