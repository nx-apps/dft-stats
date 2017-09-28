module.exports = function (app) {
    var controller = require('../controllers/custom.controller');
    app.get('/zone', controller.zone);
    app.get('/year', controller.year);
    app.get('/month', controller.month);
}