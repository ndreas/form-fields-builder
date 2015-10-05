var _ = require('lodash');

var b = require('..');

describe("inputs", function() {
    before(function() {
        b.utils.modelName = function(model) { return model._name; }
    });

    describe("input()", function() {
        var input = b.inputs.input;
        var model = {
            _name: 'ModelName',
            field: '<>&\'"'
        };
        it("generates a generic input", function() {
            expect(
                input(model, 'field')
            ).to.equal('<input id="model-name-field" name="modelName[field]" value="&lt;&gt;&amp;&#39;&quot;">');
        });
        it("supports setting extra attributes", function() {
            expect(
                input(model, 'field', { class: 'cls' })
            ).to.equal('<input class="cls" id="model-name-field" name="modelName[field]" value="&lt;&gt;&amp;&#39;&quot;">');
        });
        it("handles non-string values", function() {
            expect(
                input({ _name: 'ModelName', field: 1 }, 'field')
            ).to.equal('<input id="model-name-field" name="modelName[field]" value="1">');
            expect(
                input({ _name: 'ModelName', field: true }, 'field')
            ).to.equal('<input id="model-name-field" name="modelName[field]" value="true">');
            expect(
                input({ _name: 'ModelName', field: undefined }, 'field')
            ).to.equal('<input id="model-name-field" name="modelName[field]" value="">');
            expect(
                input({ _name: 'ModelName', field: false }, 'field')
            ).to.equal('<input id="model-name-field" name="modelName[field]" value="false">');
        });
    });

    describe("regular inputs, similar to type='text'", function() {
        var model = {
            _name: 'ModelName',
            field: '<>&\'"'
        };

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
            var input = b.inputs[type];
            describe(type + "()", function() {
                it("defers to .input() with type='" + type + "'", function() {
                    expect(
                        input(model, 'field')
                    ).to.equal('<input type="' + type + '" id="model-name-field" name="modelName[field]" value="&lt;&gt;&amp;&#39;&quot;">');
                });
            });
        });
    });

    describe("textarea()", function() {
        var textarea = b.inputs.textarea;
        var model = {
            _name: 'ModelName',
            field: '<>&\'"'
        };
        it("generates a text area", function() {
            expect(
                textarea(model, 'field')
            ).to.equal('<textarea id="model-name-field" name="modelName[field]">&lt;&gt;&amp;&#39;&quot;</textarea>');
        });
        it("supports setting extra attributes", function() {
            expect(
                textarea(model, 'field', { class: 'cls' })
            ).to.equal('<textarea class="cls" id="model-name-field" name="modelName[field]">&lt;&gt;&amp;&#39;&quot;</textarea>');
        });
        it("handles non-string values", function() {
            expect(
                textarea({ _name: 'ModelName', field: 1 }, 'field')
            ).to.equal('<textarea id="model-name-field" name="modelName[field]">1</textarea>');
            expect(
                textarea({ _name: 'ModelName', field: true }, 'field')
            ).to.equal('<textarea id="model-name-field" name="modelName[field]">true</textarea>');
            expect(
                textarea({ _name: 'ModelName', field: undefined }, 'field')
            ).to.equal('<textarea id="model-name-field" name="modelName[field]"></textarea>');
            expect(
                textarea({ _name: 'ModelName', field: false }, 'field')
            ).to.equal('<textarea id="model-name-field" name="modelName[field]">false</textarea>');
        });
    });

    describe("select()", function() {
        var select = b.inputs.select;
        var model = {
            _name: 'ModelName',
            selected: 2,
            arrayselected: [ 1, 2 ]
        };
        it("generates a select tag", function() {
            expect(
                select(model, 'field', '<option>opt</option>')
            ).to.equal('<select id="model-name-field" name="modelName[field]"><option>opt</option></select>')
        });
        it("supports setting extra attributes", function() {
            expect(
                select(model, 'field', '<option>opt</option>', { multiple: true })
            ).to.equal('<select multiple id="model-name-field" name="modelName[field]"><option>opt</option></select>')
        });
        it("generates option tags using selectoptions() if the content is an object", function() {
            expect(
                select(model, 'field', { 1: 'foo', 2: 'bar' })
            ).to.equal('<select id="model-name-field" name="modelName[field]"><option value="1">foo</option><option value="2">bar</option></select>');
        });
        it("selects the option corresponding to the field value", function() {
            expect(
                select(model, 'selected', { 1: 'foo', 2: 'bar' })
            ).to.equal('<select id="model-name-selected" name="modelName[selected]"><option value="1">foo</option><option value="2" selected>bar</option></select>');
        });
        it("selects all matching options when the field value is an array", function() {
            expect(
                select(model, 'arrayselected', { 1: 'foo', 2: 'bar' })
            ).to.equal('<select id="model-name-arrayselected" name="modelName[arrayselected]"><option value="1" selected>foo</option><option value="2" selected>bar</option></select>');
        });
    });

    describe("selectoptions", function() {
        var selectoptions = b.inputs.selectoptions;
        var objs = {
            1: 'foo',
            2: 'bar'
        }
        it("generates options from a collection of objects", function() {
            expect(
                selectoptions(objs)
            ).to.equal('<option value="1">foo</option><option value="2">bar</option>');
        });
        it("marks the selected value as selected", function() {
            expect(
                selectoptions(objs, 2)
            ).to.equal('<option value="1">foo</option><option value="2" selected>bar</option>');
        });
    });

    describe("checkbox()", function() {
        var checkbox = b.inputs.checkbox;
        var model = {
            _name: 'ModelName',
            field: 'foo'
        };
        it("generates a checkbox", function() {
            expect(
                checkbox(model, 'field', 'My Value')
            ).to.equal('<input id="model-name-field" name="modelName[field]" type="checkbox" value="My Value">');
        });
        it("supports setting extra attributes", function() {
            expect(
                checkbox(model, 'field', 'My Value', { class: 'cls' })
            ).to.equal('<input class="cls" id="model-name-field" name="modelName[field]" type="checkbox" value="My Value">');
        });
        it("sets the checked attribute if the model's field is the specified value", function() {
            expect(
                checkbox(model, 'field', 'foo')
            ).to.equal('<input id="model-name-field" name="modelName[field]" type="checkbox" value="foo" checked>');
        });
        it("handles non-string values", function() {
            expect(
                checkbox(model, 'field', 1)
            ).to.equal('<input id="model-name-field" name="modelName[field]" type="checkbox" value="1">');
            expect(
                checkbox(model, 'field', true)
            ).to.equal('<input id="model-name-field" name="modelName[field]" type="checkbox" value="true">');
            expect(
                checkbox(model, 'field', undefined)
            ).to.equal('<input id="model-name-field" name="modelName[field]" type="checkbox" value="">');
            expect(
                checkbox(model, 'field', false)
            ).to.equal('<input id="model-name-field" name="modelName[field]" type="checkbox" value="false">');
        });
    });

    describe("radio()", function() {
        var radio = b.inputs.radio;
        var model = {
            _name: 'ModelName',
            field: 'fieldval'
        }
        it("generates a radio", function() {
            expect(
                radio(model, 'field', 'My Value')
            ).to.equal('<input id="model-name-field-my-value" name="modelName[field]" type="radio" value="My Value">');
        });
        it("supports setting extra attributes", function() {
            expect(
                radio(model, 'field', 'My Value', { class: 'cls' })
            ).to.equal('<input class="cls" id="model-name-field-my-value" name="modelName[field]" type="radio" value="My Value">');
        });
        it("sets the checked attribute if the value matches the model's field", function() {
            expect(
                radio(model, 'field', 'fieldval')
            ).to.equal('<input id="model-name-field-fieldval" name="modelName[field]" type="radio" value="fieldval" checked>');
        });
        it("handles non-string values", function() {
            expect(
                radio(model, 'field', 1)
            ).to.equal('<input id="model-name-field-1" name="modelName[field]" type="radio" value="1">');
            expect(
                radio(model, 'field', true)
            ).to.equal('<input id="model-name-field-true" name="modelName[field]" type="radio" value="true">');
            expect(
                radio(model, 'field', undefined)
            ).to.equal('<input id="model-name-field" name="modelName[field]" type="radio" value="">');
            expect(
                radio(model, 'field', false)
            ).to.equal('<input id="model-name-field-false" name="modelName[field]" type="radio" value="false">');
        });
    });
});
