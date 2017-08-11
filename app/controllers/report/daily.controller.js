exports.dailyCompany = function (req, res) {

    req.jdbc.query("mssql", "exec sp_stats_rpt_daily_company @approveDate=?", [req.query.date], function (err, data) {
        // res.send(data);
        req.r.json(data).run().then(function (d2) {
            res.ireport("daily/rpt_daily_company.jasper", req.query.export || "pdf", d2, { approveDate: req.query.date,FILE_TYPE:req.query.export });
        })
    })
}
exports.dailyCountry = function (req, res) {
    var j = req.jdbc;
    var s = today, e = tomorrow;
    if (typeof req.query.sdate !== "undefined") {
        s = req.query.sdate
    }
    if (typeof req.query.edate !== "undefined") {
        e = req.query.edate
    }
    var param = {
        sdate: new Date(s).getFullYear() + "-" + (new Date(s).getMonth() + 1) + "-" + new Date(s).getDate(),
        edate: new Date(e).getFullYear() + "-" + (new Date(e).getMonth() + 1) + "-" + new Date(e).getDate(),
        FILE_TYPE:req.query.export
    };
    j.query("mssql", "exec sp_stats_rpt_daily_country @startDate=?, @endDate=?", [s, e],
        function (err, data) {
            // res.send(data);
            req.r.json(data).run().then(function (d2) {
                res.ireport("daily/rpt_daily_country.jasper", req.query.export || "pdf", d2, param);
            })
        })
}
exports.dailyPricerice = function (req, res) {

    req.jdbc.query("mssql", "exec sp_stats_rpt_daily_pricerice @approveDate=?", [req.query.date], function (err, data) {
        // res.send(data);
        req.r.json(data).run().then(function (d2) {
            res.ireport("daily/rpt_daily_pricerice.jasper", req.query.export || "pdf", d2, { 
                approveDate: req.query.date,
                FILE_TYPE:req.query.export
            });
        })
    })
}
exports.dailyExportrice = function (req, res) {
    var refData = (req.query.refData == 'edi' ? 'ใบอนุญาตส่งออกข้าว' : 'กรมศุลกากร');
    req.jdbc.query("mssql", "exec sp_stats_rpt_daily_exportrice @currentDate=?, @amountTime=?",
        [req.query.currentDate, req.query.amountTime],
        function (err, data) {
            data = JSON.parse(data)
            // res.send(data);
            // req.r.json(data)
            // .run().then(function (d2) {
            res.ireport("daily/rpt_daily_exportrice.jasper", req.query.export || "pdf", data, {
                OUTPUT_NAME: 'สรุปสถานการณ์ส่งออกข้าว' + req.query.currentDate.replace('-', '_'),
                CURRENT_DATE: req.query.currentDate,
                REF_DATA: refData
            });
            // })
        })
}