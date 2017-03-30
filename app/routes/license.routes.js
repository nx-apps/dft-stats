module.exports = function (app) {
    var controller = require('../controllers/license.controller')
    app.get('/re01', controller.sp01)
    app.get('/re02/:code', controller.sp02)
    app.get('/sp01', controller.sp01)
    app.get('/sp02/:code', controller.sp02)
}