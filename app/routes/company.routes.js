module.exports = function (app) {
    var controller = require('../controllers/company.controller')
    app.post('/', controller.list)
    app.post('/search', controller.search)
    app.get('/re01', controller.spp01)
}