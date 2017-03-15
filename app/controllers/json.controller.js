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

