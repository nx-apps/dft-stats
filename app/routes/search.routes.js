module.exports = function (app) {
    var controller = require('../controllers/search.controller');
    app.post('/', controller.list);
    app.get('/', controller.list);
}