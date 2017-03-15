module.exports = function (app) {
    var controller = require('../controllers/report.controller')
    app.get('/h01', controller.h01)
    app.get('/li01', controller.li01)
}