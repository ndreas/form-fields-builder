var b = require('..');

describe("components", function() {
    var model = {
        _name: 'ModelName',
        field: 'field'
    };

    before(function() {
        b.utils.modelName = function(model) { return model._name; }
        b.messages = {
            label: { ModelName: { field: "Label <b>content</b>" } },
            hint: { ModelName: { field: "Hint <b>content</b>" } },
            required: { title: "Required", text: "*" }
        }
    });

    describe("field()", function() {
        var field = b.components.field;
        it("generates a form field wrapper for a field", function() {
            expect(
                field(model, 'field', "Form field <b>content</b>")
            ).to.equal('<div>Form field <b>content</b></div>');
        });
    });

    describe("label()", function() {
        var label = b.components.label;
        it("generates a label for a field", function() {
            expect(
                label(model, 'field')
            ).to.equal('<label for="model-name-field">Label <b>content</b></label>');
        });
        it("is possible to override the content via options", function() {
            expect(
                label(model, 'field', { label: "Other <i>contents</i>" })
            ).to.equal('<label for="model-name-field">Other <i>contents</i></label>');
        });
        it("returns an empty string when no label can be found", function() {
            expect(label(model, 'other')).to.equal('');
        });
        it("is possible to override the default options", function() {
            expect(
                label(model, 'field', { for: "zomg" })
            ).to.equal('<label for="zomg">Label <b>content</b></label>');
        });
        it("adds a required marker if applicable", function() {
            expect(
                label(model, 'field', { required: true })
            ).to.equal('<label for="model-name-field">Label <b>content</b><abbr class="required" title="Required">*</abbr></label>');
        });
        it("supports custom content before the label", function() {
            expect(
                label(model, 'field', { before: '<b>before</b>' })
            ).to.equal('<label for="model-name-field"><b>before</b>Label <b>content</b></label>');
        });
        it("supports custom content before the label", function() {
            expect(
                label(model, 'field', { required: true, after: '<i>after</i>' })
            ).to.equal('<label for="model-name-field">Label <b>content</b><abbr class="required" title="Required">*</abbr><i>after</i></label>');
        });

        context("with content to wrap", function() {
            it("wraps content in a label with the label text after the wrapped content", function() {
                expect(
                    label(model, 'field', "<span>Wrapped</span>")
                ).to.equal('<label><span>Wrapped</span> Label <b>content</b></label>');
            });
            it("is possible to override the label text via options", function() {
                expect(
                    label(model, 'field', "<span>Wrapped</span>", { label: "Other <i>contents</i>" })
                ).to.equal('<label><span>Wrapped</span> Other <i>contents</i></label>');
            });
            it("wraps the content even when the label is blank", function() {
                expect(
                    label(model, 'other', "<span>Wrapped</span>")
                ).to.equal('<label><span>Wrapped</span></label>');
            });
            it("is possible to add attributes to the label", function() {
                expect(
                    label(model, 'field', "<span>Wrapped</span>", { class: "zomg" })
                ).to.equal('<label class="zomg"><span>Wrapped</span> Label <b>content</b></label>');
            });
        });
    });

    describe("required()", function() {
        var required = b.components.required;
        it("renders a required marker", function() {
            expect(
                required(model, 'field')
            ).to.equal('<abbr class="required" title="Required">*</abbr>');
        });
        it("is possible to add attributes to the marker", function() {
            expect(
                required(model, 'field', { class: "req" })
            ).to.equal('<abbr class="req" title="Required">*</abbr>');
        });
    });

    describe("hint()", function() {
        var hint = b.components.hint;
        it("generates a form field hint for a field", function() {
            expect(
                hint(model, 'field')
            ).to.equal('<span class="hint">Hint <b>content</b></span>');
        });
        it("is possible to override the content via options", function() {
            expect(
                hint(model, 'field', { hint: "Other <i>contents</i>" })
            ).to.equal('<span class="hint">Other <i>contents</i></span>');
        });
        it("returns an empty string when no hint can be found", function() {
            expect(hint(model, 'other')).to.equal('');
        });
        it("is possible to override the default options", function() {
            expect(
                hint(model, 'field', { class: "zomg" })
            ).to.equal('<span class="zomg">Hint <b>content</b></span>');
        });
    });

    describe("error()", function() {
        var error = b.components.error;
        it("generates an error message element for a field", function() {
            expect(
                error(model, 'field', { field: 'Error <b>message</b>' })
            ).to.equal('<span class="errors">Error <b>message</b></span>');
        });
        it("handles multiple error messages", function() {
            expect(
                error(model, 'field', { field: [ 'Error <b>message #1</b>', 'Error message #2' ] })
            ).to.equal('<span class="errors">Error <b>message #1</b><br>Error message #2</span>');
        });
        it("does not display anything if there are no errors", function() {
            expect(
                error(model, 'field', { other: 'Error <b>message</b>' })
            ).to.equal('');
        });
        it("handles empty errors", function() {
            expect(error(model, 'field')).to.equal('');
        });
        it("is possible to override the default options", function() {
            expect(
                error(model, 'field', { field: 'Error <b>message</b>' }, { class: "zomg" })
            ).to.equal('<span class="zomg">Error <b>message</b></span>');
        });
        describe("with a custom errorFor method", function() {
            var m;
            before(function() { m = b.utils.errorMessages; });
            after(function() { b.utils.errorMessages = m; });

            it("uses the custom errorFor method", function() {
                b.utils.errorMessages = function() { return ["custom errorFor method"]; }

                expect(
                    error(model, 'field', { field: 'Error <p>message</p>' })
                ).to.equal('<span class="errors">custom errorFor method</span>');
            });
        });
    });
});
