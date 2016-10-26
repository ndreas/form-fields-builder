var _ = require('lodash');
var b = require('../..');

describe("bootstrap3 ui adapter", function() {
    var model = {
        _name: 'ModelName',
        field: '<>&\'"'
    };

    var m, f;

    before(function() {
        b.use({ ui: 'bootstrap3' });
        b.utils.modelName = function(model) { return model._name; }
        f = b.fields;
    });
    beforeEach(function() {
        m = b.messages;
        b.messages = {
            label: { ModelName: { field: 'Field', field2: 'Field 2' } },
            required: { text: "*", title: "Required" }
        };
    });
    after(function() { b.reset(); });
    afterEach(function() { b.messages = m; });

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
        'url'
    ], function(type) {
        describe(type + "()", function() {
            it("generates a full field of the type '" + type + "'", function() {
                expect(
                    f[type](model, 'field')
                ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field">Field</label><input class="form-control" type="' + type + '" id="model-name-field" name="modelName[field]" value="&lt;&gt;&amp;&#39;&quot;"></div>');
            });
            it("adds a required marker if the field is required", function() {
                expect(
                    f[type](model, 'field', null, { required: true })
                ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field">Field<abbr class="required" title="Required">*</abbr></label><input class="form-control" type="' + type + '" id="model-name-field" name="modelName[field]" value="&lt;&gt;&amp;&#39;&quot;"></div>');
            });
            it("adds an error field if errors are present", function() {
                expect(
                    f[type](model, 'field', { field: "invalid" })
                ).to.equal('<div class="form-group has-error"><label class="control-label" for="model-name-field">Field</label><input class="form-control" type="' + type + '" id="model-name-field" name="modelName[field]" value="&lt;&gt;&amp;&#39;&quot;"><span class="help-block">invalid</span></div>');
            });
            it("adds a hint field if present", function() {
                b.messages.hint = { ModelName: { field: 'hint text' }}
                expect(
                    f[type](model, 'field')
                ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field">Field</label><input class="form-control" type="' + type + '" id="model-name-field" name="modelName[field]" value="&lt;&gt;&amp;&#39;&quot;"><span class="help-block">hint text</span></div>');
            });
            it("is possible to override the label text via options", function() {
                expect(
                    f[type](model, 'field', null, { label: "label text" })
                ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field">label text</label><input class="form-control" type="' + type + '" id="model-name-field" name="modelName[field]" value="&lt;&gt;&amp;&#39;&quot;"></div>');
            });
            it("is possible to override the hint text via options", function() {
                b.messages.hint = { ModelName: { field: 'hint text' }}
                expect(
                    f[type](model, 'field', null, { hint: "updated hint text" })
                ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field">Field</label><input class="form-control" type="' + type + '" id="model-name-field" name="modelName[field]" value="&lt;&gt;&amp;&#39;&quot;"><span class="help-block">updated hint text</span></div>');
            });
            it("is possible to add content before and after the label", function() {
                expect(
                    f[type](model, 'field', null, { beforeLabel: '<i>', afterLabel: '</i>' })
                ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field"><i>Field</i></label><input class="form-control" type="' + type + '" id="model-name-field" name="modelName[field]" value="&lt;&gt;&amp;&#39;&quot;"></div>');
            });
            it("is possible to override attributes on the field, label, input, hint and error components", function() {
                b.messages.hint = { ModelName: { field: 'hint text' }}
                expect(
                    f[type](
                        model,
                        'field',
                        { field: "invalid" },
                        {
                            id: 'zomg-input',
                            min: 10,
                            fieldAttrs: { class: 'bar', id: 'zomg-field' },
                            labelAttrs: { for: 'zomg-input', id: 'zomg-label' },
                            errorAttrs: { class: 'zomg-errors', id: "zomg-errors" },
                            hintAttrs: { class: 'zomg-hint', id: "zomg-hint" }
                        }
                    )
                ).to.equal('<div class="form-group has-error bar" id="zomg-field"><label for="zomg-input" id="zomg-label">Field</label><input id="zomg-input" min="10" class="form-control" type="' + type + '" name="modelName[field]" value="&lt;&gt;&amp;&#39;&quot;"><span class="zomg-errors" id="zomg-errors">invalid</span><span class="zomg-hint" id="zomg-hint">hint text</span></div>');
            });
        });
    });

    describe("textarea()", function() {
        it("generates a textarea form group", function() {
            expect(
                f.textarea(model, 'field')
            ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field">Field</label><textarea class="form-control" id="model-name-field" name="modelName[field]">&lt;&gt;&amp;&#39;&quot;</textarea></div>');
        });
        it("adds a required marker if the field is required", function() {
            expect(
                f.textarea(model, 'field', null, { required: true })
            ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field">Field<abbr class="required" title="Required">*</abbr></label><textarea class="form-control" id="model-name-field" name="modelName[field]">&lt;&gt;&amp;&#39;&quot;</textarea></div>');
        });
        it("adds an error field and class if errors are present", function() {
            expect(
                f.textarea(model, 'field', { field: "invalid" })
            ).to.equal('<div class="form-group has-error"><label class="control-label" for="model-name-field">Field</label><textarea class="form-control" id="model-name-field" name="modelName[field]">&lt;&gt;&amp;&#39;&quot;</textarea><span class="help-block">invalid</span></div>');
        });
        it("adds a hint field if present", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.textarea(model, 'field')
            ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field">Field</label><textarea class="form-control" id="model-name-field" name="modelName[field]">&lt;&gt;&amp;&#39;&quot;</textarea><span class="help-block">hint text</span></div>');
        });
        it("is possible to override the label text via options", function() {
            expect(
                f.textarea(model, 'field', null, { label: "label text"})
            ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field">label text</label><textarea class="form-control" id="model-name-field" name="modelName[field]">&lt;&gt;&amp;&#39;&quot;</textarea></div>');
        });
        it("is possible to override the hint text via options", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.textarea(model, 'field', null, { hint: "updated hint text"})
            ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field">Field</label><textarea class="form-control" id="model-name-field" name="modelName[field]">&lt;&gt;&amp;&#39;&quot;</textarea><span class="help-block">updated hint text</span></div>');
        });
        it("is possible to add content before and after the label", function() {
            expect(
                f.textarea(model, 'field', null, { beforeLabel: '<i>', afterLabel: '</i>' })
            ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field"><i>Field</i></label><textarea class="form-control" id="model-name-field" name="modelName[field]">&lt;&gt;&amp;&#39;&quot;</textarea></div>');
        });
        it("is possible to override attributes on the field, label, input, hint and error components", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.textarea(
                    model,
                    'field',
                    { field: "invalid" },
                    {
                        id: 'zomg-input',
                        min: 10,
                        fieldAttrs: { class: 'bar', id: 'zomg-field' },
                        labelAttrs: { for: 'zomg-input', id: 'zomg-label' },
                        errorAttrs: { class: 'zomg-errors', id: "zomg-errors" },
                        hintAttrs: { class: 'zomg-hint', id: "zomg-hint" }
                    }
                )
            ).to.equal('<div class="form-group has-error bar" id="zomg-field"><label for="zomg-input" id="zomg-label">Field</label><textarea id="zomg-input" min="10" class="form-control" name="modelName[field]">&lt;&gt;&amp;&#39;&quot;</textarea><span class="zomg-errors" id="zomg-errors">invalid</span><span class="zomg-hint" id="zomg-hint">hint text</span></div>');
        });
    });

    describe("select()", function() {
        var model = {
            _name: 'ModelName',
            field: '1'
        };

        it("generates a select form group", function() {
            expect(
                f.select(model, 'field', { 1: "foo", 2: "bar" })
            ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field">Field</label><select class="form-control" id="model-name-field" name="modelName[field]"><option value="1" selected>foo</option><option value="2">bar</option></select></div>');
        });
        it("adds a required marker if the field is required", function() {
            expect(
                f.select(model, 'field', { 1: "foo", 2: "bar" }, null, { required: true })
            ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field">Field<abbr class="required" title="Required">*</abbr></label><select class="form-control" id="model-name-field" name="modelName[field]"><option value="1" selected>foo</option><option value="2">bar</option></select></div>');
        });
        it("adds an error field and class if errors are present", function() {
            expect(
                f.select(model, 'field', { 1: "foo", 2: "bar" }, { field: "invalid" })
            ).to.equal('<div class="form-group has-error"><label class="control-label" for="model-name-field">Field</label><select class="form-control" id="model-name-field" name="modelName[field]"><option value="1" selected>foo</option><option value="2">bar</option></select><span class="help-block">invalid</span></div>');
        });
        it("adds a hint field if present", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.select(model, 'field', { 1: "foo", 2: "bar" })
            ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field">Field</label><select class="form-control" id="model-name-field" name="modelName[field]"><option value="1" selected>foo</option><option value="2">bar</option></select><span class="help-block">hint text</span></div>');
        });
        it("is possible to override the label text via options", function() {
            expect(
                f.select(model, 'field', { 1: "foo", 2: "bar" }, null, { label: "label text" })
            ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field">label text</label><select class="form-control" id="model-name-field" name="modelName[field]"><option value="1" selected>foo</option><option value="2">bar</option></select></div>');
        });
        it("is possible to override the hint text via options", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.select(model, 'field', { 1: "foo", 2: "bar" }, null, { hint: "updated hint text"})
            ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field">Field</label><select class="form-control" id="model-name-field" name="modelName[field]"><option value="1" selected>foo</option><option value="2">bar</option></select><span class="help-block">updated hint text</span></div>');
        });
        it("is possible to add content before and after the label", function() {
            expect(
                f.select(model, 'field', { 1: "foo", 2: "bar" }, null, { beforeLabel: '<i>', afterLabel: '</i>' })
            ).to.equal('<div class="form-group"><label class="control-label" for="model-name-field"><i>Field</i></label><select class="form-control" id="model-name-field" name="modelName[field]"><option value="1" selected>foo</option><option value="2">bar</option></select></div>');
        });
        it("is possible to override attributes on the field, label, input, hint and error components", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.select(
                    model,
                    'field',
                    { 1: "foo", 2: "bar" },
                    { field: "invalid" },
                    {
                        id: 'zomg-input',
                        min: 10,
                        fieldAttrs: { class: 'bar', id: 'zomg-field' },
                        labelAttrs: { for: 'zomg-input', id: 'zomg-label' },
                        errorAttrs: { class: 'zomg-errors', id: "zomg-errors" },
                        hintAttrs: { class: 'zomg-hint', id: "zomg-hint" }
                    }
                )
            ).to.equal('<div class="form-group has-error bar" id="zomg-field"><label for="zomg-input" id="zomg-label">Field</label><select id="zomg-input" min="10" class="form-control" name="modelName[field]"><option value="1" selected>foo</option><option value="2">bar</option></select><span class="zomg-errors" id="zomg-errors">invalid</span><span class="zomg-hint" id="zomg-hint">hint text</span></div>');
        });
    });

    describe("checkbox()", function() {
        it("generates a checkbox form group", function() {
            expect(
                f.checkbox(model, 'field', 'My Value')
            ).to.equal('<div class="form-group"><div class="checkbox"><label><input id="model-name-field" name="modelName[field]" type="checkbox" value="My Value"> Field</label></div></div>');
        });
        it("adds a required marker if the field is required", function() {
            expect(
                f.checkbox(model, 'field', 'My Value', null, { required: true })
            ).to.equal('<div class="form-group"><div class="checkbox"><label><input id="model-name-field" name="modelName[field]" type="checkbox" value="My Value"> Field<abbr class="required" title="Required">*</abbr></label></div></div>');
        });
        it("adds an error field and class if errors are present", function() {
            expect(
                f.checkbox(model, 'field', 'My Value', { field: "invalid" })
            ).to.equal('<div class="form-group has-error"><div class="checkbox"><label><input id="model-name-field" name="modelName[field]" type="checkbox" value="My Value"> Field</label></div><span class="help-block">invalid</span></div>');
        });
        it("adds a hint field if present", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.checkbox(model, 'field', 'My Value')
            ).to.equal('<div class="form-group"><div class="checkbox"><label><input id="model-name-field" name="modelName[field]" type="checkbox" value="My Value"> Field</label></div><span class="help-block">hint text</span></div>');
        });
        it("is possible to override the label text via options", function() {
            expect(
                f.checkbox(model, 'field', 'My Value', null, { label: "label text" })
            ).to.equal('<div class="form-group"><div class="checkbox"><label><input id="model-name-field" name="modelName[field]" type="checkbox" value="My Value"> label text</label></div></div>');
        });
        it("is possible to override the hint text via options", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.checkbox(model, 'field', 'My Value', null, { hint: 'updated hint text'})
            ).to.equal('<div class="form-group"><div class="checkbox"><label><input id="model-name-field" name="modelName[field]" type="checkbox" value="My Value"> Field</label></div><span class="help-block">updated hint text</span></div>');
        });
        it("is possible to add content before and after the label", function() {
            expect(
                f.checkbox(model, 'field', 'My Value', null, { beforeLabel: '<i>', afterLabel: '</i>' })
            ).to.equal('<div class="form-group"><div class="checkbox"><label><i><input id="model-name-field" name="modelName[field]" type="checkbox" value="My Value"> Field</i></label></div></div>');
        });
        it("is possible to override attributes on the field, wrapper, label, input, hint and error components", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.checkbox(
                    model,
                    'field',
                    'My Value',
                    { field: "invalid" },
                    {
                        id: 'zomg-input',
                        min: 10,
                        fieldAttrs: { class: 'bar', id: 'zomg-field' },
                        wrapAttrs: { class: 'zomg-wrap', id: 'zomg-wrap' },
                        labelAttrs: { id: 'zomg-label' },
                        errorAttrs: { class: 'zomg-errors', id: "zomg-errors" },
                        hintAttrs: { class: 'zomg-hint', id: "zomg-hint" }
                    }
                )
            ).to.equal('<div class="form-group has-error bar" id="zomg-field"><div class="zomg-wrap" id="zomg-wrap"><label id="zomg-label"><input id="zomg-input" min="10" name="modelName[field]" type="checkbox" value="My Value"> Field</label></div><span class="zomg-errors" id="zomg-errors">invalid</span><span class="zomg-hint" id="zomg-hint">hint text</span></div>');
        });
    });

    describe("radio()", function() {
        it("generates a radio form group", function() {
            expect(
                f.radio(model, 'field', 'My Value')
            ).to.equal('<div class="form-group"><div class="radio"><label><input id="model-name-field-my-value" name="modelName[field]" type="radio" value="My Value"> Field</label></div></div>');
        });
        it("adds a required marker if the field is required", function() {
            expect(
                f.radio(model, 'field', 'My Value', null, { required: true })
            ).to.equal('<div class="form-group"><div class="radio"><label><input id="model-name-field-my-value" name="modelName[field]" type="radio" value="My Value"> Field<abbr class="required" title="Required">*</abbr></label></div></div>');
        });
        it("adds an error field and class if errors are present", function() {
            expect(
                f.radio(model, 'field', 'My Value', { field: "invalid" })
            ).to.equal('<div class="form-group has-error"><div class="radio"><label><input id="model-name-field-my-value" name="modelName[field]" type="radio" value="My Value"> Field</label></div><span class="help-block">invalid</span></div>');
        });
        it("adds a hint field if present", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.radio(model, 'field', 'My Value')
            ).to.equal('<div class="form-group"><div class="radio"><label><input id="model-name-field-my-value" name="modelName[field]" type="radio" value="My Value"> Field</label></div><span class="help-block">hint text</span></div>');
        });
        it("is possible to override the label text via options", function() {
            expect(
                f.radio(model, 'field', 'My Value', null, { label: "label text" })
            ).to.equal('<div class="form-group"><div class="radio"><label><input id="model-name-field-my-value" name="modelName[field]" type="radio" value="My Value"> label text</label></div></div>');
        });
        it("is possible to override the hint text via options", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.radio(model, 'field', 'My Value', null, { hint: 'updated hint text'})
            ).to.equal('<div class="form-group"><div class="radio"><label><input id="model-name-field-my-value" name="modelName[field]" type="radio" value="My Value"> Field</label></div><span class="help-block">updated hint text</span></div>');
        });
        it("is possible to add content before and after the label", function() {
            expect(
                f.radio(model, 'field', 'My Value', null, { beforeLabel: '<i>', afterLabel: '</i>' })
            ).to.equal('<div class="form-group"><div class="radio"><label><i><input id="model-name-field-my-value" name="modelName[field]" type="radio" value="My Value"> Field</i></label></div></div>');
        });
        it("is possible to override attributes on the field, wrapper, label, input, hint and error components", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.radio(
                    model,
                    'field',
                    'My Value',
                    { field: "invalid" },
                    {
                        id: 'zomg-input',
                        min: 10,
                        fieldAttrs: { class: 'bar', id: 'zomg-field' },
                        wrapAttrs: { class: 'zomg-wrap', id: 'zomg-wrap' },
                        labelAttrs: { id: 'zomg-label' },
                        errorAttrs: { class: 'zomg-errors', id: "zomg-errors" },
                        hintAttrs: { class: 'zomg-hint', id: "zomg-hint" }
                    }
                )
            ).to.equal('<div class="form-group has-error bar" id="zomg-field"><div class="zomg-wrap" id="zomg-wrap"><label id="zomg-label"><input id="zomg-input" min="10" name="modelName[field]" type="radio" value="My Value"> Field</label></div><span class="zomg-errors" id="zomg-errors">invalid</span><span class="zomg-hint" id="zomg-hint">hint text</span></div>');
        });
    });

    describe("checkboxes()", function() {
        var model = {
            _name: 'ModelName',
            field: [ '1', '2' ],
            field2: [ true, false ]
        };

        it("generates a checkbox button collection form group", function() {
            expect(
                f.checkboxes(model, 'field', { 1: "foo", 2: "bar" })
            ).to.equal('<div class="form-group"><label>Field</label><div class="checkbox"><label><input id="model-name-field-1" name="modelName[field][]" type="checkbox" value="1" checked> foo</label></div><div class="checkbox"><label><input id="model-name-field-2" name="modelName[field][]" type="checkbox" value="2" checked> bar</label></div></div>');
        });
        it("handles a nested array as input options", function() {
            expect(
                f.checkboxes(model, 'field2', [ [true, "foo"], [false, "bar"] ])
            ).to.equal('<div class="form-group"><label>Field 2</label><div class="checkbox"><label><input id="model-name-field2-true" name="modelName[field2][]" type="checkbox" value="true" checked> foo</label></div><div class="checkbox"><label><input id="model-name-field2-false" name="modelName[field2][]" type="checkbox" value="false" checked> bar</label></div></div>');
        });
        it("adds a required marker if the field is required", function() {
            expect(
                f.checkboxes(model, 'field', { 1: "foo", 2: "bar" }, null, { required: true })
            ).to.equal('<div class="form-group"><label>Field<abbr class="required" title="Required">*</abbr></label><div class="checkbox"><label><input id="model-name-field-1" name="modelName[field][]" type="checkbox" value="1" checked> foo</label></div><div class="checkbox"><label><input id="model-name-field-2" name="modelName[field][]" type="checkbox" value="2" checked> bar</label></div></div>');
        });
        it("adds an error field and class if errors are present", function() {
            expect(
                f.checkboxes(model, 'field', { 1: "foo", 2: "bar" }, { field: "invalid" })
            ).to.equal('<div class="form-group has-error"><label>Field</label><div class="checkbox"><label><input id="model-name-field-1" name="modelName[field][]" type="checkbox" value="1" checked> foo</label></div><div class="checkbox"><label><input id="model-name-field-2" name="modelName[field][]" type="checkbox" value="2" checked> bar</label></div><span class="help-block">invalid</span></div>');
        });
        it("adds a hint field if present", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.checkboxes(model, 'field', { 1: "foo", 2: "bar" })
            ).to.equal('<div class="form-group"><label>Field</label><div class="checkbox"><label><input id="model-name-field-1" name="modelName[field][]" type="checkbox" value="1" checked> foo</label></div><div class="checkbox"><label><input id="model-name-field-2" name="modelName[field][]" type="checkbox" value="2" checked> bar</label></div><span class="help-block">hint text</span></div>');
        });
        it("is possible to override the label text via options", function() {
            expect(
                f.checkboxes(model, 'field', { 1: "foo", 2: "bar" }, null, { label: "label text" })
            ).to.equal('<div class="form-group"><label>label text</label><div class="checkbox"><label><input id="model-name-field-1" name="modelName[field][]" type="checkbox" value="1" checked> foo</label></div><div class="checkbox"><label><input id="model-name-field-2" name="modelName[field][]" type="checkbox" value="2" checked> bar</label></div></div>');
        });
        it("is possible to override the hint text via options", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.checkboxes(model, 'field', { 1: "foo", 2: "bar" }, null, { hint: "updated hint text" })
            ).to.equal('<div class="form-group"><label>Field</label><div class="checkbox"><label><input id="model-name-field-1" name="modelName[field][]" type="checkbox" value="1" checked> foo</label></div><div class="checkbox"><label><input id="model-name-field-2" name="modelName[field][]" type="checkbox" value="2" checked> bar</label></div><span class="help-block">updated hint text</span></div>');
        });
        it("is possible to add content before and after the label", function() {
            expect(
                f.checkboxes(model, 'field', { 1: "foo", 2: "bar" }, null, { beforeLabel: '<i>', afterLabel: '</i>' })
            ).to.equal('<div class="form-group"><label><i>Field</i></label><div class="checkbox"><label><input id="model-name-field-1" name="modelName[field][]" type="checkbox" value="1" checked> foo</label></div><div class="checkbox"><label><input id="model-name-field-2" name="modelName[field][]" type="checkbox" value="2" checked> bar</label></div></div>');
        });
        it("is possible to override attributes on the field, wrapper, label, input, hint and error components", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.checkboxes(
                    model,
                    'field',
                    { 1: "foo" },
                    { field: "invalid" },
                    {
                        id: 'zomg-input',
                        min: 10,
                        fieldAttrs: { class: 'bar', id: 'zomg-field' },
                        wrapAttrs: { class: 'zomg-wrap', id: 'zomg-wrap' },
                        labelAttrs: { id: 'zomg-label' },
                        errorAttrs: { class: 'zomg-errors', id: "zomg-errors" },
                        hintAttrs: { class: 'zomg-hint', id: "zomg-hint" }
                    }
                )
            ).to.equal('<div class="form-group has-error bar" id="zomg-field"><label id="zomg-label">Field</label><div class="zomg-wrap" id="zomg-wrap"><label><input id="zomg-input" min="10" name="modelName[field][]" type="checkbox" value="1" checked> foo</label></div><span class="zomg-errors" id="zomg-errors">invalid</span><span class="zomg-hint" id="zomg-hint">hint text</span></div>');
        });
    });

    describe("radios()", function() {
        var model = {
            _name: 'ModelName',
            field: '1',
            field2: false
        };

        it("generates a radio button collection form group", function() {
            expect(
                f.radios(model, 'field', { 1: "foo", 2: "bar" })
            ).to.equal('<div class="form-group"><label>Field</label><div class="radio"><label><input id="model-name-field-1" name="modelName[field]" type="radio" value="1" checked> foo</label></div><div class="radio"><label><input id="model-name-field-2" name="modelName[field]" type="radio" value="2"> bar</label></div></div>');
        });
        it("handles a nested array as input options", function() {
            expect(
                f.radios(model, 'field2', [ [true, "foo"], [false, "bar"] ])
            ).to.equal('<div class="form-group"><label>Field 2</label><div class="radio"><label><input id="model-name-field2-true" name="modelName[field2]" type="radio" value="true"> foo</label></div><div class="radio"><label><input id="model-name-field2-false" name="modelName[field2]" type="radio" value="false" checked> bar</label></div></div>');
        });
        it("adds a required marker if the field is required", function() {
            expect(
                f.radios(model, 'field', { 1: "foo", 2: "bar" }, null, { required: true })
            ).to.equal('<div class="form-group"><label>Field<abbr class="required" title="Required">*</abbr></label><div class="radio"><label><input id="model-name-field-1" name="modelName[field]" type="radio" value="1" checked> foo</label></div><div class="radio"><label><input id="model-name-field-2" name="modelName[field]" type="radio" value="2"> bar</label></div></div>');
        });
        it("adds an error field and class if errors are present", function() {
            expect(
                f.radios(model, 'field', { 1: "foo", 2: "bar" }, { field: "invalid" })
            ).to.equal('<div class="form-group has-error"><label>Field</label><div class="radio"><label><input id="model-name-field-1" name="modelName[field]" type="radio" value="1" checked> foo</label></div><div class="radio"><label><input id="model-name-field-2" name="modelName[field]" type="radio" value="2"> bar</label></div><span class="help-block">invalid</span></div>');
        });
        it("adds a hint field if present", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.radios(model, 'field', { 1: "foo", 2: "bar" })
            ).to.equal('<div class="form-group"><label>Field</label><div class="radio"><label><input id="model-name-field-1" name="modelName[field]" type="radio" value="1" checked> foo</label></div><div class="radio"><label><input id="model-name-field-2" name="modelName[field]" type="radio" value="2"> bar</label></div><span class="help-block">hint text</span></div>');
        });
        it("is possible to override the label text via options", function() {
            expect(
                f.radios(model, 'field', { 1: "foo", 2: "bar" }, null, { label: "label text" })
            ).to.equal('<div class="form-group"><label>label text</label><div class="radio"><label><input id="model-name-field-1" name="modelName[field]" type="radio" value="1" checked> foo</label></div><div class="radio"><label><input id="model-name-field-2" name="modelName[field]" type="radio" value="2"> bar</label></div></div>');
        });
        it("is possible to override the hint text via options", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.radios(model, 'field', { 1: "foo", 2: "bar" }, null, { hint: "updated hint text" })
            ).to.equal('<div class="form-group"><label>Field</label><div class="radio"><label><input id="model-name-field-1" name="modelName[field]" type="radio" value="1" checked> foo</label></div><div class="radio"><label><input id="model-name-field-2" name="modelName[field]" type="radio" value="2"> bar</label></div><span class="help-block">updated hint text</span></div>');
        });
        it("is possible to add content before and after the label", function() {
            expect(
                f.radios(model, 'field', { 1: "foo", 2: "bar" }, null, { beforeLabel: '<i>', afterLabel: '</i>' })
            ).to.equal('<div class="form-group"><label><i>Field</i></label><div class="radio"><label><input id="model-name-field-1" name="modelName[field]" type="radio" value="1" checked> foo</label></div><div class="radio"><label><input id="model-name-field-2" name="modelName[field]" type="radio" value="2"> bar</label></div></div>');
        });
        it("is possible to override attributes on the field, wrapper, label, input, hint and error components", function() {
            b.messages.hint = { ModelName: { field: 'hint text' }}
            expect(
                f.radios(
                    model,
                    'field',
                    { 1: "foo" },
                    { field: "invalid" },
                    {
                        id: 'zomg-input',
                        min: 10,
                        fieldAttrs: { class: 'bar', id: 'zomg-field' },
                        wrapAttrs: { class: 'zomg-wrap', id: 'zomg-wrap' },
                        labelAttrs: { id: 'zomg-label' },
                        errorAttrs: { class: 'zomg-errors', id: "zomg-errors" },
                        hintAttrs: { class: 'zomg-hint', id: "zomg-hint" }
                    }
                )
            ).to.equal('<div class="form-group has-error bar" id="zomg-field"><label id="zomg-label">Field</label><div class="zomg-wrap" id="zomg-wrap"><label><input id="zomg-input" min="10" name="modelName[field]" type="radio" value="1" checked> foo</label></div><span class="zomg-errors" id="zomg-errors">invalid</span><span class="zomg-hint" id="zomg-hint">hint text</span></div>');
        });
    });
});
