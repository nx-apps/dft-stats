module.exports = function (app) {
    var controller = require('../../controllers/report/search.controller')
    app.post('/hamonize', controller.hamonize)

}