var builder = module.exports = {};

builder.html = require('./lib/html')(builder);
builder.utils = require('./lib/utils')(builder);
builder.inputs = require('./lib/inputs')(builder);
builder.components = require('./lib/components')(builder);

builder.messages = {
    label: {},
    hint: {}
};
