module.exports = function(b) {

    var re = {
        uppercase: /([A-Z])/g,
        snakespace: /[_ ]+/g,
        cleanup: /^-+|-+$|[^-a-zA-Z0-9]/g
    }

    function toSpinal(str) {
        if (!str) return '';
        return str.
            replace(re.uppercase, ' $1').
            replace(re.snakespace, '-').
            replace(re.cleanup, '');
    }

    function modelName(model) {
        return typeof(model);
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
        modelName: modelName,
        domId: domId,
        inputName: inputName
    }
}
