module.exports = function (app) {
    var controller = require('../controllers/edi.controller');
    app.get('/hamonize', controller.getHamonize);
    app.get('/hamonize/group', controller.getHamonizeGroup);
    app.get('/company', controller.getCompany);
    app.get('/country', controller.getCountry);
    app.route('/search').get(controller.getSearch).post(controller.getSearch);
    app.route('/cert').get(controller.getCert).post(controller.getCert);
}