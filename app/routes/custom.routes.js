module.exports = function (app) {
    var controller = require('../controllers/custom.controller');
    app.get('/zone', controller.zone);
    app.get('/country', controller.country);
    app.get('/year', controller.year);
    app.get('/month', controller.month);
    app.get('/typerice/group', controller.typericeGroup);
    app.get('/typerice', controller.typerice);
}