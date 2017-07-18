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
//     r.expr({
//         sdate: s,
//         edate: e
//     })
//         .merge(function (hm) {
//             return r.table('ct_head').between(hm('sdate'), hm('edate'), { index: 'approve_date' })
//                 .pluck('id', 'reference_code2', 'form_type', 'product_code', 'company_name', 'approve_date', 'expire_date')
//                 .coerceTo('array')
//                 .merge(function (dm) {
//                     return r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).coerceTo('array')
//                         .pluck('hamonize_code', 'fob_amt_baht', 'net_weight')
//                         .merge(function (hm2) {
//                             return dm
//                         })

//                 })
//         })
//         .reduce(function (l, r) {
//             return l.add(r)
//         }).default([])
//         .eqJoin('hamonize_code', r.table('hamonize_type')).pluck('left', { right: 'hamonize_th' }).zip()
//         .eqJoin('product_code', r.table('product_type')).pluck('left', { right: 'product_name' }).zip()
//         .eqJoin('form_type', r.table('form_type')).pluck('left', { right: 'form_nameFull' }).zip()
//         .orderBy('reference_code2')
//         .run()
//         .then(function (data) {
//             for (var i in data) {
//                 data[i].approve_date = new Date(data[i].approve_date).toISOString().split("T")[0]
//                 data[i].expire_date = new Date(data[i].expire_date).toISOString().split("T")[0]
//             }
//             res.json(data)
//         })

// }
// exports.re02 = function (req, res) {
//     var r = req.r;
//     // var s, e;
//     // if (typeof req.query.sdate !== "undefined") {
//     //     s = new Date(req.query.sdate).getTime() // => 2016/01/01
//     // } else {
//     //     s = new Date(today.replace("-", "/")).getTime()
//     //     //r.table('ec_head').orderBy({ index: 'approve_date' }).limit(1)(0).getField('approve_date')
//     // }
//     // if (typeof req.query.edate !== "undefined") {
//     //     e = new Date(req.query.edate).getTime() // => 2016/01/01
//     // } else {
//     //     e = new Date(tomorrow.replace("-", "/")).getTime()
//     //     //r.table('ec_head').orderBy({ index: r.desc('approve_date') }).limit(1)(0).getField('approve_date')
//     // }
//     // r.expr({
//     //     sdate: s,
//     //     edate: e
//     // })
//     //     .merge(function (hm) {
//     //         return
//     req.params.code = req.params.code + "$"
//     r.table('ct_head')
//         //.between(hm('sdate'), hm('edate'), { index: 'approve_date' })
//         .filter(function (f) {
//             return f('reference_code2').match(req.params.code)
//         })
//         .pluck('id', 'reference_code2', 'form_type', 'product_code', 'company_name', 'approve_date', 'expire_date')
//         .coerceTo('array')
//         .merge(function (dm) {
//             return r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).coerceTo('array')
//                 .pluck('hamonize_code', 'fob_amt_baht', 'net_weight')
//                 .merge(function (hm2) {
//                     return dm
//                 })

//         })
//         // })
//         .reduce(function (l, r) {
//             return l.add(r)
//         }).default([])
//         .eqJoin('hamonize_code', r.table('hamonize_type')).pluck('left', { right: 'hamonize_th' }).zip()
//         .eqJoin('product_code', r.table('product_type')).pluck('left', { right: 'product_name' }).zip()
//         .eqJoin('form_type', r.table('form_type')).pluck('left', { right: 'form_nameFull' }).zip()
//         .orderBy('reference_code2')
//         .run()
//         .then(function (data) {
//             for (var i in data) {
//                 data[i].approve_date = new Date(data[i].approve_date).toISOString().split("T")[0]
//                 data[i].expire_date = new Date(data[i].expire_date).toISOString().split("T")[0]
//             }
//             res.json(data)
//         })

// }
exports.sp01 = function (req, res) {
    var j = req.jdbc;
    var startDate = today, e = tomorrow;
    if (typeof req.query.sdate !== "undefined") {
        startDate = req.query.sdate
    }
    if (typeof req.query.edate !== "undefined") {
        endDate = req.query.edate
    }
    let reference_code2 = req.query.reference_code2 || ''
    
    j.query("mssql", `exec sp_qry_stats_cert @refCode= ?, @startDate= ?, @endDate= ?`,
     [reference_code2,startDate, endDate],
        // j.query("mssql", `select * from hamonize_type`, [],
        function (err, data) {
            res.send(data)
        })
}
// exports.sp02 = function (req, res) {
//     var j = req.jdbc;
//     var s = today, e = tomorrow;
//     if (typeof req.query.sdate !== "undefined") {
//         s = req.query.sdate
//     }
//     if (typeof req.query.edate !== "undefined") {
//         e = req.query.edate
//     }
//     j.query("mssql", `exec sp_query_ct02 @refCode=?`, [req.params.code],
//         // j.query("mssql", `select * from hamonize_type`, [],
//         function (err, data) {
//             res.send(data)
//         })
// }