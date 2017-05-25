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
    };

    j.query("mssql", `exec sp_query_h01 @sdate= ?, @edate= ?`, [s, e],
        // j.query("mssql", `select * from hamonize_type`, [],
        function (err, data) {
            // res.send(data);
            // res.json(data);
            // console.log(param);
            r.json(data).run().then(function (d2) {
                res.ireport("hamonize/report1.jasper", req.query.export || "pdf", d2, param);
            })

        })


}
exports.h02 = function (req, res) {
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
    };

    j.query("mssql", `exec sp_query_h02 @sdate= ?, @edate= ?,@hCode=?`, [s, e, req.query.hamonize_code],
        // j.query("mssql", `select * from hamonize_type`, [],
        function (err, data) {
            r.json(data).run().then(function (d2) {
                res.ireport("hamonize/report1.jasper", req.query.export || "pdf", d2, param);
            })
        })

}
exports.c01 = function (req, res) {
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
    };
    j.query("mssql", `exec sp_query_c01 @sdate= ?, @edate= ?`, [s, e],
        // j.query("mssql", `select * from hamonize_type`, [],
        function (err, data) {
            r.json(data).run().then(function (d2) {
                res.ireport("company/report1.jasper", req.query.export || "pdf", d2, param);
            })
        })


}
exports.c02 = function (req, res) {
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
    };
    j.query("mssql", `exec sp_query_c02 @sdate= ?, @edate= ?,@taxId=?`, [s, e, req.query.company_taxno],
        // j.query("mssql", `select * from hamonize_type`, [],
        function (err, data) {
            r.json(data).run().then(function (d2) {
                res.ireport("company/report1.jasper", req.query.export || "pdf", d2, param);
            })
        })



}
exports.li01 = function (req, res) {
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
    };
    j.query("mssql", `exec sp_query_lc01 @sdate= ?, @edate= ?`, [s, e],
        // j.query("mssql", `select * from hamonize_type`, [],
        function (err, data) {
            r.json(data).run().then(function (d2) {
                res.ireport("license/report1.jasper", req.query.export || "pdf", d2, param);
            })
        })



}
exports.li02 = function (req, res) {
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
    };
    j.query("mssql", `exec sp_query_lc02 @refCode=?`, [req.params.code],
        // j.query("mssql", `select * from hamonize_type`, [],
        function (err, data) {
            r.json(data).run().then(function (d2) {
                res.ireport("license/report1.jasper", req.query.export || "pdf", d2, param);
            })
        })



}
exports.ce01 = function (req, res) {
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
    };
    j.query("mssql", `exec sp_query_ct01 @sdate= ?, @edate= ?`, [s, e],
        // j.query("mssql", `select * from hamonize_type`, [],
        function (err, data) {
            r.json(data).run().then(function (d2) {
                res.ireport("cert/report1.jasper", req.query.export || "pdf", d2, param);
            })
        })



}
exports.ce02 = function (req, res) {
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
    };
    j.query("mssql", `exec sp_query_ct02 @refCode=?`, [req.params.code],
        // j.query("mssql", `select * from hamonize_type`, [],
        function (err, data) {
            r.json(data).run().then(function (d2) {
                res.ireport("cert/report1.jasper", req.query.export || "pdf", d2, param);
            })
        })

}

