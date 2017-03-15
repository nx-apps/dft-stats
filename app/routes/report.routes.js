module.exports = function (app) {
    var controller = require('../controllers/report.controller')
    app.get('/h01', controller.h01)
}