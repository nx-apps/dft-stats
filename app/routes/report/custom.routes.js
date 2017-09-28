module.exports = function (app) {
    var controller = require('../../controllers/report/custom.controller')

    app.get('/whiterice', controller.whiterice)
    app.get('/exportrice', controller.exportrice)
    app.get('/hommalirice', controller.hommalirice)
    app.get('/year',controller.year)
    
}