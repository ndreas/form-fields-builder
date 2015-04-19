var _ = require('lodash');

module.exports = function(b) {
    b.utils.modelName = function(model) {
        return model.Model.name;
    }
    b.utils.errorMessages = function(field, errors) {
        if (!errors) return null;
        var errors = errors.get(field);

        if (errors && errors.length > 0) {
            return _.pluck(errors, 'message');
        }

        return null;
    }
}
