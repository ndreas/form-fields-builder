var _ = require('lodash');

module.exports = function(b) {

    function field(model, field, content, attrs) {
        attrs = attrs || {};
        return b.html.tag('div', attrs, content)
    }

    function label(model, field, content, options) {
        var hasContent = _.isString(content);
        options = options || {};

        if (!hasContent) {
            options = _.defaults(content || options, { for: b.utils.domId(model, field) });
        }

        var text = options.label ||
            _.get(b, 'messages.label.' + b.utils.modelName(model) + '.' + field);
        delete options.label;

        if (!text && !hasContent) {
            return '';
        } else if (hasContent) {
            if (text) {
                text = content + ' ' + text
            } else {
                text = content;
            }
        }

        if (options.required) {
            text = text + b.components.required(model, field);
            delete options.required;
        }

        if (options.before) {
            text = options.before + text;
            delete options.before;
        }

        if (options.after) {
            text = text + options.after;
            delete options.after;
        }

        return b.html.tag('label', options, text);
    }

    function required(model, field, options) {
        options = _.defaults(options || {}, { class: 'required', title: b.messages.required.title });
        return b.html.tag('abbr', options, b.messages.required.text);
    }

    function hint(model, field, options) {
        options = _.defaults(options || {}, { class: 'hint' });
        var text = options.hint ||
            _.get(b, 'messages.hint.' + b.utils.modelName(model) + '.' + field);
        delete options.hint;

        if (text) {
            return b.html.tag('span', options, text)
        } else {
            return '';
        }
    }

    function error(model, field, errors, attrs) {
        attrs = _.defaults(attrs || {}, { class: 'errors' });

        var errorMessages = errors ? b.utils.errorMessages(field, errors) : null;

        if (errorMessages) {
            return b.html.tag('span', attrs, errorMessages.join('<br>'));
        } else {
            return '';
        }
    }

    return {
        label: label,
        required: required,
        field: field,
        hint: hint,
        error: error
    };
}
