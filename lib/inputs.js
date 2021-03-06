var _ = require('lodash');

module.exports = function(b) {
    function equals(value) {
        return function(v) {
            return value == v;
        }
    }

    function stringify(value) {
        if (value === null || value === undefined) {
            return "";
        } else {
            return value.toString();
        }
    }

    function input(model, field, attrs) {
        attrs = _.defaults(attrs || {}, {
            id: b.utils.domId(model, field),
            name: b.utils.inputName(model, field),
            value: stringify(model[field])
        });

        return b.html.tag('input', attrs);
    }

    function textarea(model, field, attrs) {
        attrs = _.defaults(attrs || {}, {
            id: b.utils.domId(model, field),
            name: b.utils.inputName(model, field)
        });

        return b.html.tag('textarea', attrs, b.html.escape(stringify(model[field])));
    }

    function select(model, field, content, attrs) {
        attrs = _.defaults(attrs || {}, {
            id: b.utils.domId(model, field),
            name: b.utils.inputName(model, field)
        });

        if (_.isObject(content) || _.isArray(content)) {
            content = selectoptions(content, model[field]);
        }

        return b.html.tag('select', attrs, content);
    }
    function selectoptions(options, selected) {
        var arrayOptions = _.isArray(options);

        return _.map(options, function(text, value) {
            if (arrayOptions) {
                value = text[0];
                text = text[1];
            }

            var attrs = { value: stringify(value) };

            if (_.isArray(selected) && _.some(selected, equals(value)) || value == selected) {
                attrs.selected = true;
            }

            return b.html.tag('option', attrs, text);
        }).join('');
    }

    function checkbox(model, field, value, attrs, multiple) {
        attrs = _.defaults(attrs || {}, {
            id: b.utils.domId(model, field, (multiple ? value : undefined)),
            name: b.utils.inputName(model, field) + (multiple ? '[]' : ''),
            type: 'checkbox',
            value: stringify(value)
        });

        if (multiple && _.some(model[field], equals(value)) || !multiple && model[field] == value) {
            attrs.checked = true;
        }

        return b.html.tag('input', attrs);
    }

    function radio(model, field, value, attrs) {
        attrs = _.defaults(attrs || {}, {
            id: b.utils.domId(model, field, value),
            name: b.utils.inputName(model, field),
            type: 'radio',
            value: stringify(value)
        });

        if (model[field] == value) {
            attrs.checked = true;
        }

        return b.html.tag('input', attrs);
    }

    var m = {
        input: input,
        textarea: textarea,
        select: select,
        selectoptions: selectoptions,
        checkbox: checkbox,
        radio: radio
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
        m[type] = function(model, field, attrs) {
            attrs = _.defaults(attrs || {}, { type: type });
            return input(model, field, attrs);
        }
    });

    return m;
}
