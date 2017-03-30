module.exports = function (app) {
    var controller = require('../controllers/json.controller');
    app.get('/echead', controller.echead);
    app.get('/ichead', controller.ichead);
    app.get('/lchead', controller.lchead);
    app.get('/cthead', controller.cthead);
    app.get('/data', controller.data);
    app.get('/form', controller.form);
    app.get('/product', controller.product);
    app.get('/hamonize', controller.hamonize);
    app.get('/hamonize2SQ', controller.hamonize2SQ);
    app.get('/company', controller.company);
    app.get('/agent', controller.agent);
}