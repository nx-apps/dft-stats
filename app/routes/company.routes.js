module.exports = function (app) {
    var controller = require('../controllers/company.controller')
    app.post('/', controller.list)
    app.post('/search', controller.search)
    app.get('/re01', controller.spp01)
    // app.get('/re02', controller.sp02)
    // app.get('/sp01', controller.sp01)
    // app.get('/sp02', controller.sp02)
}