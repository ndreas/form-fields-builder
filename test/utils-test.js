var b = require('..');

describe("utils", function() {
    before(function() {
        b.utils.modelName = function(model) { return model._name; }
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
