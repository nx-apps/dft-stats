var rpt = require('../global/report');
exports.zone = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT zone_name as value,zone_name as label from custom_country group by zone_name`, [],
        function (err, data) {
            res.send(data)
        })
}
exports.year = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT model_year as value,model_year as label from custom group by model_year`, [],
        function (err, data) {
            res.send(data)
        })
}
exports.month = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT model_month as value from custom where model_year = ? group by model_month`, [req.query.modelYear],
        function (err, data) {
            data = JSON.parse(data);
            for (var i = 0; i < data.length; i++) {
                data[i].label = rpt.getMonthName(Number(data[i]['value']))
            }
            res.json(data)
        })
}
exports.typerice = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT typerice_name as value,typerice_name as label from custom_hscode group by typerice_name`, [],
        function (err, data) {
            res.send(data)
        })
}