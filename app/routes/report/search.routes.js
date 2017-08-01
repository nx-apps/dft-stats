module.exports = function (app) {
    var controller = require('../../controllers/report/search.controller')
    app.route('/hamonize').get(controller.hamonize).post(controller.hamonize);
    app.route('/company').get(controller.company).post(controller.company);
    app.route('/referenceCode').get(controller.referenceCode).post(controller.referenceCode);

}