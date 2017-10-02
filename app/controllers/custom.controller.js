var rpt = require('../global/report');
exports.zone = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT zone_name,country_th as label,country_code as value,zone_order
    from custom_country
    group by zone_name,country_th,country_code,zone_order
    order by zone_order,country_th`, [],
        function (err, data) {
            data = JSON.parse(data);
            var arr = [];
            var temp = '';
            for (var i = 0; i < data.length; i++) {
                if (temp != data[i].zone_name) {
                    arr.push({ group_name: data[i].zone_name, group_item: [] })
                    temp = data[i].zone_name
                }
                arr.filter((f) => f.group_name == data[i].zone_name)[0].group_item.push(data[i])
            }
            res.json(arr)
        })
}
exports.country = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT country_th as label,country_code as value
    from custom_country
    group by country_th,country_code
    order by country_th`, [],
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
exports.hamonize = function (req, res) {
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