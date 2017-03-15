module.exports = function (app) {
    var controller = require('../controllers/license.controller')
    app.get('/re01', controller.re01)
}