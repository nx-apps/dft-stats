module.exports = function (app) {
    var controller = require('../../../controllers/report/edi/daily.controller')

    app.get('/company', controller.dailyCompany)
    app.get('/country', controller.dailyCountry)
    app.get('/pricerice', controller.dailyPricerice)
    app.get('/exportrice', controller.dailyExportrice)
    app.get('/cost',controller.dailyCost)
    app.get('/dit',controller.dailyDit)
    app.get('/fob',controller.dailyFob)
}