var _ = require('lodash');

module.exports = function(b, options) {
    var Handlebars = options.Handlebars;
    var prefix = options.prefix || '';

    Handlebars.registerHelper(prefix + 'fields_for', function(model) {
        var options = _.last(arguments);
        var errors = arguments.length > 2 ? arguments[1] : null;

        var data = Handlebars.createFrame(options.data || {});
        data.model = model;
        data.errors = errors;

        return options.fn(this, { data: data });
    });

    Handlebars.registerHelper(prefix + 'field', function() {
        var options = _.last(arguments);
        var field = arguments.length > 1 ? arguments[0] : null;

        return b.components.field(
            options.data.model,
            field,
            options.fn(this),
            options.hash
        );
    });

    Handlebars.registerHelper(prefix + 'label', function(field, options) {
        if (options.fn) {
            return b.components.label(
                options.data.model,
                field,
                options.fn(this),
                options.hash
            )
        } else {
            return new Handlebars.SafeString(
                b.components.label(
                    options.data.model,
                    field,
                    options.hash
                )
            );
        }
    });


    Handlebars.registerHelper(prefix + 'error', function(field, options) {
        return new Handlebars.SafeString(
            b.components.error(
                options.data.model,
                field,
                options.data.errors,
                options.hash
            )
        );
    });

    Handlebars.registerHelper(prefix + 'hint', function(field, options) {
        return new Handlebars.SafeString(
            b.components.hint(
                options.data.model,
                field,
                options.hash
            )
        );
    });


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
    ], function(field) {
        Handlebars.registerHelper(prefix + field + '_field', function(property, options) {
            return new Handlebars.SafeString(
                b.fields[field](
                    options.data.model,
                    property,
                    options.data.errors,
                    options.hash
                )
            );
        });
        Handlebars.registerHelper(prefix + field + '_input', function(property, options) {
            return new Handlebars.SafeString(
                b.inputs[field](
                    options.data.model,
                    property,
                    options.hash
                )
            );
        });
    });

    Handlebars.registerHelper(prefix + 'select_field', function(property) {
        var options = _.last(arguments);

        if (options.fn) {
            return b.fields.select(
                options.data.model,
                property,
                options.fn(this),
                options.data.errors,
                options.hash
            )
        } else {
            return new Handlebars.SafeString(
                b.fields.select(
                    options.data.model,
                    property,
                    arguments[1],
                    options.data.errors,
                    options.hash
                )
            );
        }
    });

    Handlebars.registerHelper(prefix + 'select_input', function(property) {
        var options = _.last(arguments);

        if (options.fn) {
            return b.inputs.select(
                options.data.model,
                property,
                options.fn(this),
                options.hash
            )
        } else {
            return new Handlebars.SafeString(
                b.inputs.select(
                    options.data.model,
                    property,
                    arguments[1],
                    options.hash
                )
            );
        }
    });

    _.map([
        'checkbox',
        'radio'
    ], function(field) {
        Handlebars.registerHelper(prefix + field + '_field', function(property, value, options) {
            return new Handlebars.SafeString(
                b.fields[field](
                    options.data.model,
                    property,
                    value,
                    options.data.errors,
                    options.hash
                )
            );
        });

        Handlebars.registerHelper(prefix + field + '_input', function(property, value, options) {
            return new Handlebars.SafeString(
                b.inputs[field](
                    options.data.model,
                    property,
                    value,
                    options.hash
                )
            );
        });
    });

    _.map([
        'checkboxes',
        'radios'
    ], function(field) {
        Handlebars.registerHelper(prefix + field + '_field', function(property, inputOptions, options) {
            return new Handlebars.SafeString(
                b.fields[field](
                    options.data.model,
                    property,
                    inputOptions,
                    options.data.errors,
                    options.hash
                )
            );
        });

        Handlebars.registerHelper(prefix + field + '_input', function(property, inputOptions, options) {
            return new Handlebars.SafeString(
                b.inputs[field](
                    options.data.model,
                    property,
                    inputOptions,
                    options.hash
                )
            );
        });
    });
}
