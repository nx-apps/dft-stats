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

exports.re01 = function (req, res) {
    var r = req.r;
    var s, e;
    if (typeof req.query.sdate !== "undefined") {
        s = new Date(req.query.sdate).getTime() // => 2016/01/01
    } else {
        s = new Date(today.replace("-", "/")).getTime()
        //r.table('ec_head').orderBy({ index: 'approve_date' }).limit(1)(0).getField('approve_date')
    }
    if (typeof req.query.edate !== "undefined") {
        e = new Date(req.query.edate).getTime() // => 2016/01/01
    } else {
        e = new Date(tomorrow.replace("-", "/")).getTime()
        //r.table('ec_head').orderBy({ index: r.desc('approve_date') }).limit(1)(0).getField('approve_date')
    }
    r.expr({
        sdate: s,
        edate: e
    })
        .merge(function (hm) {
            return {
                data: r.table('ec_head').between(hm('sdate'), hm('edate'), { index: 'approve_date' })
                    .pluck('id', 'reference_code2', 'company_name', 'approve_date', 'expire_date')
                    .coerceTo('array')
                    .merge(function (dm) {
                        return {
                            ax: r.js("(function(x) { d = new Date(x.approve_date); return d.toISOString(); })"),
                            //  approve_date: dm('approve_date'),
                            hamonize: r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).coerceTo('array')
                                .pluck('hamonize_code', 'fob_amt_baht', 'net_weight')
                        }
                    })
            }
        })
        // .getField('data')
        // .eqJoin('hamonize_code', r.table('hamonize_type')).pluck('left', { right: 'hamonize_th' }).zip()
        .run()
        .then(function (data) {
            res.json(data)
        })

}
