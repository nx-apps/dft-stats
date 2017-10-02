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
exports.typericeGroup = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT typerice_name,hscode as value,hm.hamonize_th as label
    from custom_hscode ch
    join hamonize hm on hm.hamonize_code=ch.hscode and hm.hamonize_year=2017
    group by typerice_name,hscode,hm.hamonize_th
    order by typerice_name,hscode`, [],
        function (err, data) {
            data = JSON.parse(data);
            var arr = [];
            var temp = '';
            for (var i = 0; i < data.length; i++) {
                if (temp != data[i].typerice_name) {
                    arr.push({ group_name: data[i].typerice_name, group_item: [] })
                    temp = data[i].typerice_name
                }
                arr.filter((f) => f.group_name == data[i].typerice_name)[0].group_item.push(data[i])
            }
            res.json(arr)
        })
}
exports.typerice = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT hscode as value,hm.hamonize_th as label
    from custom_hscode ch
    join hamonize hm on hm.hamonize_code=ch.hscode and hm.hamonize_year=2017
    group by hscode,hm.hamonize_th
    order by hscode`, [],
        function (err, data) {
            res.send(data)
        })
}