module.exports = function (app) {
    var controller = require('../controllers/json.controller');
    app.get('/head', controller.head);
    app.get('/data', controller.data);
    app.get('/form', controller.form);
    app.get('/product', controller.product);
}