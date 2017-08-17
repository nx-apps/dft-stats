module.exports = function (app) {
    var controller = require('../../controllers/report/test.controller')

    app.get('/test',controller.test)
}