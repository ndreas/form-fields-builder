var _ = require('lodash');

module.exports = function(b) {
    b.components.field = function(model, field, content, attrs) {
        attrs = attrs || {};

        if (attrs.class) {
            attrs.class = 'field ' + attrs.class;
        } else {
            attrs.class = 'field';
        }

        return b.html.tag('div', attrs, content)
    }

    b.components.error = function(model, field, errors, attrs) {
        attrs = _.defaults(attrs || {}, { class: 'ui pointing red label' });

        var errorMessages = errors ? b.utils.errorMessages(field, errors) : null;

        if (errorMessages) {
            return b.html.tag('div', b.html.tag('div', attrs, errorMessages.join('<br>')));
        } else {
            return '';
        }
    }

    var hintClass = 'hint';

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
                labelAttrs: {},
                errorAttrs: {},
                hintAttrs: {}
            });
            var fieldAttrs = options.fieldAttrs;

            var modelName = b.utils.modelName(model);

            var content = '';
            content += b.components.label(model, field, _.defaults(options.labelAttrs, { label: options.label, required: options.required }));
            content += b.inputs[input](model, field, attrs);

            var error = b.components.error(model, field, errors, options.errorAttrs);

            if (error) {
                content += error;
                fieldAttrs.class = fieldAttrs.class ? 'error ' + fieldAttrs.class : 'error';
            }

            content += b.components.hint(model, field, _.defaults(options.hintAttrs, { class: hintClass, hint: options.hint }));

            return b.components.field(model, field, content, fieldAttrs);
        };
    });

    b.fields.select = function(model, field, selectOptions, errors, attrs) {
        var attrs = attrs || {};

        var options = b.utils.extractOptions(attrs, {
            label: null,
            required: null,
            hint: null,
            fieldAttrs: {},
            labelAttrs: {},
            errorAttrs: {},
            hintAttrs: {}
        });
        var fieldAttrs = options.fieldAttrs;

        var modelName = b.utils.modelName(model);

        var content = '';
        content += b.components.label(model, field, _.defaults(options.labelAttrs, { label: options.label, required: options.required }));
        content += b.inputs.select(model, field, selectOptions, _.defaults(attrs, { class: 'ui fluid dropdown' }));

        var error = b.components.error(model, field, errors, options.errorAttrs);

        if (error) {
            content += error;
            fieldAttrs.class = fieldAttrs.class ? 'error ' + fieldAttrs.class : 'error';
        }

        content += b.components.hint(model, field, _.defaults(options.hintAttrs, { class: hintClass, hint: options.hint }));

        return b.components.field(model, field, content, fieldAttrs);
    }

    b.fields.checkbox = function(model, field, value, errors, attrs) {
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

        var content = b.html.tag(
            'div',
            _.defaults(options.wrapAttrs, { class: 'ui checkbox' }),
            b.inputs.checkbox(model, field, value, attrs) + b.components.label(
                model,
                field,
                _.defaults(options.labelAttrs, {
                    label: options.label,
                    required: options.required
                })
            ) 
        );

        var error = b.components.error(model, field, errors, options.errorAttrs);

        if (error) {
            content += error;
            fieldAttrs.class = fieldAttrs.class ? 'error ' + fieldAttrs.class : 'error';
        }

        content += b.components.hint(model, field, _.defaults(options.hintAttrs, { class: hintClass, hint: options.hint }));

        return b.components.field(model, field, content, fieldAttrs);
    }

    b.fields.radio = function(model, field, value, errors, attrs) {
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

        var content = b.html.tag(
            'div',
            _.defaults(options.wrapAttrs, { class: 'ui radio checkbox' }),
            b.inputs.radio(model, field, value, attrs) + b.components.label(
                model,
                field,
                _.defaults(options.labelAttrs, {
                    for: b.utils.domId(model, field, value),
                    label: options.label,
                    required: options.required
                })
            ) 
        );

        var error = b.components.error(model, field, errors, options.errorAttrs);

        if (error) {
            content += error;
            fieldAttrs.class = fieldAttrs.class ? 'error ' + fieldAttrs.class : 'error';
        }

        content += b.components.hint(model, field, _.defaults(options.hintAttrs, { class: hintClass, hint: options.hint }));

        return b.components.field(model, field, content, fieldAttrs);
    }

    _.map({
        checkboxes: { input: 'checkbox', classes: 'checkbox' },
        radios: { input: 'radio', classes: 'radio checkbox' }
    }, function(fieldOptions, method) {
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

            if (fieldAttrs.class) {
                fieldAttrs.class += ' ';
            } else {
                fieldAttrs.class = '';
            }

            fieldAttrs.class += 'grouped fields';

            var modelName = b.utils.modelName(model);

            var content = b.components.label(model, field, _.defaults(options.labelAttrs, { label: options.label, for: null, required: options.required }));

            var wrapAttrs = _.defaults(options.wrapAttrs, { class: 'ui ' + fieldOptions.classes });

            var arrayOptions = _.isArray(inputOptions);

            content += _.map(inputOptions, function(label, value) {
                if (arrayOptions) {
                    value = label[0];
                    label = label[1];
                }

                var input = b.inputs[fieldOptions.input](model, field, value, _.clone(attrs, true), true)
                label = b.components.label(model, field, { label: label, for: b.utils.domId(model, field, value) });
                var content = b.html.tag('div', wrapAttrs, input + label);
                return b.components.field(model, field, content);
            }).join('');

            var error = b.components.error(model, field, errors, options.errorAttrs);

            if (error) {
                content += error;
                fieldAttrs.class = fieldAttrs.class + ' error';
            }

            content += b.components.hint(model, field, _.defaults(options.hintAttrs, { class: hintClass, hint: options.hint }));

            return b.html.tag('div', fieldAttrs, content);
        }
    });
}
