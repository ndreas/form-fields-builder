var _ = require('lodash');

module.exports = function(b) {
    function tag(name) {
        var content = null,
            attributes = {};

        for (var i = 1; i <= 2; i++) {
            var a = arguments[i];
            if (a !== undefined && a !== null && a !== false) {
                if (_.isPlainObject(a)) {
                    attributes = a;
                } else {
                    content = a;
                }
            }
        }

        var tag = '<' + name;

        tag += _.map(attributes, function(value, key) {
            if (value === null || value === undefined) {
                return '';
            } else if (value === true) {
                return ' ' + key;
            } else {
                return ' ' + key + '="' + b.html.escape(value) + '"';
            }
        }, this).join('');

        if (content !== null && content !== undefined && content !== false) {
            tag += '>' + content + '</' + name;
        }

        return tag + '>';
    }

    function escape(str) {
        if (!str) {
            return '';
        }

        str = String(str);

        return /[&<>\"\']/.test(str)
            ? str
            .replace(/&/g,'&amp;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;')
            .replace(/\'/g,'&#39;')
            .replace(/\"/g, '&quot;')
                : str;
    };

    return {
        tag: tag,
        escape: escape
    };
}
