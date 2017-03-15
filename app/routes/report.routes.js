module.exports = function (app) {
    var controller = require('../controllers/report.controller')
    app.get('/hamonize01', controller.hamonize01)
}