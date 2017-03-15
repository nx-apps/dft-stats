module.exports = function (app) {
    var controller = require('../controllers/hamonize.controller')
    app.get('/', controller.list)
    app.get('/filter', controller.filter)
    app.get('/sp01', controller.sp01)
}