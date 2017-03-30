module.exports = function (app) {
    var controller = require('../controllers/company.controller')
    app.get('/', controller.list)
    app.get('/re01', controller.sp01)
    app.get('/re02', controller.sp02)
    app.get('/sp01', controller.sp01)
    app.get('/sp02', controller.sp02)
}