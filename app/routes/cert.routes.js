module.exports = function (app) {
    var controller = require('../controllers/cert.controller')
    app.route('/get').get(controller.get).post(controller.get);
    // app.get('/re02/:code', controller.sp02)
    // app.get('/sp01', controller.sp01)
    // app.get('/sp02/:code', controller.sp02)
}