module.exports = function (app) {
    var controller = require('../controllers/hamonize.controller')
    // app.get('/', controller.list)
    app.get('/codelist', controller.listha)
    app.get('/child', controller.child_code)
    app.get('/re01', controller.sp01)
    app.get('/ricelist', controller.rice_list)
    app.post('/get', controller.rice_get)
    // app.get('/re02', controller.sp02)
    // app.get('/sp01', controller.sp01)
    // app.get('/sp02', controller.sp02)

}