module.exports = function (app) {
    var controller = require('../../controllers/report/search.controller')
    app.route('/hamonize').get(controller.hamonize).post(controller.hamonize);
    app.route('/company').get(controller.company).post(controller.company);
    app.route('/expt').get(controller.expt).post(controller.expt);
    app.route('/impt').get(controller.impt).post(controller.impt);
    app.route('/ec').get(controller.ec).post(controller.ec);
}