module.exports = function (app) {
    var controller = require('../../controllers/report/custom.controller')

    app.get('/exportrice', controller.exportrice)
    
}