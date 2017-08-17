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
    var s = new Date(), e = new Date();
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
        cost: r.branch(costPrice.count().eq(0), null, costPrice(0).merge({ current_date: req.query.date })),
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
            // res.json(data['price'])
            var datas = data['price'];
            datas.push({
                typerice: 'อื่นๆ',
                rice_id: 99,
                price_dit: 0,
                price_fob: 0,
                price_thai: 0,
                price_paddy: 0,
                price_usa: 0,
                price_india: 0,
                price_vietnam: 0,
                price_pakistan: 0
            });
            res.ireport("daily/report2.jasper", req.query.export || "pdf", datas, param);
            // res.json(param)
        })
}
exports.dailyfob = function (req, res, next) {
    var data = [];
    var date = new Date(req.query.date);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var back = Number(req.query.back) - 1;
    var m = 12;
    for (var x = year - back; x <= year; x++) {
        if (x == year) {
            m = month;
        }
        for (var y = 1; y <= m; y++) {
            var checker = x == year && y == m;
            data.push({
                year: x,
                month: y,
                date_start: new Date(x, y - 1, 1),
                date_end: new Date(x, (checker ? y - 1 : y), (checker ? day : 0)),
                type: (checker ? 'date' : 'month')
            });
        }
    }
    var costDate = req.query.date + "T00:00:00+07:00";
    var costPrice = r.table('cost').filter(function (f) {
        return f('cost_date').inTimezone('+07').date().le(r.ISO8601('2017-08-02T00:00:00+07:00'))
            .and(f('cost_end').inTimezone('+07').date().ge(r.ISO8601('2017-08-02T00:00:00+07:00')))
    });
    var init = r.expr(data)
        .merge(function (m) {
            return {
                date: "",
                prices: r.table('price').filter(function (f) {
                    return f('price_date').during(
                        m('date_start'), m('date_end'), { rightBound: 'closed' }
                    )
                }).coerceTo('array').pluck('price_date', 'price_dit', 'rice_id').orderBy('rice_id')
                    .merge(function (m2) {
                        var cost = r.branch(costPrice.count().eq(0), 0,
                            m2('rice_id').eq(1).or(m2('rice_id').eq(2)), costPrice(0)('wfr_b'),
                            costPrice(0)('wr_b')
                        );
                        var rate = r.branch(costPrice.count().eq(0), 1, costPrice(0)('rate_bank'));
                        return {
                            price_dit: r.branch(m2('price_dit').eq(0), 0, r.round(m2('price_dit').add(cost).div(rate)))
                        }
                    })
                    .group('price_date').ungroup()
                    .map(function (m2) {
                        return m2('reduction').map(function (m3) {
                            return [r.expr('rice_').add(m3('rice_id').coerceTo('string')), m3('price_dit')]
                        }).coerceTo('object')
                            .merge({ date: m2('group').day(), month: 0, year: m2('group').year(), type: 'date' })
                    })

            }
        })
        .merge(function (m) {
            return {
                "rice_1": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_1'), 0),
                "rice_10": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_10'), 0),
                "rice_11": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_11'), 0),
                "rice_12": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_12'), 0),
                "rice_13": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_13'), 0),
                "rice_14": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_14'), 0),
                "rice_15": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_15'), 0),
                "rice_16": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_16'), 0),
                "rice_17": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_17'), 0),
                "rice_18": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_18'), 0),
                "rice_19": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_19'), 0),
                "rice_2": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_2'), 0),
                "rice_20": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_20'), 0),
                "rice_21": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_21'), 0),
                "rice_22": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_22'), 0),
                "rice_3": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_3'), 0),
                "rice_4": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_4'), 0),
                "rice_5": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_5'), 0),
                "rice_6": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_6'), 0),
                "rice_7": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_7'), 0),
                "rice_8": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_8'), 0),
                "rice_9": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_9'), 0)
            }
        });
    r.expr([init.without('prices')])
        .append(init.filter({ type: 'date' })(0).getField('prices').orderBy('date'))
        .reduce(function (left, right) {
            return left.add(right)
        })
        .merge(function (m) {
            return {
                month: rpt.getMonthNameRethink(m('month')),
                year: m('year').add(543)
            }
        })
        .append({
            year: year + 543,
            month: 'เฉลี่ยรายเดือน',
            date: '',
            type: 'month',
            "rice_1": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_1'), 0),
            "rice_10": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_10'), 0),
            "rice_11": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_11'), 0),
            "rice_12": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_12'), 0),
            "rice_13": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_13'), 0),
            "rice_14": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_14'), 0),
            "rice_15": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_15'), 0),
            "rice_16": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_16'), 0),
            "rice_17": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_17'), 0),
            "rice_18": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_18'), 0),
            "rice_19": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_19'), 0),
            "rice_2": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_2'), 0),
            "rice_20": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_20'), 0),
            "rice_21": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_21'), 0),
            "rice_22": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_22'), 0),
            "rice_3": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_3'), 0),
            "rice_4": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_4'), 0),
            "rice_5": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_5'), 0),
            "rice_6": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_6'), 0),
            "rice_7": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_7'), 0),
            "rice_8": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_8'), 0),
            "rice_9": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_9'), 0)
        })
        .run()
        .then(function (data) {
            // res.json(data)
            res.ireport("daily/report1.jasper", req.query.export || "pdf", data);
        })
}
