module.exports = function (app) {
    var controller = require('../controllers/upload.controller')
    app.post('/mc', controller.uploadMc)
}