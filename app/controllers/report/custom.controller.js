var rpt = require('../../global/report');
exports.whiterice = function (req, res) {

    req.jdbc.query("mssql", "exec sp_stats_rpt_custom_whiterice @month=?, @year=?, @zone=?", [req.query.modelMonth, req.query.modelYear, req.query.zoneName],
        function (err, data) {
            // res.send(data);
            // console.log(req.query.year)
            data = JSON.parse(data);
            var param = {
                date: req.query.date,
                FILE_TYPE: req.query.export,
                startMonth: rpt.getMonthName(1),
                endMonth: rpt.getMonthName(Number(req.query.modelMonth)),
                year: req.query.modelYear,
            };
            param = rpt.keysToUpper(param);
            param.current_date = new Date().toISOString().slice(0, 10);
            param.OUTPUT_NAME = param.current_date.replace(/-/g, '') + '_ปริมาณและมูลค่าการส่งออกข้าวขาวของไทย'
            res.ireport("custom/rpt_custom_export_whiterice.jasper", req.query.export || "pdf", data, param)
        })
}
exports.exportrice = function (req, res) {

    // var monthArr = [];
    // for (var i = Number(req.query.startMonth); i <= Number(req.query.endMonth); i++) {
    //     var n = (i < 10 ? '0' + i : i);
    //     monthArr.push(n)
    // }
    req.jdbc.query("mssql", "exec sp_stats_rpt_custom_rice @month=?, @year=?, @zone=?", [req.query.modelMonth, req.query.modelYear, req.query.zoneName],
        function (err, data) {
            // res.send(data);
            data = JSON.parse(data);
            var param = {
                date: req.query.date,
                FILE_TYPE: req.query.export,
            };
            param.startMonth = rpt.getMonthName(1);
            param.endMonth = rpt.getMonthName(Number(req.query.modelMonth));
            param.year = req.query.modelYear;
            param.current_date = new Date().toISOString().slice(0, 10);
            param.OUTPUT_NAME = param.current_date.replace(/-/g, '') + '_ปริมาณและมูลค่าการส่งออกข้าวของไทย'
            param = rpt.keysToUpper(param);
            // res.json(param)
            res.ireport("custom/rpt_custom_export_rice.jasper", req.query.export || "pdf", data, param)
            //     approveDate: req.query.date,
            //     FILE_TYPE: req.query.export,
            //     OUTPUT_NAME: params.current_date.replace(/-/g, '') + '_ปริมาณและมูลค่าการส่งออกข้าวของไทย'
            // });
        })
}
exports.hommalirice = function (req, res) {

    // var monthArr = [];
    // for (var i = Number(req.query.startMonth); i <= Number(req.query.endMonth); i++) {
    //     var n = (i < 10 ? '0' + i : i);
    //     monthArr.push(n)
    // }
    req.jdbc.query("mssql", "exec sp_stats_rpt_custom_hommali @month=?, @year=?, @zone=?", [req.query.modelMonth, req.query.modelYear, req.query.zoneName],
        function (err, data) {
            // res.send(data);
            data = JSON.parse(data);
            var param = {
                date: req.query.date,
                FILE_TYPE: req.query.export,
            };
            param.startMonth = rpt.getMonthName(1);
            param.endMonth = rpt.getMonthName(Number(req.query.modelMonth));
            param.year = req.query.modelYear;
            param.current_date = new Date().toISOString().slice(0, 10);
            param.OUTPUT_NAME = param.current_date.replace(/-/g, '') + '_ปริมาณมูลค่าการส่งออกข้าวหอมมะลิไทย'
            param = rpt.keysToUpper(param);
            // res.json(param)
            res.ireport("custom/rpt_custom_export_hommalirice.jasper", req.query.export || "pdf", data, param)
            //     approveDate: req.query.date,
            //     FILE_TYPE: req.query.export,
            //     OUTPUT_NAME: params.current_date.replace(/-/g, '') + '_ปริมาณและมูลค่าการส่งออกข้าวขาวของไทย'
            // });

        })
}
exports.year = function (req, res) {
    // res.json(req.query)
    req.jdbc.query("mssql", "exec sp_stats_rpt_custom_year @modelMonth=?, @modelYear=?, @backYear=?,@zone=?",
        [req.query.modelMonth, req.query.modelYear, req.query.backYear || '1', req.query.zoneName || ''],
        function (err, data) {
            data = JSON.parse(data);
            var param = {
                date: req.query.date,
                FILE_TYPE: req.query.export,
                year_0: req.query.modelYear,
                year_1: Number(req.query.modelYear) - 1
            };
            if (typeof req.query.backYear !== 'undefined' && Number(req.query.backYear) > 1) {
                for (var i = 2; i <= Number(req.query.backYear); i++) {
                    param['year_' + i] = Number(req.query.modelYear) - i;
                }
            }
            param.startMonth = rpt.getMonthName(1);
            param.endMonth = rpt.getMonthName(Number(req.query.modelMonth));
            param.year = req.query.modelYear;
            param.current_date = new Date().toISOString().slice(0, 10);
            param.OUTPUT_NAME = param.current_date.replace(/-/g, '') + '_ปริมาณการส่งออกข้าวไทยรายปี'
            param = rpt.keysToUpper(param);
            // res.json(param);
            res.ireport("custom/rpt_custom_year1.jasper", req.query.export || "pdf", data, param)

        });
}
