var rpt = require('../../global/report');

exports.test = function (req, res, next) {
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
    // var costDate = req.query.date + "T00:00:00+07:00";
    // var costPrice = r.table('cost').filter(function (f) {
    //     return f('cost_date').inTimezone('+07').date().le(r.ISO8601('2017-08-02T00:00:00+07:00'))
    //         .and(f('cost_end').inTimezone('+07').date().ge(r.ISO8601('2017-08-02T00:00:00+07:00')))
    // });
    var init = r.expr(data)
        .merge(function (m) {
            return {
                date: "",
                prices: r.table('price').filter(function (f) {
                    return f('price_date').during(
                        m('date_start'), m('date_end'), { rightBound: 'closed' }
                    )
                }).coerceTo('array').pluck('price_date', 'price_fob', 'rice_id').orderBy('rice_id')
                    .group('price_date').ungroup()
                    .map(function (m2) {
                        return m2('reduction').map(function (m3) {
                            return [r.expr('rice_').add(m3('rice_id').coerceTo('string')), m3('price_fob')]
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
            var lastDate = data[data.length - 2];
            params = rpt.keysToUpper(params);
            params.LAST_DATE = year + "-" + (month < 10 ? "0" : "") + month + "-" + lastDate.date;
            params.OUTPUT_NAME = params.LAST_DATE.replace(/-/g, '') + '_ราคาข้าวสารส่งออก_FOB_กรุงเทพ';
            // res.json(params)
            res.ireport("daily/rpt_daily_fob.jasper", req.query.export || "pdf", data, params);
        })
}
// exports.dailyFob = function (req, res, next) {
//     var params = {
//         date: req.query.date
//     };
//     var date = req.query.date + "T00:00:00+07:00";

//     var data = [];
//     var date = new Date(req.query.date);
//     var day = date.getDate();
//     var month = date.getMonth() + 1;
//     var year = date.getFullYear();
//     var back = Number(req.query.back) - 1;
//     var m = 12;
//     for (var x = year - back; x <= year; x++) {
//         if (x == year) {
//             m = month;
//         }
//         for (var y = 1; y <= m; y++) {
//             var checker = x == year && y == m;
//             data.push({
//                 year: x,
//                 month: y,
//                 date_start: new Date(x, y - 1, 1),
//                 date_end: new Date(x, (checker ? y - 1 : y), (checker ? day : 0)),
//                 type: (checker ? 'date' : 'month')
//             });
//         }
//     }
//     // var costDate = req.query.date + "T00:00:00+07:00";
//     // var costPrice = r.table('cost').filter(function (f) {
//     //     return f('cost_date').inTimezone('+07').date().le(r.ISO8601('2017-08-02T00:00:00+07:00'))
//     //         .and(f('cost_end').inTimezone('+07').date().ge(r.ISO8601('2017-08-02T00:00:00+07:00')))
//     // });
//     var init = r.expr(data)
//         .merge(function (m) {
//             return {
//                 date: "",
//                 prices: r.table('price').filter(function (f) {
//                     return f('price_date').during(
//                         m('date_start'), m('date_end'), { rightBound: 'closed' }
//                     )
//                 }).coerceTo('array').pluck('price_date', 'price_fob', 'rice_id').orderBy('rice_id')
//                     // .merge(function (m2) {
//                     //     var cost = r.branch(
//                     //         costPrice.count().eq(0),
//                     //         0,
//                     //         m2('rice_id').eq(1).or(m2('rice_id').eq(2)),
//                     //         costPrice(0)('wfr_b'),
//                     //         costPrice(0)('wr_b')
//                     //     );
//                     //     var rate = r.branch(costPrice.count().eq(0), 1, costPrice(0)('rate_bank'));
//                     //     return {
//                     //         price_fob: r.branch(m2('price_fob').eq(0), 0, r.round(m2('price_fob').add(cost).div(rate)))
//                     //     }
//                     // })
//                     .group('price_date').ungroup()
//                     .map(function (m2) {
//                         return m2('reduction').map(function (m3) {
//                             return [r.expr('rice_').add(m3('rice_id').coerceTo('string')), m3('price_fob')]
//                         }).coerceTo('object')
//                             .merge({ date: m2('group').day(), month: 0, year: m2('group').year(), type: 'date' })
//                     })
//             }
//         })
//         .merge(function (m) {
//             return {
//                 "rice_1": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_1'), 0),
//                 "rice_10": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_10'), 0),
//                 "rice_11": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_11'), 0),
//                 "rice_12": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_12'), 0),
//                 "rice_15": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_15'), 0),
//                 "rice_16": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_16'), 0),
//                 "rice_17": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_17'), 0),
//                 "rice_18": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_18'), 0),
//                 "rice_2": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_2'), 0),
//                 "rice_22": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_22'), 0),
//                 "rice_3": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_3'), 0),
//                 "rice_4": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_4'), 0),
//                 "rice_7": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_7'), 0),
//                 "rice_8": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_8'), 0),
//                 "rice_9": r.branch(m('type').eq('date'), 0, m('prices').count().gt(0), m('prices').avg('rice_9'), 0)
//             }
//         })
//     r.expr([init.without('prices')])
//         .append(init.filter({ type: 'date' })(0).getField('prices').orderBy('date'))
//         .reduce(function (left, right) {
//             return left.add(right)
//         })
//         .merge(function (m) {
//             return {
//                 month: rpt.getMonthNameRethink(m('month')),
//                 year: m('year').add(543)
//             }
//         })
//         .append({
//             year: year + 543,
//             month: 'เฉลี่ย (เดือน)',
//             date: '',
//             type: 'month',
//             "rice_1": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_1'), 0),
//             "rice_10": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_10'), 0),
//             "rice_11": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_11'), 0),
//             "rice_12": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_12'), 0),
//             "rice_15": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_15'), 0),
//             "rice_16": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_16'), 0),
//             "rice_17": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_17'), 0),
//             "rice_18": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_18'), 0),
//             "rice_2": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_2'), 0),
//             "rice_22": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_22'), 0),
//             "rice_3": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_3'), 0),
//             "rice_4": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_4'), 0),
//             "rice_7": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_7'), 0),
//             "rice_8": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_8'), 0),
//             "rice_9": r.branch(init.filter({ type: 'date' })(0).getField('prices').count().gt(0), init.filter({ type: 'date' })(0).getField('prices').avg('rice_9'), 0)
//         })

//         .run()
//         .then(function (data) {
//             params = rpt.keysToUpper(params);
//             // res.json(data)
//             res.ireport("daily/fob.jasper", req.query.export || "pdf", data, params);
//         })
// }