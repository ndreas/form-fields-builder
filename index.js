var _ = require('lodash');

var builder = module.exports = {};

builder.messages = {
    label: {},
    hint: {}
};

builder.reset = function() {
    builder.html = require('./lib/html')(builder);
    builder.utils = require('./lib/utils')(builder);
    builder.inputs = require('./lib/inputs')(builder);
    builder.components = require('./lib/components')(builder);
    builder.fields = require('./lib/fields')(builder);
}

builder.reset();

builder.use = function(definition) {
    _.map(definition, function(adapter, type) {
        require('./lib/' + type + '-adapters/' + adapter)(builder);
    });
}
