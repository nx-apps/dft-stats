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

exports.company = function (req, res) {
    var j = req.jdbc;
    var r = req.r;
    j.query("mssql", `exec sp_company`, [], function (err, data) {
        var wstream = fs.createWriteStream('company.json');
        wstream.write(data);
        wstream.end();
        res.send("Ok");
    });

}

