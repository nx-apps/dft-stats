module.exports = function (app) {
    var controller = require('../controllers/price.controller')
    app.get('/today', controller.today)

}