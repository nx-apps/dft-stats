var rpt = require('../../global/report');
exports.dailyCompany = function (req, res) {

    req.jdbc.query("mssql", "exec sp_stats_rpt_daily_company @approveDate=?", [req.query.date], function (err, data) {
        // res.send(data);
        req.r.json(data).run().then(function (d2) {
            res.ireport("daily/rpt_daily_company.jasper", req.query.export || "pdf", d2, { approveDate: req.query.date, FILE_TYPE: req.query.export });
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
        FILE_TYPE: req.query.export
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
                FILE_TYPE: req.query.export
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
exports.dailyCost = function (req, res) {
    var priceDate = req.query.date + 'T00:00:00+07:00';
    var costPrice = r.table('cost').filter(function (f) {
        return f('cost_date').inTimezone('+07').date().le(r.ISO8601(priceDate))
            .and(f('cost_end').inTimezone('+07').date().ge(r.ISO8601(priceDate)))
    });
    r.expr({
        cost: r.branch(costPrice.count().eq(0), null, costPrice(0)),
        price: r.table('price').getAll(r.ISO8601(priceDate), { index: 'price_date' })
            .filter(function (f) {
                return r.expr([2, 3, 4, 7, 8, 9, 11, 12, 15, 17, 18, 22]).contains(f('rice_id'))
            })
            .orderBy('rice_id')
            .coerceTo('array')
    })
        .merge(function (m) {
            return {
                price: m('price').merge(function (m2) {
                    var costPrice = r.branch(m('cost').eq(null), 0,
                        m2('rice_id').eq(2), m('cost')('wfr_b'),
                        m('cost')('wr_b')
                    );
                    var divPrice = r.branch(m('cost').eq(null), 1, m('cost')('rate_bank'));
                    return {
                        price_dit: r.branch(m2('price_dit').eq(0), 0, r.round(m2('price_dit').add(costPrice).div(divPrice))),
                        price_thai: r.branch(m2('price_thai').eq(0), 0, r.round(m2('price_thai').add(costPrice).div(divPrice)))
                    }
                })
            }
        })
        .run()
        .then(function (data) {
            var param = rpt.keysToUpper(data['cost']);
            res.json(data['price'])
            // res.json(param)
        })
}