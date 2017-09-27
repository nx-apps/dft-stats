var rpt = require('../../global/report');
exports.whiterice = function (req, res) {

    var monthArr = [];
    for (var i = Number(req.query.startMonth); i <= Number(req.query.endMonth); i++) {
        var n = (i < 10 ? '0' + i : i);
        monthArr.push(n)
    }
    req.jdbc.query("mssql", "exec sp_stats_rpt_custom_export_whiterice @month=?, @year=?, @zone=?", [monthArr.join(','), req.query.year, req.query.zone],
        function (err, data) {
            // res.send(data);
            // console.log(req.query.year)
            req.r.json(data).run().then(function (d2) {
                var param = {
                    date: req.query.date
                };
                param.startMonth = rpt.getMonthName(Number(req.query.startMonth));
                param.endMonth = rpt.getMonthName(Number(req.query.endMonth));
                param.year = req.query.year;
                param.current_date = new Date().toISOString().slice(0, 10);
                param = rpt.keysToUpper(param);
                // res.json(param)
                res.ireport("custom/rpt_custom_export_whiterice.jasper", req.query.export || "pdf", d2, param)
                //     approveDate: req.query.date,
                //     FILE_TYPE: req.query.export,
                //     OUTPUT_NAME: params.current_date.replace(/-/g, '') + '_ปริมาณและมูลค่าการส่งออกข้าวขาวของไทย'
                // });
            })
        })
}
exports.exportrice = function (req, res) {

    var monthArr = [];
    for (var i = Number(req.query.startMonth); i <= Number(req.query.endMonth); i++) {
        var n = (i < 10 ? '0' + i : i);
        monthArr.push(n)
    }
    req.jdbc.query("mssql", "exec sp_stats_rpt_custom_export_rice @month=?, @year=?, @zone=?", [monthArr.join(','), req.query.year, req.query.zone],
        function (err, data) {
            // res.send(data);
            req.r.json(data).run().then(function (d2) {
                var param = {
                    date: req.query.date
                };
                param.startMonth = rpt.getMonthName(Number(req.query.startMonth));
                param.endMonth = rpt.getMonthName(Number(req.query.endMonth));
                param.year = req.query.year;
                param.current_date = new Date().toISOString().slice(0, 10);
                param = rpt.keysToUpper(param);
                // res.json(param)
                res.ireport("custom/rpt_custom_export_rice.jasper", req.query.export || "pdf", d2, param)
                //     approveDate: req.query.date,
                //     FILE_TYPE: req.query.export,
                //     OUTPUT_NAME: params.current_date.replace(/-/g, '') + '_ปริมาณและมูลค่าการส่งออกข้าวขาวของไทย'
                // });
            })
        })
}
exports.hommalirice = function (req, res) {

    var monthArr = [];
    for (var i = Number(req.query.startMonth); i <= Number(req.query.endMonth); i++) {
        var n = (i < 10 ? '0' + i : i);
        monthArr.push(n)
    }
    req.jdbc.query("mssql", "exec sp_stats_rpt_custom_export_thaihommalirice @month=?, @year=?, @zone=?", [monthArr.join(','), req.query.year, req.query.zone],
        function (err, data) {
            // res.send(data);
            req.r.json(data).run().then(function (d2) {
                var param = {
                    date: req.query.date
                };
                param.startMonth = rpt.getMonthName(Number(req.query.startMonth));
                param.endMonth = rpt.getMonthName(Number(req.query.endMonth));
                param.year = req.query.year;
                param.current_date = new Date().toISOString().slice(0, 10);
                param = rpt.keysToUpper(param);
                // res.json(param)
                res.ireport("custom/rpt_custom_export_hommalirice.jasper", req.query.export || "pdf", d2, param)
                //     approveDate: req.query.date,
                //     FILE_TYPE: req.query.export,
                //     OUTPUT_NAME: params.current_date.replace(/-/g, '') + '_ปริมาณและมูลค่าการส่งออกข้าวขาวของไทย'
                // });
            })
        })
}