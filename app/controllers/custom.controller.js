exports.zone = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT zone_name from custom_country group by zone_name`, [],
        function (err, data) {
            res.send(data)
        })
}
exports.year = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT model_year from custom group by model_year`, [],
        function (err, data) {
            res.send(data)
        })
}