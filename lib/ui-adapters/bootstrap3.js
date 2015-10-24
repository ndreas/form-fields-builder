var _ = require('lodash');

module.exports = function(b) {
    b.components.field = function(model, field, content, attrs) {
        attrs = attrs || {};

        if (attrs.class) {
            attrs.class = 'form-group ' + attrs.class;
        } else {
            attrs.class = 'form-group';
        }

        return b.html.tag('div', attrs, content)
    }

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
    ], function(input) {
        b.fields[input] = function(model, field, errors, attrs) {
            var attrs = attrs || {};

            var options = b.utils.extractOptions(attrs, {
                label: null,
                required: null,
                hint: null,
                fieldAttrs: {},
                labelAttrs: { class: 'control-label' },
                errorAttrs: {},
                hintAttrs: {}
            });
            var fieldAttrs = options.fieldAttrs;

            var modelName = b.utils.modelName(model);

            var content = "";
            content += b.components.label(model, field, _.defaults(options.labelAttrs, { label: options.label, required: options.required }));
            content += b.inputs[input](model, field, _.defaults(attrs, { class: 'form-control' }));

            var error = b.components.error(model, field, errors, _.defaults(options.errorAttrs, { class: 'help-block' }));

            if (error) {
                content += error;
                fieldAttrs.class = fieldAttrs.class ? 'has-error ' + fieldAttrs.class : 'has-error';
            }

            content += b.components.hint(model, field, _.defaults(options.hintAttrs, { class: 'help-block', hint: options.hint }));

            return b.components.field(model, field, content, fieldAttrs);
        }
    });

    b.fields.select = function(model, field, selectOptions, errors, attrs) {
        var attrs = attrs || {};

        var options = b.utils.extractOptions(attrs, {
            label: null,
            required: null,
            hint: null,
            fieldAttrs: {},
            labelAttrs: { class: 'control-label' },
            errorAttrs: {},
            hintAttrs: {}
        });
        var fieldAttrs = options.fieldAttrs;

        var modelName = b.utils.modelName(model);

        var content = "";
        content += b.components.label(model, field, _.defaults(options.labelAttrs, { label: options.label, required: options.required }));
        content += b.inputs.select(model, field, selectOptions, _.defaults(attrs, { class: 'form-control' }));

        var error = b.components.error(model, field, errors, _.defaults(options.errorAttrs, { class: 'help-block' }));

        if (error) {
            content += error;
            fieldAttrs.class = fieldAttrs.class ? 'has-error ' + fieldAttrs.class : 'has-error';
        }

        content += b.components.hint(model, field, _.defaults(options.hintAttrs, { class: 'help-block', hint: options.hint }));

        return b.components.field(model, field, content, fieldAttrs);
    }

    _.map([
        'checkbox',
        'radio'
    ], function(input) {
        b.fields[input] = function(model, field, value, errors, attrs) {
            var attrs = attrs || {};

            var options = b.utils.extractOptions(attrs, {
                label: null,
                required: null,
                hint: null,
                fieldAttrs: {},
                wrapAttrs: {},
                labelAttrs: {},
                errorAttrs: {},
                hintAttrs: {}
            });
            var fieldAttrs = options.fieldAttrs;

            var modelName = b.utils.modelName(model);

            var content = "";
            content += b.html.tag(
                'div',
                _.defaults(options.wrapAttrs, { class: input }),
                b.components.label(
                    model,
                    field,
                    b.inputs[input](model, field, value, attrs),
                    _.defaults(options.labelAttrs, { label: options.label, required: options.required })
                )
            );

            var error = b.components.error(model, field, errors, _.defaults(options.errorAttrs, { class: 'help-block' }));

            if (error) {
                content += error;
                fieldAttrs.class = fieldAttrs.class ? 'has-error ' + fieldAttrs.class : 'has-error';
            }

            content += b.components.hint(model, field, _.defaults(options.hintAttrs, { class: 'help-block', hint: options.hint }));

            return b.components.field(model, field, content, fieldAttrs);
        }
    });

    _.map({ checkbox: 'checkboxes', radio: 'radios'}, function(method, input) {
        b.fields[method] = function(model, field, inputOptions, errors, attrs) {
            var attrs = attrs || {};

            var options = b.utils.extractOptions(attrs, {
                label: null,
                required: null,
                hint: null,
                fieldAttrs: {},
                wrapAttrs: {},
                labelAttrs: {},
                errorAttrs: {},
                hintAttrs: {}
            });
            var fieldAttrs = options.fieldAttrs;

            var modelName = b.utils.modelName(model);

            var content = "";
            content += b.components.label(model, field, _.defaults(options.labelAttrs, { label: options.label, for: null, required: options.required }));

            var wrapAttrs = _.defaults(options.wrapAttrs, { class: input });

            var arrayOptions = _.isArray(inputOptions);

            content += _.map(inputOptions, function(value, key) {
                if (arrayOptions) {
                    key = value[0];
                    value = value[1];
                }

                return b.html.tag('div', wrapAttrs, b.components.label(
                    model,
                    field,
                    b.inputs[input](model, field, key, _.clone(attrs, true), true),
                    { label: value }
                ));
            }).join('');

            var error = b.components.error(model, field, errors, _.defaults(options.errorAttrs, { class: 'help-block' }));

            if (error) {
                content += error;
                fieldAttrs.class = fieldAttrs.class ? 'has-error ' + fieldAttrs.class : 'has-error';
            }

            content += b.components.hint(model, field, _.defaults(options.hintAttrs, { class: 'help-block', hint: options.hint }));

            return b.components.field(model, field, content, fieldAttrs);
        }
    })
}
