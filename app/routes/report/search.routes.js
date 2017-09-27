module.exports = function (app) {
    var controller = require('../../controllers/report/search.controller')

    app.route('/expt').get(controller.expt).post(controller.expt);
    app.route('/impt').get(controller.impt).post(controller.impt);
    app.route('/ec').get(controller.ec).post(controller.ec);
    app.get('/company', controller.company);
    app.get('/hamonize', controller.hamonize);
    app.get('/country', controller.country);
    app.route('/').get(controller.threeinone).post(controller.threeinone);
}