module.exports = function (app) {
    var controller = require('../../controllers/report/custom.controller')

    app.get('/whiterice', controller.whiterice)
    app.get('/allrice', controller.exportrice)
    app.get('/hommali', controller.hommalirice)
    app.get('/year',controller.year)
    app.get('/search', controller.getSearch)
    app.get('/exportrice', controller.dailyExportrice)

    
}