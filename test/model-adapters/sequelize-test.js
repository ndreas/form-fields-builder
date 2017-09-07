var Sequelize = require('sequelize');
var b = require('../..');

describe("Sequelize model adapter", function() {
    var modelV3 = { Model: { name: 'SequelizeV3Model' } };
    var modelV4 = { constructor: { name: 'SequelizeV4Model' } };

    before(function() {
        b.use({ model: 'sequelize' });
    });
    after(function() { b.reset(); });

    describe("utils.modelName()", function() {
        it("returns the model name of a Sequelize v3 model", function() {
            expect(b.utils.modelName(modelV3)).to.equal('SequelizeV3Model');
        });
        it("returns the model name of a Sequelize v4 model", function() {
            expect(b.utils.modelName(modelV4)).to.equal('SequelizeV4Model');
        });
    });

    describe("utils.errorMessages()", function() {
        var validationError = new Sequelize.ValidationError(null,
            [
                new Sequelize.ValidationErrorItem("Error #1", 'Validation error', 'field', "Err #1"),
                new Sequelize.ValidationErrorItem("Error #2", 'Validation error', 'field', "Err #2"),
                new Sequelize.ValidationErrorItem("Error #3", 'Validation error', 'other', "Err #3"),
            ]
        );
        it("returns the error messages from a Sequelize validation error for a given field", function() {
            expect(
                b.utils.errorMessages('field', validationError)
            ).to.deep.equal([ "Error #1", "Error #2" ]);
        });
        it("returns null when there are no errors", function() {
            expect(
                b.utils.errorMessages('none', validationError)
            ).not.to.be.ok;
        });
    });
});
