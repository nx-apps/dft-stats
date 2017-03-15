module.exports = function (app) {
    var controller = require('../controllers/company.controller')
    app.get('/', controller.list)
    app.get('/re01', controller.re01)
    app.get('/sp01', controller.sp01)
    app.get('/re02', controller.re02)
}