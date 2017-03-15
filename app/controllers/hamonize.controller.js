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
exports.list = function (req, res) {
    var r = req.r;
    r.table('hamonize_type')
        .run()
        .then(function (data) {
            res.json(data)
        })
}
exports.filter = function (req, res) {
    var r = req.r;
    var s, e;
    if (typeof req.query.sdate !== "undefined") {
        s = new Date(req.query.sdate).getTime()
    } else {
        s = r.table('ec_head').orderBy({ index: 'approve_date' }).limit(1)(0).getField('approve_date')
    }
    if (typeof req.query.edate !== "undefined") {
        e = new Date(req.query.edate).getTime()
    } else {
        e = r.table('ec_head').orderBy({ index: r.desc('approve_date') }).limit(1)(0).getField('approve_date')
    }
    r.expr({
        sdate: s,
        edate: e
    })
        .merge(function (hm) {
            return {
                data: r.table('ec_head').between(hm('sdate'), hm('edate'), { index: 'approve_date' })
                    .pluck('id')
                    .coerceTo('array')
                    .merge(function (dm) {
                        return {
                            hamonize: r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).coerceTo('array')
                                .pluck('hamonize_code', 'fob_amt_baht', 'net_weight')
                        }
                    })
                    .getField('hamonize')
                    .reduce(function (l, r) {
                        return l.add(r)
                    })
                    .group('hamonize_code')
                    .ungroup()
                    .map(function (dm) {
                        return {
                            hamonize_code: dm('group'),
                            fob_amt_baht: dm('reduction').sum('fob_amt_baht'),
                            net_weight: dm('reduction').sum('net_weight')
                        }
                    })
                    .orderBy('hamonize_code')
            }
        })
        .getField('data')
        .run()
        .then(function (data) {
            res.json(data)
        })

}
exports.sp01 = function (req, res) {
    var j = req.jdbc;
    var s = today, e = tomorrow;
    if (typeof req.query.sdate !== "undefined") {
        s = req.query.sdate
    }
    if (typeof req.query.edate !== "undefined") {
        e = req.query.edate
    }
    j.query("mssql", `exec sp_hamonize01 @sdate=?,@edate=?`, [s, e],
        function (err, data) {
            res.send(data)
        })
}