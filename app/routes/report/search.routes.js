module.exports = function (app) {
    var controller = require('../../controllers/report/search.controller')
    app.route('/hamonize').get(controller.hamonize).post(controller.hamonize);
    app.route('/company').get(controller.company).post(controller.company);

}