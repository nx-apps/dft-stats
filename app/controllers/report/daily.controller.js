var rpt = require('../../global/report');
exports.dailyCompany = function (req, res) {

    req.jdbc.query("mssql", "exec sp_stats_rpt_daily_company @approveDate=?", [req.query.date], function (err, data) {
        // res.send(data);
        req.r.json(data).run().then(function (d2) {
            var params = {
                date: req.query.date
            };
            // params = rpt.keysToUpper(params);
            params.current_date = new Date().toISOString().slice(0, 10);
            // res.json(params)
            res.ireport("daily/rpt_daily_company.jasper", req.query.export || "pdf", d2, {
                approveDate: req.query.date,
                FILE_TYPE: req.query.export,
                OUTPUT_NAME: params.current_date.replace(/-/g, '') + '_รับแจ้งขายข้าว'
            });
        })
    })
}
exports.dailyCountry = function (req, res) {
    var j = req.jdbc;
    let time = new Date();
    var s = new Date(time.setHours(time.getHours() + 7)).toISOString().split('T')[0];
    var e = s;
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
            req.r.json(data).run().then(function (d2) {
                param.current_date = new Date().toISOString().slice(0, 10);
                param.OUTPUT_NAME = param.current_date.replace(/-/g, '') + '_ประเทศ ผู้นำเข้าข้าวรายใหญ่ของประเทศไทยตามแจ้งขายข้าว';
                param = rpt.keysToUpper(param);
                // res.send(param);
                // res.json(param)
                res.ireport("daily/rpt_daily_country.jasper", req.query.export || "pdf", d2, param);
            })
        })
}
exports.dailyPricerice = function (req, res) {

    req.jdbc.query("mssql", "exec sp_stats_rpt_daily_pricerice @approveDate=?", [req.query.date], function (err, data) {
        // res.send(data);
        req.r.json(data).run().then(function (d2) {
            var params = {
                date: req.query.date
            };
            // params = rpt.keysToUpper(params);
            params.current_date = new Date().toISOString().slice(0, 10);
            res.ireport("daily/rpt_daily_pricerice.jasper", req.query.export || "pdf", d2, {
                approveDate: req.query.date,
                FILE_TYPE: req.query.export,
                OUTPUT_NAME: params.current_date.replace(/-/g, '') + '_ราคาข้าวตามใบอนุญาต'
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
                OUTPUT_NAME: req.query.currentDate.replace(/-/g, '') + '_สรุปสถานการณ์ส่งออกข้าว',
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
            var params = {
                date: req.query.date
            };
            param = rpt.keysToUpper(param);
            param.current_date = new Date().toISOString().slice(0, 10);
            param.OUTPUT_NAME = param.current_date.replace(/-/g, '') + '_ข้อมูลส่งออกข้าว ต้นทุนและราคาข้าวชนิดต่างๆ';
            // res.json(param)
            res.ireport("daily/rpt_daily_cost.jasper", req.query.export || "pdf", datas, param);
        })
}
exports.dailyDit = function (req, res, next) {
    var params = {
        date: req.query.date
    };
    var date = req.query.date + "T00:00:00+07:00";
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
        return f('cost_date').inTimezone('+07').date().le(r.ISO8601(costDate))
            .and(f('cost_end').inTimezone('+07').date().ge(r.ISO8601(costDate)))
    });
    var init = r.expr(data)
        .merge(function (m) {
            return {
                date: "",
                prices: r.table('price')
                    .between(m('date_start'), m('date_end').add(1), { index: 'price_date' })
                    // .filter(function (f) {
                    //     return f('price_date').during(
                    //         m('date_start'), m('date_end'), { rightBound: 'closed' }
                    //     )
                    // })
                    .coerceTo('array').pluck('price_date', 'price_dit', 'rice_id').orderBy('rice_id')
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
            var key = r.branch(m('prices').ne([]), m('prices')(0).without('date', 'month', 'type', 'year').keys(), []);
            return r.branch(key.eq([]).or(m('type').eq('date')), {},
                key.map(function (m2) {
                    return [r.expr(m2), m('prices').avg(m2)]
                }).coerceTo('object')
            )
            //{
            // "rice_1": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_1'), 0),
            //}
        })
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
        .do(function (d) {
            var initDate = init.filter({ type: 'date' })(0).getField('prices');
            var key = r.branch(initDate.count().gt(0), initDate(0).without('date', 'month', 'type', 'year').keys(), []);
            return d.append(
                r.branch(key.eq([]), {},
                    key.map(function (m2) {
                        return [r.expr(m2), initDate.avg(m2)]
                    }).coerceTo('object')
                ).merge({
                    year: year + 543,
                    month: 'เฉลี่ย (เดือน)',
                    date: '',
                    type: 'month'
                })
            )
        })
        .run()
        .then(function (data) {
            params = rpt.keysToUpper(params);
            params.current_date = new Date().toISOString().slice(0, 10);
            params.OUTPUT_NAME = params.current_date.replace(/-/g, '') + '_ราคาข้าวสาร_เอฟ_โอ_บี_กรุงเทพ';
            // res.json(params)
            res.ireport("daily/rpt_daily_dit.jasper", req.query.export || "pdf", data, params);
        })
}
exports.dailyFob = function (req, res, next) {
    var params = {
        date: req.query.date
    };
    var date = req.query.date + "T00:00:00+07:00";

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
    var init = r.expr(data)
        .merge(function (m) {
            return {
                date: "",
                prices: r.branch(m('type').eq('date'), r.table('price')
                    .between(m('date_start'), m('date_end').add(1), { index: 'price_date' })
                    // .filter(function (f) {
                    //     return f('price_date').during(
                    //         m('date_start'), m('date_end'), { rightBound: 'closed' }
                    //     )
                    // })
                    .coerceTo('array').pluck('price_date', 'price_fob', 'rice_id')
                    .group('price_date').ungroup()
                    .map(function (m2) {
                        return m2('reduction').map(function (m3) {
                            return [r.expr('rice_').add(m3('rice_id').coerceTo('string')), m3('price_fob')]
                        }).coerceTo('object')
                            .merge({ date: m2('group').day(), month: 0, year: m2('group').year(), type: 'date' })
                    })
                    , [])
            }
        })
        // .merge(function (m) {
        //     var key = r.branch(m('prices').ne([]), m('prices')(0).without('date', 'month', 'type', 'year').keys(), []);
        //     return r.branch(key.eq([]).or(m('type').eq('date')), {},
        //         key.map(function (m2) {
        //             return [r.expr(m2), m('prices').avg(m2)]
        //         }).coerceTo('object')
        //     )
        // })
        .merge(function (m) {

            var dataMonth = r.branch(m('type').eq('month'),
                r.table('price')
                    .between(m('date_start'), m('date_end').add(1), { index: 'price_date' })
                    // .filter(function (f) {
                    //     return f('price_date').during(
                    //         m('date_start'), m('date_end'), { rightBound: 'closed' }
                    //     )
                    // })
                    .group('rice_id').avg('price_fob').ungroup(),
                []
            );
            var key = r.branch(dataMonth.count().eq(0), [], dataMonth.getField('group'));

            return r.branch(key.count().gt(0),
                key.map(function (m2) {
                    return [r.expr('rice_').add(m2.coerceTo('string')), dataMonth.filter({ group: m2 })(0)('reduction')]
                }).coerceTo('object'),
                {}
            )
        })
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
        .run()
        .then(function (data) {
            var initDate = r.expr(data).filter({ type: 'date', month: '' });
            var key = r.branch(initDate.count().gt(0), initDate(0).without('date', 'month', 'type', 'year').keys(), []);
            r.expr(data)
                .append(
                r.branch(key.eq([]), {}
                    , key.map(function (m2) {
                        return [r.expr(m2), initDate.avg(m2)]
                    }).coerceTo('object')
                )
                    .merge({
                        year: year + 543,
                        month: 'เฉลี่ย (เดือน)',
                        date: '',
                        type: 'month'
                    })
                )
                .run().then(function (data) {
                    var lastDate = data[data.length - 2];
                    params = rpt.keysToUpper(params);
                    params.LAST_DATE = year + "-" + (month < 10 ? "0" : "") + month + "-" + lastDate.date;
                    params.OUTPUT_NAME = params.LAST_DATE.replace(/-/g, '') + '_ราคาข้าวสารส่งออก_FOB_กรุงเทพ';
                    // res.json(data)
                    res.ireport("daily/rpt_daily_fob.jasper", req.query.export || "pdf", data, params);
                })


        })
}