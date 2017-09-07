var _ = require('lodash');

module.exports = function(b) {
    b.utils.modelName = function(model) {
        if (model.Model) {
            return model.Model.name;
        } else {
            return model.constructor.name;
        }
    }
    b.utils.errorMessages = function(field, errors) {
        if (!errors) return null;
        var errors = errors.get(field);

        if (errors && errors.length > 0) {
            return _.map(errors, 'message');
        }

        return null;
    }
}
