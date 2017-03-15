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
exports.h01 = function (req, res) {
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
    var param = {
        sdate: new Date(s).getFullYear() + "-" + (new Date(s).getMonth() + 1) + "-" + new Date(s).getDate(),
        edate: new Date(e).getFullYear() + "-" + (new Date(e).getMonth() + 1) + "-" + new Date(e).getDate(),
    };
    r.expr({
        sdate: s,
        edate: e
    })
        .merge(function (hm) {
            return {
                out: r.table('ec_head').between(hm('sdate'), hm('edate'), { index: 'approve_date' })
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
                    }).default([])
                    .group('hamonize_code')
                    .ungroup()
                    .map(function (dm) {
                        return {
                            hamonize_code: dm('group'),
                            fob_amt_baht: dm('reduction').sum('fob_amt_baht'),
                            net_weight: dm('reduction').sum('net_weight'),
                            status: 'out'
                        }
                    }),
                in: r.table('ic_head').between(hm('sdate'), hm('edate'), { index: 'approve_date' })
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
                    }).default([])
                    .group('hamonize_code')
                    .ungroup()
                    .map(function (dm) {
                        return {
                            hamonize_code: dm('group'),
                            fob_amt_baht: dm('reduction').sum('fob_amt_baht'),
                            net_weight: dm('reduction').sum('net_weight'),
                            status: 'in'
                        }
                    })
            }
        })
        .merge(function (data_merge) {
            return {
                data: data_merge('in').union(data_merge('out'))
            }
        })
        .getField('data')
        .group('hamonize_code')
        .ungroup()
        .map(function (dm) {
            return {
                hamonize_code: dm('group'),
                fob_amt_baht_in: dm('reduction').filter({ status: 'in' }).sum('fob_amt_baht'),
                fob_amt_baht_out: dm('reduction').filter({ status: 'out' }).sum('fob_amt_baht'),
                net_weight_in: dm('reduction').filter({ status: 'in' }).sum('net_weight'),
                net_weight_out: dm('reduction').filter({ status: 'out' }).sum('net_weight')
            }
        })
        .eqJoin('hamonize_code', r.table('hamonize_type')).pluck('left', { right: 'hamonize_th' }).zip()
        .orderBy('hamonize_code')
        .run()
        .then(function (data) {
            // res.json(data)
            res.ireport("hamonize/report1.jasper", req.query.export || "pdf", data, param);
        });
}
exports.h02 = function (req, res) {
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
    var param = {
        sdate: new Date(s).getFullYear() + "-" + (new Date(s).getMonth() + 1) + "-" + new Date(s).getDate(),
        edate: new Date(e).getFullYear() + "-" + (new Date(e).getMonth() + 1) + "-" + new Date(e).getDate(),
    };
    r.expr({
        sdate: s,
        edate: e
    })
        .merge(function (hm) {
            return {
                out: r.table('ec_head').between(hm('sdate'), hm('edate'), { index: 'approve_date' })
                    .pluck('id')
                    .coerceTo('array')
                    .merge(function (dm) {
                        return {
                            hamonize: r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' })
                                .filter({ hamonize_code: req.query.hamonize_code })
                                .coerceTo('array')
                                .pluck('hamonize_code', 'fob_amt_baht', 'net_weight')
                        }
                    })
                    .getField('hamonize')
                    .reduce(function (l, r) {
                        return l.add(r)
                    }).default([])
                    .group('hamonize_code')
                    .ungroup()
                    .map(function (dm) {
                        return {
                            hamonize_code: dm('group'),
                            fob_amt_baht: dm('reduction').sum('fob_amt_baht'),
                            net_weight: dm('reduction').sum('net_weight'),
                            status: 'out'
                        }
                    }),
                in: r.table('ic_head').between(hm('sdate'), hm('edate'), { index: 'approve_date' })
                    .pluck('id')
                    .coerceTo('array')
                    .merge(function (dm) {
                        return {
                            hamonize: r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' })
                                .filter({ hamonize_code: req.query.hamonize_code })
                                .coerceTo('array')
                                .pluck('hamonize_code', 'fob_amt_baht', 'net_weight')
                        }
                    })
                    .getField('hamonize')
                    .reduce(function (l, r) {
                        return l.add(r)
                    }).default([])
                    .group('hamonize_code')
                    .ungroup()
                    .map(function (dm) {
                        return {
                            hamonize_code: dm('group'),
                            fob_amt_baht: dm('reduction').sum('fob_amt_baht'),
                            net_weight: dm('reduction').sum('net_weight'),
                            status: 'in'
                        }
                    })
            }
        })
        .merge(function (data_merge) {
            return {
                data: data_merge('in').union(data_merge('out'))
            }
        })
        .getField('data')
        .group('hamonize_code')
        .ungroup()
        .map(function (dm) {
            return {
                hamonize_code: dm('group'),
                fob_amt_baht_in: dm('reduction').filter({ status: 'in' }).sum('fob_amt_baht'),
                fob_amt_baht_out: dm('reduction').filter({ status: 'out' }).sum('fob_amt_baht'),
                net_weight_in: dm('reduction').filter({ status: 'in' }).sum('net_weight'),
                net_weight_out: dm('reduction').filter({ status: 'out' }).sum('net_weight')
            }
        })
        .eqJoin('hamonize_code', r.table('hamonize_type')).pluck('left', { right: 'hamonize_th' }).zip()
        .orderBy('hamonize_code')
        .run()
        .then(function (data) {
            res.ireport("hamonize/report1.jasper", req.query.export || "pdf", data, param);
        })

}
exports.c01 = function (req, res) {
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
    var param = {
        sdate: new Date(s).getFullYear() + "-" + (new Date(s).getMonth() + 1) + "-" + new Date(s).getDate(),
        edate: new Date(e).getFullYear() + "-" + (new Date(e).getMonth() + 1) + "-" + new Date(e).getDate(),
    };
    r.expr({
        sdate: s,
        edate: e
    })
        .merge(function (hm) {
            return {
                out: r.table('ec_head').between(hm('sdate'), hm('edate'), { index: 'approve_date' })
                    .pluck('id', 'company_taxno')
                    .coerceTo('array')
                    .merge(function (dm) {
                        return {
                            fob_amt_baht: r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).sum('fob_amt_baht'),
                            net_weight: r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).sum('net_weight')
                        }
                    }).without('id')
                    // .getField('hamonize')
                    // .reduce(function (l, r) {
                    //     return l.add(r)
                    // }).default([])
                    .group('company_taxno')
                    .ungroup()
                    .map(function (dm) {
                        return {
                            company_taxno: dm('group'),
                            fob_amt_baht: dm('reduction').sum('fob_amt_baht'),
                            net_weight: dm('reduction').sum('net_weight'),
                            status: 'out'
                        }
                    })
                ,
                in: r.table('ic_head').between(hm('sdate'), hm('edate'), { index: 'approve_date' })
                    .pluck('id', 'company_taxno')
                    .coerceTo('array')
                    .merge(function (dm) {
                        return {
                            fob_amt_baht: r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).sum('fob_amt_baht'),
                            net_weight: r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).sum('net_weight')
                        }
                    }).without('id')
                    // .getField('hamonize')
                    // .reduce(function (l, r) {
                    //     return l.add(r)
                    // }).default([])
                    .group('company_taxno')
                    .ungroup()
                    .map(function (dm) {
                        return {
                            company_taxno: dm('group'),
                            fob_amt_baht: dm('reduction').sum('fob_amt_baht'),
                            net_weight: dm('reduction').sum('net_weight'),
                            status: 'in'
                        }
                    })
            }
        })
        .merge(function (data_merge) {
            return {
                data: data_merge('in').union(data_merge('out'))
            }
        })
        .getField('data')
        .group('company_taxno')
        .ungroup()
        .map(function (dm) {
            return {
                company_taxno: dm('group'),
                fob_amt_baht_in: dm('reduction').filter({ status: 'in' }).sum('fob_amt_baht'),
                fob_amt_baht_out: dm('reduction').filter({ status: 'out' }).sum('fob_amt_baht'),
                net_weight_in: dm('reduction').filter({ status: 'in' }).sum('net_weight'),
                net_weight_out: dm('reduction').filter({ status: 'out' }).sum('net_weight')
            }
        })
        .eqJoin('company_taxno', r.table('company')).pluck('left', { right: 'company_name' }).zip()
        .orderBy(r.desc('net_weight_out'), r.desc('net_weight_in'))
        // .orderBy('company_taxno')
        .run()
        .then(function (data) {
            res.ireport("company/report1.jasper", req.query.export || "pdf", data, param);
        })

}
exports.c02 = function (req, res) {
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
    var param = {
        sdate: new Date(s).getFullYear() + "-" + (new Date(s).getMonth() + 1) + "-" + new Date(s).getDate(),
        edate: new Date(e).getFullYear() + "-" + (new Date(e).getMonth() + 1) + "-" + new Date(e).getDate(),
    };
    r.expr({
        sdate: s,
        edate: e
    })
        .merge(function (hm) {
            return {
                out: r.table('ec_head').between(hm('sdate'), hm('edate'), { index: 'approve_date' })
                    .filter({ company_taxno: req.query.company_taxno })
                    .pluck('id', 'company_taxno')
                    .coerceTo('array')
                    .merge(function (dm) {
                        return {
                            fob_amt_baht: r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).sum('fob_amt_baht'),
                            net_weight: r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).sum('net_weight')
                        }
                    }).without('id')
                    // .getField('hamonize')
                    // .reduce(function (l, r) {
                    //     return l.add(r)
                    // }).default([])
                    .group('company_taxno')
                    .ungroup()
                    .map(function (dm) {
                        return {
                            company_taxno: dm('group'),
                            fob_amt_baht: dm('reduction').sum('fob_amt_baht'),
                            net_weight: dm('reduction').sum('net_weight'),
                            status: 'out'
                        }
                    })
                ,
                in: r.table('ic_head').between(hm('sdate'), hm('edate'), { index: 'approve_date' })
                    .filter({ company_taxno: req.query.company_taxno })
                    .pluck('id', 'company_taxno')
                    .coerceTo('array')
                    .merge(function (dm) {
                        return {
                            fob_amt_baht: r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).sum('fob_amt_baht'),
                            net_weight: r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).sum('net_weight')
                        }
                    }).without('id')
                    // .getField('hamonize')
                    // .reduce(function (l, r) {
                    //     return l.add(r)
                    // }).default([])
                    .group('company_taxno')
                    .ungroup()
                    .map(function (dm) {
                        return {
                            company_taxno: dm('group'),
                            fob_amt_baht: dm('reduction').sum('fob_amt_baht'),
                            net_weight: dm('reduction').sum('net_weight'),
                            status: 'in'
                        }
                    })
            }
        })
        .merge(function (data_merge) {
            return {
                data: data_merge('in').union(data_merge('out'))
            }
        })
        .getField('data')
        .group('company_taxno')
        .ungroup()
        .map(function (dm) {
            return {
                company_taxno: dm('group'),
                fob_amt_baht_in: dm('reduction').filter({ status: 'in' }).sum('fob_amt_baht'),
                fob_amt_baht_out: dm('reduction').filter({ status: 'out' }).sum('fob_amt_baht'),
                net_weight_in: dm('reduction').filter({ status: 'in' }).sum('net_weight'),
                net_weight_out: dm('reduction').filter({ status: 'out' }).sum('net_weight')
            }
        })
        .eqJoin('company_taxno', r.table('company')).pluck('left', { right: 'company_name' }).zip()
        .orderBy(r.desc('net_weight_out'), r.desc('net_weight_in'))
        // .orderBy('company_taxno')
        .run()
        .then(function (data) {
            res.ireport("company/report1.jasper", req.query.export || "pdf", data, param);
        })

}
exports.li01 = function (req, res) {
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
    var param = {
        sdate: new Date(s).getFullYear() + "-" + (new Date(s).getMonth() + 1) + "-" + new Date(s).getDate(),
        edate: new Date(e).getFullYear() + "-" + (new Date(e).getMonth() + 1) + "-" + new Date(e).getDate(),
    };
    r.expr({
        sdate: s,
        edate: e
    })
        .merge(function (hm) {
            return r.table('lc_head').between(hm('sdate'), hm('edate'), { index: 'approve_date' })
                .pluck('id', 'reference_code2', 'form_type', 'product_code', 'company_name', 'approve_date', 'expire_date')
                .coerceTo('array')
                .merge(function (dm) {
                    return r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).coerceTo('array')
                        .pluck('hamonize_code', 'fob_amt_baht', 'net_weight')
                        .merge(function (hm2) {
                            return dm
                        })

                })
        })
        .reduce(function (l, r) {
            return l.add(r)
        }).default([])
        .eqJoin('hamonize_code', r.table('hamonize_type')).pluck('left', { right: 'hamonize_th' }).zip()
        .eqJoin('product_code', r.table('product_type')).pluck('left', { right: 'product_name' }).zip()
        .eqJoin('form_type', r.table('form_type')).pluck('left', { right: 'form_nameFull' }).zip()
        .orderBy('reference_code2')
        .run()
        .then(function (data) {
            for (var i in data) {
                data[i].approve_date = new Date(data[i].approve_date).toLocaleString()
                data[i].expire_date = new Date(data[i].expire_date).toLocaleString()
            }
            res.ireport("license/report1.jasper", req.query.export || "pdf", data, param);
        })

}
exports.li02 = function (req, res) {
    var r = req.r;
    // var s, e;
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
    var param = {
        sdate: new Date(s).getFullYear() + "-" + (new Date(s).getMonth() + 1) + "-" + new Date(s).getDate(),
        edate: new Date(e).getFullYear() + "-" + (new Date(e).getMonth() + 1) + "-" + new Date(e).getDate(),
    };
    // r.expr({
    //     sdate: s,
    //     edate: e
    // })
    //     .merge(function (hm) {
    //         return

    req.params.code = req.params.code + "$"
    r.table('lc_head')
        //.between(hm('sdate'), hm('edate'), { index: 'approve_date' })
        .filter(function (f) {
            return f('reference_code2').match(req.params.code)
        })
        .pluck('id', 'reference_code2', 'form_type', 'product_code', 'company_name', 'approve_date', 'expire_date')
        .coerceTo('array')
        .merge(function (dm) {
            return r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).coerceTo('array')
                .pluck('hamonize_code', 'fob_amt_baht', 'net_weight')
                .merge(function (hm2) {
                    return dm
                })

        })
        // })
        .reduce(function (l, r) {
            return l.add(r)
        }).default([])
        .eqJoin('hamonize_code', r.table('hamonize_type')).pluck('left', { right: 'hamonize_th' }).zip()
        .eqJoin('product_code', r.table('product_type')).pluck('left', { right: 'product_name' }).zip()
        .eqJoin('form_type', r.table('form_type')).pluck('left', { right: 'form_nameFull' }).zip()
        .orderBy('reference_code2')
        .run()
        .then(function (data) {
            for (var i in data) {
                data[i].approve_date = new Date(data[i].approve_date).toLocaleString()
                data[i].expire_date = new Date(data[i].expire_date).toLocaleString()
            }
            res.ireport("license/report1.jasper", req.query.export || "pdf", data, param);
        })

}
exports.ce01 = function (req, res) {
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
    var param = {
        sdate: new Date(s).getFullYear() + "-" + (new Date(s).getMonth() + 1) + "-" + new Date(s).getDate(),
        edate: new Date(e).getFullYear() + "-" + (new Date(e).getMonth() + 1) + "-" + new Date(e).getDate(),
    };
    r.expr({
        sdate: s,
        edate: e
    })
        .merge(function (hm) {
            return r.table('ct_head').between(hm('sdate'), hm('edate'), { index: 'approve_date' })
                .pluck('id', 'reference_code2', 'form_type', 'product_code', 'company_name', 'approve_date', 'expire_date')
                .coerceTo('array')
                .merge(function (dm) {
                    return r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).coerceTo('array')
                        .pluck('hamonize_code', 'fob_amt_baht', 'net_weight')
                        .merge(function (hm2) {
                            return dm
                        })

                })
        })
        .reduce(function (l, r) {
            return l.add(r)
        }).default([])
        .eqJoin('hamonize_code', r.table('hamonize_type')).pluck('left', { right: 'hamonize_th' }).zip()
        .eqJoin('product_code', r.table('product_type')).pluck('left', { right: 'product_name' }).zip()
        .eqJoin('form_type', r.table('form_type')).pluck('left', { right: 'form_nameFull' }).zip()
        .orderBy('reference_code2')
        .run()
        .then(function (data) {
            for (var i in data) {
                data[i].approve_date = new Date(data[i].approve_date).toLocaleString()
                data[i].expire_date = new Date(data[i].expire_date).toLocaleString()
            }
            res.ireport("cert/report1.jasper", req.query.export || "pdf", data, param);
        })

}
exports.ce02 = function (req, res) {
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
    var param = {
        sdate: new Date(s).getFullYear() + "-" + (new Date(s).getMonth() + 1) + "-" + new Date(s).getDate(),
        edate: new Date(e).getFullYear() + "-" + (new Date(e).getMonth() + 1) + "-" + new Date(e).getDate(),
    };
    // r.expr({
    //     sdate: s,
    //     edate: e
    // })
    //     .merge(function (hm) {
    //         return
    req.params.code = req.params.code + "$"
    r.table('ct_head')
        //.between(hm('sdate'), hm('edate'), { index: 'approve_date' })
        .filter(function (f) {
            return f('reference_code2').match(req.params.code)
        })
        .pluck('id', 'reference_code2', 'form_type', 'product_code', 'company_name', 'approve_date', 'expire_date')
        .coerceTo('array')
        .merge(function (dm) {
            return r.table('ec_data').getAll(dm('id'), { index: 'invh_run_auto' }).coerceTo('array')
                .pluck('hamonize_code', 'fob_amt_baht', 'net_weight')
                .merge(function (hm2) {
                    return dm
                })

        })
        // })
        .reduce(function (l, r) {
            return l.add(r)
        }).default([])
        .eqJoin('hamonize_code', r.table('hamonize_type')).pluck('left', { right: 'hamonize_th' }).zip()
        .eqJoin('product_code', r.table('product_type')).pluck('left', { right: 'product_name' }).zip()
        .eqJoin('form_type', r.table('form_type')).pluck('left', { right: 'form_nameFull' }).zip()
        .orderBy('reference_code2')
        .run()
        .then(function (data) {
            for (var i in data) {
                data[i].approve_date = new Date(data[i].approve_date).toLocaleString()
                data[i].expire_date = new Date(data[i].expire_date).toLocaleString()
            }
            res.ireport("cert/report1.jasper", req.query.export || "pdf", data, param);
        })

}