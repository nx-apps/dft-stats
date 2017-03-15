module.exports = function (app) {
    var controller = require('../controllers/hamonize.controller');
    app.get('/', controller.list);
}