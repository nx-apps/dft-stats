module.exports = function (app) {
    var controller = require('../controllers/report.controller')
    app.get('/h01', controller.h01)
    //app.get('/h02', controller.h02)
    app.get('/c01', controller.c01)
    // app.get('/c02', controller.c02)
    app.get('/li01', controller.li01)
    //  app.get('/li02/:code', controller.li02)
    app.get('/ce01', controller.ce01)
    //  app.get('/ce02/:code', controller.ce02)
    app.get('/daily/company', controller.dailyCompany)
}