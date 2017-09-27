var today = new Date();
var dd = today.getDate();
var dt = today.getDate() + 1;
var mm = today.getMonth() + 1; //January is 0!

var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd;
}
if (dt < 10) {
    dt = '0' + dt;
}
if (mm < 10) {
    mm = '0' + mm;
}
var today = '2016' + '-' + mm + '-' + dd;
var tomorrow = '2016' + '-' + mm + '-' + dt;
// exports.list = function (req, res) {
//     var r = req.r;
//     r.table('hamonize_type')
//         .run()
//         .then(function (data) {
//             res.json(data)
//         })
// }
exports.getHamonize = function (req, res) {
    var j = req.jdbc;

    j.query("mssql", `SELECT * from fn_stats_get_hamonize(?,?,?) order by hamonize_code,hamonize_year`, [req.query.tranType || 'e', req.query.dateStart, req.query.dateEnd],
        function (err, data) {
            res.send(data)
        })
}
exports.getGroup = function (req, res) {
    var j = req.jdbc;

    j.query("mssql", `SELECT * from fn_stats_get_hamonize_group(?,?,?) order by typerice_name,hamonize_code,hamonize_year`, [req.query.tranType || 'e', req.query.dateStart, req.query.dateEnd],
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
                // console.log(i)
            }
            res.json(arr)
        })
}
exports.listha = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT 
                        hamonize_code as id,
                        CONCAT (hamonize_code,'  ',hamonize_th,' ',' (ปี ',hamonize_year,')') as label,
                        LEN (hamonize_code) as lengths,
                        hamonize_year,
                        '' as checks
                        from hamonize_type
                        ORDER BY lengths`, [],
        // j.query("mssql", `select * from hamonize_type`, [],
        function (err, data) {
            res.send(data)
        })
}
exports.child_code = function (req, res) {
    var j = req.jdbc;
    let head = req.query.hmparent || '1006'
    let year = req.query.year
    //   //console.log('=>>>>>',req.query.hmparent);
    j.query("mssql", `select
                        hamonize_code as id,
                        CONCAT (hamonize_code,'  ',hamonize_th) as label
                        from fn_get_hamonize_child(? ) ham
						where ham.hamonize_year = ?`, [head, year],
        // j.query("mssql", `select * from hamonize_type`, [],
        function (err, data) {
            res.send(data)
        })
}
exports.rice_list = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT hamonize_code,
                             hamonize_year,
                             hamonize_th,
                             hamonize_en
                      FROM hamonize
    `, [],
        function (err, data) {
            res.send(data)
        })
}
exports.rice_get = function (req, res) {
    var j = req.jdbc;
    let date = new Object()
    let today = new Date(new Date().setFullYear(new Date().getFullYear()))
    ////console.log(today);
    date.dateStart = today.toISOString().split
    req.body.tranType = req.body.tranType || 'a'
    req.body.hmYear = req.body.hmYear || ''
    req.body.hmCode = req.body.hmCode || ''
    req.body.dateStart = req.body.dateStart || date
    req.body.dateEnd = req.body.dateEnd || today
    req.body.field2 = req.body.field2 || ''
    req.body.field3 = req.body.field3 || ''
    // console.log(req.body.tranType);
    // res.json(req.body);
    // j.query("mssql", `exec sp_stats_query_hamonize @hmYear= ?, @hmCode= ?, @dateStart= ?, @dateEnd= ?`,
    //     [req.body.hmYear, req.body.hmCode, req.body.dateStart, req.body.dateEnd],
    //     function (err, data) {
    //         res.send(data)
    //     })
    j.query("mssql", `exec sp_stats_search_hamonize  @tranType= ?, @hmYear= ?, @hmCode= ?, @dateStart= ?, @dateEnd= ?
    , @field2= ?, @field3= ?`,
        [req.body.tranType, req.body.hmYear, req.body.hmCode, req.body.dateStart, req.body.dateEnd,
        req.body.field2, req.body.field3],
        function (err, data) {
            // //console.log(data);
            res.send(data)
        })
}
// exports.re01 = function (req, res) {
//     var r = req.r;
//     var s, e;
//     if (typeof req.query.sdate !== "undefined") {
//         s = new Date(req.query.sdate).getTime() // => 2016/01/01
//     } else {
//         s = new Date(today.replace("-", "/")).getTime()
//         //r.table('ec_head').orderBy({ index: 'approve_date' }).limit(1)(0).getField('approve_date')
//     }
//     if (typeof req.query.edate !== "undefined") {
//         e = new Date(req.query.edate).getTime() // => 2016/01/01
//     } else {
//         e = new Date(tomorrow.replace("-", "/")).getTime()
//         //r.table('ec_head').orderBy({ index: r.desc('approve_date') }).limit(1)(0).getField('approve_date')
//     }

