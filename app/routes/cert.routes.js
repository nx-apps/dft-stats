module.exports = function (app) {
    var controller = require('../controllers/cert.controller')
    app.get('/re01', controller.re01)
    app.get('/re02/:code', controller.re02)
}