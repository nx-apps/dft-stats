var rpt = require('../../global/report');
exports.whiterice = function (req, res) {

    var monthArr = [];
    for (var i = Number(req.query.startMonth); i <= Number(req.query.endMonth); i++) {
        var n = (i < 10 ? '0' + i : i);
        monthArr.push(n)
    }
    req.jdbc.query("mssql", "exec sp_stats_rpt_custom_whiterice @month=?, @year=?, @zone=?", [monthArr.join(','), req.query.year, req.query.zone],
        function (err, data) {
            // res.send(data);
            // console.log(req.query.year)
            req.r.json(data).run().then(function (d2) {
                var param = {
                    date: req.query.date,
                    FILE_TYPE: req.query.export,
                    startMonth : rpt.getMonthName(Number(req.query.startMonth)),
                    endMonth : rpt.getMonthName(Number(req.query.endMonth)),
                    year : req.query.year,
                };
                param = rpt.keysToUpper(param);
                param.current_date = new Date().toISOString().slice(0, 10);
                param.OUTPUT_NAME = param.current_date.replace(/-/g, '') + '_ปริมาณและมูลค่าการส่งออกข้าวขาวของไทย'
                // console.log(param.OUTPUT_NAME)
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
    req.jdbc.query("mssql", "exec sp_stats_rpt_custom_rice @month=?, @year=?, @zone=?", [monthArr.join(','), req.query.year, req.query.zone],
        function (err, data) {
            // res.send(data);
            req.r.json(data).run().then(function (d2) {
                var param = {
                    date: req.query.date,
                    FILE_TYPE: req.query.export,
                };
                param.startMonth = rpt.getMonthName(Number(req.query.startMonth));
                param.endMonth = rpt.getMonthName(Number(req.query.endMonth));
                param.year = req.query.year;
                param.current_date = new Date().toISOString().slice(0, 10);
                param.OUTPUT_NAME = param.current_date.replace(/-/g, '') + '_ปริมาณและมูลค่าการส่งออกข้าวของไทย'
                param = rpt.keysToUpper(param);
                // res.json(param)
                res.ireport("custom/rpt_custom_export_rice.jasper", req.query.export || "pdf", d2, param)
                //     approveDate: req.query.date,
                //     FILE_TYPE: req.query.export,
                //     OUTPUT_NAME: params.current_date.replace(/-/g, '') + '_ปริมาณและมูลค่าการส่งออกข้าวของไทย'
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
    req.jdbc.query("mssql", "exec sp_stats_rpt_custom_hommali @month=?, @year=?, @zone=?", [monthArr.join(','), req.query.year, req.query.zone],
        function (err, data) {
            // res.send(data);
            req.r.json(data).run().then(function (d2) {
                var param = {
                    date: req.query.date,
                    FILE_TYPE: req.query.export,
                };
                param.startMonth = rpt.getMonthName(Number(req.query.startMonth));
                param.endMonth = rpt.getMonthName(Number(req.query.endMonth));
                param.year = req.query.year;
                param.current_date = new Date().toISOString().slice(0, 10);
                param.OUTPUT_NAME = param.current_date.replace(/-/g, '') + '_ปริมาณมูลค่าการส่งออกข้าวหอมมะลิไทย'
                param = rpt.keysToUpper(param);
                res.json(param)
                // res.ireport("custom/rpt_custom_export_hommalirice.jasper", req.query.export || "pdf", d2, param)
                //     approveDate: req.query.date,
                //     FILE_TYPE: req.query.export,
                //     OUTPUT_NAME: params.current_date.replace(/-/g, '') + '_ปริมาณและมูลค่าการส่งออกข้าวขาวของไทย'
                // });
            })
        })
}