//     var order = req.query.orderby;
//     if (order.indexOf('hamonize') == -1) {
//         order = r.desc(order);
//     }
//     r.expr({
//         sdate: s,
//         edate: e
//     })
//         .merge(function (hm) {
//             return {
//                 out: r.table('ec_head').between(hm('sdate'), hm('edate'), { index: 'approve_date' })
//                     .pluck('id')
//                     .coerceTo('array')
//                     .merge(function (dm) {
//                         return {
//                             hamonize: r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).coerceTo('array')
//                                 .pluck('hamonize_code', 'fob_amt_baht', 'net_weight')
//                         }
//                     })
//                     .getField('hamonize')
//                     .reduce(function (l, r) {
//                         return l.add(r)
//                     }).default([])
//                     .group('hamonize_code')
//                     .ungroup()
//                     .map(function (dm) {
//                         return {
//                             hamonize_code: dm('group'),
//                             fob_amt_baht: dm('reduction').sum('fob_amt_baht'),
//                             net_weight: dm('reduction').sum('net_weight'),
//                             status: 'out'
//                         }
//                     }),
//                 in: r.table('ic_head').between(hm('sdate'), hm('edate'), { index: 'approve_date' })
//                     .pluck('id')
//                     .coerceTo('array')
//                     .merge(function (dm) {
//                         return {
//                             hamonize: r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).coerceTo('array')
//                                 .pluck('hamonize_code', 'fob_amt_baht', 'net_weight')
//                         }
//                     })
//                     .getField('hamonize')
//                     .reduce(function (l, r) {
//                         return l.add(r)
//                     }).default([])
//                     .group('hamonize_code')
//                     .ungroup()
//                     .map(function (dm) {
//                         return {
//                             hamonize_code: dm('group'),
//                             fob_amt_baht: dm('reduction').sum('fob_amt_baht'),
//                             net_weight: dm('reduction').sum('net_weight'),
//                             status: 'in'
//                         }
//                     })
//             }
//         })
//         .merge(function (data_merge) {
//             return {
//                 data: data_merge('in').union(data_merge('out'))
//             }
//         })
//         .getField('data')
//         .group('hamonize_code')
//         .ungroup()
//         .map(function (dm) {
//             return {
//                 hamonize_code: dm('group'),
//                 fob_amt_baht_in: dm('reduction').filter({ status: 'in' }).sum('fob_amt_baht'),
//                 fob_amt_baht_out: dm('reduction').filter({ status: 'out' }).sum('fob_amt_baht'),
//                 net_weight_in: dm('reduction').filter({ status: 'in' }).sum('net_weight'),
//                 net_weight_out: dm('reduction').filter({ status: 'out' }).sum('net_weight')
//             }
//         })
//         .eqJoin('hamonize_code', r.table('hamonize_type')).pluck('left', { right: 'hamonize_th' }).zip()
//         .orderBy(order)
//         .run()
//         .then(function (data) {
//             res.json(data)
//         })

// }

// exports.re02 = function (req, res) {
//     var r = req.r;
//     var s, e;
//     if (typeof req.query.sdate !== "undefined") {
//         s = new Date(req.query.sdate).getTime() // => 2016/01/01
//     } else {
//         s = new Date(today.replace("-", "/")).getTime()
//         //r.table('ec_head').orderBy({ index: 'approve_date' }).limit(1)(0).getField('approve_date')
//     }
//     if (typeof req.query.edate !== "undefined") {
//         e = new Date(req.query.edate).getTime() // => 2016/01/01
//     } else {
//         e = new Date(tomorrow.replace("-", "/")).getTime()
//         //r.table('ec_head').orderBy({ index: r.desc('approve_date') }).limit(1)(0).getField('approve_date')
//     }

