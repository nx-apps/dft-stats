var fs = require("fs");
exports.echead = function (req, res) {
    var j = req.jdbc;
    var r = req.r;
    j.query("mssql", `exec sp_ec_head`, [], function (err, data) {
        var wstream = fs.createWriteStream('ec-head.json');
        wstream.write(data);
        wstream.end();
        res.send("Ok");
    });
}
exports.ichead = function (req, res) {
    var j = req.jdbc;
    var r = req.r;
    j.query("mssql", `exec sp_ic_head`, [], function (err, data) {
        var wstream = fs.createWriteStream('ic-head.json');
        wstream.write(data);
        wstream.end();
        res.send("Ok");
    });
}
exports.lchead = function (req, res) {
    var j = req.jdbc;
    var r = req.r;
    j.query("mssql", `exec sp_lc_head`, [], function (err, data) {
        var wstream = fs.createWriteStream('lc-head.json');
        wstream.write(data);
        wstream.end();
        res.send("Ok");
    });
}
exports.cthead = function (req, res) {
    var j = req.jdbc;
    var r = req.r;
    j.query("mssql", `exec sp_ct_head`, [], function (err, data) {
        var wstream = fs.createWriteStream('ct-head.json');
        wstream.write(data);
        wstream.end();
        res.send("Ok");
    });
}
exports.data = function (req, res) {
    var j = req.jdbc;
    var r = req.r;
    j.query("mssql", `exec sp_ec_data`, [], function (err, data) {
        var wstream = fs.createWriteStream('ec-data.json');
        wstream.write(data);
        wstream.end();
        res.send("Ok");
    });
}
exports.form = function (req, res) {
    var j = req.jdbc;
    var r = req.r;
    j.query("mssql", `exec sp_form_type`, [], function (err, data) {
        var wstream = fs.createWriteStream('form-type.json');
        wstream.write(data);
        wstream.end();
        res.send("Ok");
    });
}
exports.product = function (req, res) {
    var j = req.jdbc;
    var r = req.r;
    j.query("mssql", `exec sp_product_type`, [], function (err, data) {
        var wstream = fs.createWriteStream('product-type.json');
        wstream.write(data);
        wstream.end();
        res.send("Ok");
    });
}
exports.hamonize = function (req, res) {
    var j = req.jdbc;
    var r = req.r;
    j.query("mssql", `exec sp_hamonize_type`, [], function (err, data) {
        var wstream = fs.createWriteStream('hamonize-type.json');
        wstream.write(data);
        wstream.end();
        res.send("Ok");
    });

}

exports.hamonize2SQ = function (req, res) {
    var j = req.jdbc;
    var r = req.r;

    r.table('hamonize_type')
        .run()
        .then(function (data) {
            // res.json(data);
            for (var d in data) {
                j.query("mssql", `insert into hamonize_type(hamonize_code,hamonize_th,hamonize_en)
                values(?,?,?)`, [data[d].id, data[d].hamonize_th, data[d].hamonize_en], function (err, data) {
                        //console.log('ok');
                    });
                // //console.log(data[d].id);
            }
            res.send('ok')
        })


}

exports.company = function (req, res) {
    var j = req.jdbc;
    var r = req.r;
    j.query("mssql", `exec sp_company_info`, [], function (err, data) {
        var wstream = fs.createWriteStream('company.json');
        wstream.write(data);
        wstream.end();
        res.send("Ok");
    });

}
exports.agent = function (req, res) {
    var j = req.jdbc;
    var r = req.r;
    j.query("mssql", `exec sp_company_agent`, [], function (err, data) {
        var wstream = fs.createWriteStream('agent.json');
        wstream.write(data);
        wstream.end();
        res.send("Ok");
    });

}
exports.learn1 = function (req, res) {
    req.jdbc.query("mssql", `
        SELECT top 20 ca.company_taxno,ci.company_name_th,ca.company_agent
            FROM company_agent ca
                join company_info ci on ci.company_taxno = ca.company_taxno
        order by company_name_th
    `
        , []
        , function (err, data) {
            data = JSON.parse(data);
            var companies = [];
            for (x in data) {
                if (companies.filter((f) => f.company_taxno == data[x].company_taxno).length == 0) {
                    data[x].company_agent = [data[x].company_agent];
                    companies.push(data[x]);
                }
                else {
                    var index = companies.indexOf(companies.filter((f) => f.company_taxno == data[x].company_taxno)[0]);
                    companies[index].company_agent.push(data[x].company_agent);
                }
            }
            // res.send(data);
            res.json(companies);
        });
}
exports.learn2 = function (req, res) {

    req.jdbc.query("mssql", "exec sp_report_daily_company @approveDate=?", [req.query.date], function (err, data) {
        //res.send(data);
        req.r.json(data).run().then(function (d2) {
            res.ireport("daily/report8.jasper", "pdf", d2, { approveDate: req.query.date });
        })
    })
}