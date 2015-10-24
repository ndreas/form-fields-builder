var b = require('..');

describe("utils", function() {
    before(function() {
        b.utils.modelName = function(model) { return model._name; }
    });

    describe("extractOptions()", function() {
        var extractOptions = b.utils.extractOptions;

        it("removes the specified options from an object that is a mix of options and other keys into a separate object", function() {
            var o = { a:1, b:2, c:3 };
            expect(
                extractOptions(o, { a:2, b:3, d:4 })
            ).to.deep.equal({ a:1, b:2, d:4 });
            expect(o).to.deep.equal({ c:3 });
        });
        it("handles empty and invalid objects", function() {
            var d = {};
            expect(extractOptions({}, d)).to.deep.equal(d);
            expect(extractOptions(null, d)).to.deep.equal(d);
        });
        it("handles false and null values", function() {
            var o = { a:null, b:false, c:false };
            expect(
                extractOptions(o, { a:1, b:2, d:4 })
            ).to.deep.equal({ a:null, b:false, d:4 });
            expect(o).to.deep.equal({ c:false });
        });
    });

    describe("errorMessages", function() {
        var errorMessages = b.utils.errorMessages;

        it("returns an array of error messages from an an errors object for a specific field", function() {
            expect(
                errorMessages('field', { field: [ "error #1", "error #2" ] })
            ).to.deep.equal([ "error #1", "error #2" ]);
        });
        it("handles invalid errors", function() {
            expect(errorMessages('field')).not.to.be.ok;
        });
        it("returns arrays even when the error is a single string", function() {
            expect(
                errorMessages('field', { field: "error #1" })
            ).to.deep.equal([ "error #1" ]);
        });
    });

    describe("domId()", function() {
        var domId = b.utils.domId;
        it("generates a dom id for a model based on the pattern <spinal-cased model name>-<spinal-cased field name>-<spinal-cased value>", function() {
            expect(
                domId({ _name: 'ModelName'}, 'fieldName', 'can_haz  value?')
            ).to.equal('model-name-field-name-can-haz-value');
        });
        it("supports skipping the value", function() {
            expect(
                domId({ _name: 'ModelName'}, 'fieldName')
            ).to.equal('model-name-field-name');
        });
        it("supports non-string values", function() {
            expect(
                domId({ _name: 'ModelName'}, 'fieldName', 1)
            ).to.equal('model-name-field-name-1');
            expect(
                domId({ _name: 'ModelName'}, 'fieldName', true)
            ).to.equal('model-name-field-name-true');
            expect(
                domId({ _name: 'ModelName'}, 'fieldName', undefined)
            ).to.equal('model-name-field-name');
            expect(
                domId({ _name: 'ModelName'}, 'fieldName', false)
            ).to.equal('model-name-field-name-false');
        });
    });

    describe("inputName()", function() {
        var inputName = b.utils.inputName;
        it("generates a querystring (qs) compatible name", function() {
            expect(
                inputName({ _name: 'ModelName' }, 'fieldName')
            ).to.equal('modelName[fieldName]');
        });
    });
});
