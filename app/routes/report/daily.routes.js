module.exports = function (app) {
    var controller = require('../../controllers/report/daily.controller')

    app.get('/company', controller.dailyCompany)
    app.get('/country', controller.dailyCountry)
    app.get('/pricerice', controller.dailyPricerice)
    app.get('/exportrice', controller.dailyExportrice)
    app.get('/cost',controller.dailyCost)
}