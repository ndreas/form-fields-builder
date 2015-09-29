var _ = require('lodash');

module.exports = function(b) {

    var re = {
        uppercase: /([A-Z])/g,
        snakespace: /[_ ]+/g,
        cleanup: /^-+|-+$|[^-a-zA-Z0-9]/g
    }

    function toSpinal(str) {
        if (!str) return '';
        return str.
            toString().
            replace(re.uppercase, ' $1').
            replace(re.snakespace, '-').
            replace(re.cleanup, '');
    }

    function extractOptions(object, options) {
        if (_.isEmpty(object)) return options;

        return _.forIn(options, function(value, key, options) {
            var opt = object[key];
            if (opt) {
                options[key] = opt;
                delete object[key];
            }
        });
    }

    function modelName(model) {
        return typeof(model);
    }

    function errorMessages(field, errors) {
        if (!errors) return null;

        var errors = errors[field];

        if (_.isArray(errors)) {
            return errors;
        } else if (errors) {
            return [errors];
        }
    }

    function domId(model, field, value) {
        var modelName = b.utils.modelName(model);
        var id = toSpinal(modelName) + '-' + toSpinal(field);

        if (value) id += '-' + toSpinal(value)
        return id.toLowerCase();
    }

    function inputName(model, field) {
        var modelName = b.utils.modelName(model);
        return modelName.charAt(0).toLowerCase() + modelName.slice(1) + '[' + field + ']';
    }

    return {
        extractOptions: extractOptions,
        modelName: modelName,
        errorMessages: errorMessages,
        domId: domId,
        inputName: inputName
    }
}
