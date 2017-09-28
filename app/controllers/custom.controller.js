exports.zone = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT zone_name as zone from custom_country group by zone_name`, [],
        function (err, data) {
            res.send(data)
        })
}
exports.year = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT model_year as modelYear from custom group by model_year`, [],
        function (err, data) {
            res.send(data)
        })
}
exports.month = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT model_month as modelMonth from custom where model_year = ? group by model_month`, [req.query.modelYear],
        function (err, data) {
            res.send(data)
        })
}