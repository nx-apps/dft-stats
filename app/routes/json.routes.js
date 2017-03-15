module.exports = function (app) {
    var controller = require('../controllers/json.controller');
    app.get('/echead', controller.echead);
    app.get('/ichead', controller.ichead);
    app.get('/data', controller.data);
    app.get('/form', controller.form);
    app.get('/product', controller.product);
    app.get('/hamonize', controller.hamonize);
}