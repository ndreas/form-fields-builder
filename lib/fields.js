var _ = require('lodash');

module.exports = function(b) {
    var m = {};

    function notImplemented() {
        throw new Error("Not implemented");
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
        'textarea',
        'select',
        'checkbox',
        'checkboxes',
        'radios'
    ], function(field) { m[field] = notImplemented; });

    m.hidden = b.inputs.hidden;

    return m;
}
