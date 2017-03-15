module.exports = function (app) {
    var controller = require('../controllers/hamonize.controller')
    app.get('/', controller.list)
    app.get('/re01', controller.re01)
    app.get('/sp01', controller.sp01)
}