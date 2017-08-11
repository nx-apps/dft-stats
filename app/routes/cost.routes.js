module.exports = function (app) {
    var controller = require('../controllers/cost.controller');
    app.get('/today', controller.today);
    app.put('/update', controller.update);
}