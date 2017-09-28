module.exports=function(app){
    var controller = require('../controllers/custom.controller');
    app.get('/zone',controller.zone);
}