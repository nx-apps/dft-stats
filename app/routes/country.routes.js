module.exports = function (app) {
    var controller = require('../controllers/country.controller')
    app.get('/',controller.getCountry);
    app.get('/list', controller.list)
    app.post('/search', controller.search)
}