//     r.expr({
//         sdate: s,
//         edate: e
//     })
//         .merge(function (hm) {
//             return {
//                 out: r.table('ec_head').between(hm('sdate'), hm('edate'), { index: 'approve_date' })
//                     .pluck('id')
//                     .coerceTo('array')
//                     .merge(function (dm) {
//                         return {
//                             hamonize: r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' })
//                                 .filter({ hamonize_code: req.query.hamonize_code })
//                                 .coerceTo('array')
//                                 .pluck('hamonize_code', 'fob_amt_baht', 'net_weight')
//                         }
//                     })
//                     .getField('hamonize')
//                     .reduce(function (l, r) {
//                         return l.add(r)
//                     }).default([])
//                     .group('hamonize_code')
//                     .ungroup()
//                     .map(function (dm) {
//                         return {
//                             hamonize_code: dm('group'),
//                             fob_amt_baht: dm('reduction').sum('fob_amt_baht'),
//                             net_weight: dm('reduction').sum('net_weight'),
//                             status: 'out'
//                         }
//                     }),
//                 in: r.table('ic_head').between(hm('sdate'), hm('edate'), { index: 'approve_date' })
//                     .pluck('id')
//                     .coerceTo('array')
//                     .merge(function (dm) {
//                         return {
//                             hamonize: r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' })
//                                 .filter({ hamonize_code: req.query.hamonize_code })
//                                 .coerceTo('array')
//                                 .pluck('hamonize_code', 'fob_amt_baht', 'net_weight')
//                         }
//                     })
//                     .getField('hamonize')
//                     .reduce(function (l, r) {
//                         return l.add(r)
//                     }).default([])
//                     .group('hamonize_code')
//                     .ungroup()
//                     .map(function (dm) {
//                         return {
//                             hamonize_code: dm('group'),
//                             fob_amt_baht: dm('reduction').sum('fob_amt_baht'),
//                             net_weight: dm('reduction').sum('net_weight'),
//                             status: 'in'
//                         }
//                     })
//             }
//         })
//         .merge(function (data_merge) {
//             return {
//                 data: data_merge('in').union(data_merge('out'))
//             }
//         })
//         .getField('data')
//         .group('hamonize_code')
//         .ungroup()
//         .map(function (dm) {
//             return {
//                 hamonize_code: dm('group'),
//                 fob_amt_baht_in: dm('reduction').filter({ status: 'in' }).sum('fob_amt_baht'),
//                 fob_amt_baht_out: dm('reduction').filter({ status: 'out' }).sum('fob_amt_baht'),
//                 net_weight_in: dm('reduction').filter({ status: 'in' }).sum('net_weight'),
//                 net_weight_out: dm('reduction').filter({ status: 'out' }).sum('net_weight')
//             }
//         })
//         .eqJoin('hamonize_code', r.table('hamonize_type')).pluck('left', { right: 'hamonize_th' }).zip()
//         .run()
//         .then(function (data) {
//             res.json(data)
//         })

// }

exports.sp01 = function (req, res) {
    var j = req.jdbc;
    var s = today, e = tomorrow;
    if (typeof req.query.sdate !== "undefined") {
        startDate = req.query.sdate;
    }
    if (typeof req.query.edate !== "undefined") {
        endDate = req.query.edate;
    }
    let hmparent = req.query.hmparent;
    let hmchild = req.query.hmchild;
    let refDB = req.query.refDB;

    // if (dataSourch === 'f3' || dataSourch === '' || dataSourch === undefined) {
    j.query("mssql", ` exec sp_qry_stats_hmcode @hmparent= ?, @hmchild= ? ,@startDate= ?, @endDate= ?, @refDB = ? `,
        [hmparent, hmchild, startDate, endDate, refDB],
        function (err, data) {
            res.send(data)
        })


}
exports.sp02 = function (req, res) {
    var j = req.jdbc;
    var s = today, e = tomorrow;
    if (typeof req.query.sdate !== "undefined") {
        s = req.query.sdate
    }
    if (typeof req.query.edate !== "undefined") {
        e = req.query.edate
    }
    j.query("mssql", `exec sp_query_h02 @sdate= ?, @edate= ?,@hCode=?`, [s, e, req.query.hamonize_code],
        // j.query("mssql", `select * from hamonize_type`, [],
        function (err, data) {
            res.send(data)
        })
}