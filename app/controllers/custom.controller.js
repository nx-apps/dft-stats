var rpt = require('../global/report');
exports.zone = function (req, res) {
    var j = req.jdbc;
    let where = '';
    if (Object.keys(req.query).length > 0) {
        let c = 0;
        for (var obj in req.query) {
            if (c > 0)
                where += ' and ';
            else
                where += ' where ';
            where += rpt.camel2UnderScore(obj) + " = '" + req.query[obj] + "'"
            c++;
        }
    }
    j.query("mssql", `SELECT zone_name,country_th as label,country_code as value,zone_order
    from custom 
    left join custom_country cc on custom.country2 = cc.country_code
    ${where}
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
    let where = '';
    if (Object.keys(req.query).length > 0) {
        let c = 0;
        for (var obj in req.query) {
            if (c > 0)
                where += ' and ';
            else
                where += ' where ';
            where += rpt.camel2UnderScore(obj) + " = '" + req.query[obj] + "'"
            c++;
        }
    }
    j.query("mssql", `SELECT country_th as label,country2 as value
    from custom 
    left join custom_country cc on custom.country2 = cc.country_code
    ${where}
    group by country_th,country2
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
exports.getSearch = function (req, res) {

    var val = (req.method == "GET" ? req.query : req.body);
    req.jdbc.query("mssql", `exec sp_stats_search_custom
    @tranType=?,
    @modelYear=?,
    @modelMonth=?,
    @field1=?,
    @field2=?,
    @hsCode=?,
    @countryCode=?`,
        [
            (typeof val.tranType === 'undefined' ? 'E' : val.tranType.toUpperCase()),
            val.modelYear, val.modelMonth || '00',
            val.field1 || 'hamonize',
            val.field2 || '',
            val.hsCode || '1006',
            val.countryCode || ''
        ],
        function (err, datas) {
            datas = JSON.parse(datas);
            if (datas.length == 0) res.json({ datas: [], header: {} });
            const haveCode = datas[0].hsCode === null || isNaN(datas[0].hsCode);
            const config = {
                lenMin: (haveCode ? 0 : datas[0].hsCode.length),
                lenMax: (haveCode ? 0 : datas[datas.length - 1].hsCode.length)
            };
            let arr = { datas: [], header: {} };
            for (let i = 0; i < datas.length; i++) {
                let data = {};
                if (config.lenMin > 0) {
                    let c = 0;
                    if (val.field1 == 'country') {
                        data['field' + c] = datas[i].field1;
                        if (i == 0) arr['header']['field' + c] = 'country';
                        c++;
                    }
                    for (let l = config.lenMin; l <= config.lenMax; l += 2) {
                        if (l == 10) l++;
                        if (l == datas[i].hsCode.length) data['field' + c] = datas[i].hsCode;
                        else data['field' + c] = '';
                        if (i == 0) arr['header']['field' + c] = 'hmcode' + l;
                        c++;
                    }
                    if (val.field1 != 'country') {
                        data['field' + c] = datas[i].field1;
                        if (i == 0) arr['header']['field' + c] = val.field1 || 'hamonize';
                        c++;
                    }
                    if (typeof val.field2 !== 'undefined') {
                        data['field' + c] = datas[i].field2;
                        if (i == 0) arr['header']['field' + c] = val.field2;
                        c++;
                    }
                } else {
                    data['field0'] = datas[i].field1;
                    if (i == 0) arr['header']['field0'] = 'country';
                }
                data['weight'] = datas[i].weight;
                data['value_b'] = datas[i].value_b;
                data['value_d'] = datas[i].value_d;
                data['hsCode'] = datas[i].hsCode;
                data['countryCode'] = datas[i].countryCode;
                arr['datas'].push(data);
            }
            res.json(arr);
        });
}