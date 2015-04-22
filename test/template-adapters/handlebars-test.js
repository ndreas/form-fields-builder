var Handlebars = require('handlebars');
var _ = require('lodash');
var b = require('../..');

describe("Handlebars template adapter", function() {
    var model = {
        _name: 'ModelName',
        title: 'title',
        text: 'text'
    };

    function template(template, params) {
        template = Handlebars.compile(template);
        return template(params);
    }

    before(function() {
        b.use({ template: 'handlebars'}, { Handlebars: Handlebars, prefix: 'form_' });
        b.use({ ui: 'bootstrap3' });
        b.utils.modelName = function(model) { return model._name; }
    });
    after(function() { b.reset(); });

    describe("fields_for()", function() {
        it("sets the field context to the given model", function() {
            expect(
                template(
                    '{{#form_fields_for model}}{{form_text_field "title"}}{{form_textarea_field "text"}}{{/form_fields_for}}',
                    { model: model }
                )
            ).to.equal(b.fields.text(model, 'title') + b.fields.textarea(model, 'text'));
        });
        it("assigns the error object in the context", function() {
            var errors = { title: "invalid", text: "invalid" };
            expect(
                template(
                    '{{#form_fields_for model errors}}{{form_text_field "title"}}{{form_textarea_field "text"}}{{/form_fields_for}}',
                    { model: model, errors: errors }
                )
            ).to.equal(b.fields.text(model, 'title', errors) + b.fields.textarea(model, 'text', errors));
        });
    });

    describe("components", function() {
        describe("field()", function() {
            it("renders a field component around the given content", function() {
                expect(
                    template(
                        '{{#form_fields_for model}}{{#form_field class="zomg-class"}}zomg-content{{/form_field}}{{/form_fields_for}}',
                        { model: model }
                    )
                ).to.equal(b.components.field(model, null, 'zomg-content', { class: "zomg-class" }));
            });
            it("passes the model context to its children", function() {
                expect(
                    template(
                        '{{#form_fields_for model}}{{#form_field}}{{form_text_field "title"}}{{/form_field}}{{/form_fields_for}}',
                        { model: model }
                    )
                ).to.equal(b.components.field(model, null, b.fields.text(model, 'title')));
            });
        });
        describe("label()", function() {
            it("renders a label component for the given field", function() {
                expect(
                    template(
                        '{{#form_fields_for model}}{{form_label "title" label="label text"}}{{/form_fields_for}}',
                        { model: model }
                    )
                ).to.equal(b.components.label(model, 'title', { label: "label text" }));
            });
            it("works as a block helper as well", function() {
                expect(
                    template(
                        '{{#form_fields_for model}}{{#form_label "title"}}label text{{/form_label}}{{/form_fields_for}}',
                        { model: model }
                    )
                ).to.equal(b.components.label(model, 'title', 'label text'));
            });
            it("does not render anything if there is no label for the given field", function() {
                expect(
                    template(
                        '{{#form_fields_for model}}{{form_label "title"}}{{/form_fields_for}}',
                        { model: model }
                    )
                ).to.equal('');
            });
            it("renders a required marker if the field is required", function() {
                expect(
                    template(
                        '{{#form_fields_for model}}{{form_label "title" label="label text" required=true}}{{/form_fields_for}}',
                        { model: model }
                    )
                ).to.equal(b.components.label(model, 'title', { label: "label text", required: true }));
            });
        });
        describe("error()", function() {
            it("renders an error component for the given field", function() {
                var errors = { title: "invalid" };
                expect(
                    template(
                        '{{#form_fields_for model errors}}{{form_error "title" class="errors"}}{{/form_fields_for}}',
                        { model: model, errors: errors }
                    )
                ).to.equal(b.components.error(model, 'title', errors, { class: "errors" }));
            });
            it("does not render anything if there are no errors for the given field", function() {
                expect(
                    template(
                        '{{#form_fields_for model}}{{form_error "title" class="errors"}}{{/form_fields_for}}',
                        { model: model }
                    )
                ).to.equal('');
            });
        });
        describe("hint()", function() {
            it("renders a hint component for the given field", function() {
                expect(
                    template(
                        '{{#form_fields_for model}}{{form_hint "title" hint="hint text"}}{{/form_fields_for}}',
                        { model: model }
                    )
                ).to.equal(b.components.hint(model, 'title', { hint: "hint text" }));
            });
            it("does not render anything if there is no hint for the gien field", function() {
                expect(
                    template(
                        '{{#form_fields_for model}}{{form_hint "title"}}{{/form_fields_for}}',
                        { model: model }
                    )
                ).to.equal('');
            });
        });
    });

    describe("fields", function() {
        _.map([
            'text',
            'color',
            'date',
            'email',
            'file',
            'hidden',
            'number',
            'password',
            'range',
            'search',
            'tel',
            'url',
            'textarea'
        ], function(type) {
            describe(type + "_field()", function () {
                it("renders a field of type '" + type + "'", function() {
                    var errors = { title: 'invalid' };
                    expect(
                        template(
                            '{{#form_fields_for model errors}}{{form_' + type + '_field "title" label="label text" required=true}}{{/form_fields_for}}',
                            { model: model, errors: errors }
                        )
                    ).to.equal(b.fields[type](model, 'title', errors, { label: "label text", required: true }));
                });
            });
        });

        describe("select_field()", function() {
            it("renders a select field", function() {
                var errors = { title: 'invalid' };
                var options = { 1: "foo", 2: "bar" }
                expect(
                    template(
                        '{{#form_fields_for model errors}}{{form_select_field "title" options label="label text" required=true}}{{/form_fields_for}}',
                        { model: model, errors: errors, options: options }
                    )
                ).to.equal(b.fields.select(model, 'title', options, errors, { label: "label text", required: true }));
            });
            it("works as a block helper", function() {
                var errors = { title: 'invalid' };
                expect(
                    template(
                        '{{#form_fields_for model errors}}{{#form_select_field "title" label="label text"}}opts{{/form_select_field}}{{/form_fields_for}}',
                        { model: model, errors: errors }
                    )
                ).to.equal(b.fields.select(model, 'title', 'opts', errors, { label: "label text" }));
            });
        });

        describe("checkbox_field()", function() {
            it("renders a checkbox field", function() {
                var errors = { title: 'invalid' };
                expect(
                    template(
                        '{{#form_fields_for model errors}}{{form_checkbox_field "title" "value" label="label text" required=true}}{{/form_fields_for}}',
                        { model: model, errors: errors }
                    )
                ).to.equal(b.fields.checkbox(model, 'title', 'value', errors, { label: "label text", required: true }));
            });
        });

        _.map([
            'checkboxes',
            'radios'
        ], function(type) {
            describe(type + "_field()", function() {
                it("renders a select field", function() {
                    var errors = { title: 'invalid' };
                    var options = { 1: "foo", 2: "bar" }
                    expect(
                        template(
                            '{{#form_fields_for model errors}}{{form_' + type + '_field "title" options label="label text" required=true}}{{/form_fields_for}}',
                            { model: model, errors: errors, options: options }
                        )
                    ).to.equal(b.fields[type](model, 'title', options, errors, { label: "label text", required: true }));
                });
            });
        });
    });

    describe("raw inputs", function() {
        _.map([
            'text',
            'color',
            'date',
            'email',
            'file',
            'hidden',
            'number',
            'password',
            'range',
            'search',
            'tel',
            'url',
            'textarea',
            'hidden'
        ], function(type) {
            describe(type + "_input()", function () {
                it("renders an input of type '" + type + "'", function() {
                    expect(
                        template(
                            '{{#form_fields_for model}}{{form_' + type + '_input "title" class="cls"}}{{/form_fields_for}}',
                            { model: model }
                        )
                    ).to.equal(b.inputs[type](model, 'title', { class: "cls" }));
                });
            });
        });

        describe("select_input()", function() {
            it("renders a select input", function() {
                var options = { 1: "foo", 2: "bar" }
                expect(
                    template(
                        '{{#form_fields_for model}}{{form_select_input "title" options class="cls"}}{{/form_fields_for}}',
                        { model: model, options: options }
                    )
                ).to.equal(b.inputs.select(model, 'title', options, { class: "cls" }));
            });
            it("works as a block helper", function() {
                expect(
                    template(
                        '{{#form_fields_for model}}{{#form_select_input "title" class="cls"}}opts{{/form_select_input}}{{/form_fields_for}}',
                        { model: model }
                    )
                ).to.equal(b.inputs.select(model, 'title', 'opts', { class: "cls" }));
            });
        });

        describe("checkbox_input()", function() {
            it("renders a checkbox input", function() {
                expect(
                    template(
                        '{{#form_fields_for model}}{{form_checkbox_input "title" "value" class="cls"}}{{/form_fields_for}}',
                        { model: model }
                    )
                ).to.equal(b.inputs.checkbox(model, 'title', 'value', { class: "cls" }));
            });
        });
    });
});
