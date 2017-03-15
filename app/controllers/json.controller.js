var fs = require("fs");
exports.head = function (req, res) {
    var j = req.jdbc;
    var r = req.r;
    j.query("mssql", `exec sp_ec_head`, [], function (err, data) {
        var wstream = fs.createWriteStream('ec-head.json');
        wstream.write(data);
        wstream.end();
        res.send("Ok");
        // r.pipe(
        // r.table('src').filter({ 'a': true }),
        //   r.json(data),
        //  wstream
        // r.node('mynode').openStream('exported-file.json')
        // )
        //  res.setHeader('Content-Type', 'application/json')
        // res.send(data);
        //   r.table('ec_head')
        //     .insert(r.json(data))
        //    .run()
        //    .then(function (datas) {
        //   res.json(datas)
        //   })
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
        // r.pipe(
        // r.table('src').filter({ 'a': true }),
        //   r.json(data),
        //  wstream
        // r.node('mynode').openStream('exported-file.json')
        // )
        //  res.setHeader('Content-Type', 'application/json')
        // res.send(data);
        //   r.table('ec_head')
        //     .insert(r.json(data))
        //    .run()
        //    .then(function (datas) {
        //   res.json(datas)
        //   })
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
        // r.pipe(
        // r.table('src').filter({ 'a': true }),
        //   r.json(data),
        //  wstream
        // r.node('mynode').openStream('exported-file.json')
        // )
        //  res.setHeader('Content-Type', 'application/json')
        // res.send(data);
        //   r.table('ec_head')
        //     .insert(r.json(data))
        //    .run()
        //    .then(function (datas) {
        //   res.json(datas)
        //   })
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
        // r.pipe(
        // r.table('src').filter({ 'a': true }),
        //   r.json(data),
        //  wstream
        // r.node('mynode').openStream('exported-file.json')
        // )
        //  res.setHeader('Content-Type', 'application/json')
        // res.send(data);
        //   r.table('ec_head')
        //     .insert(r.json(data))
        //    .run()
        //    .then(function (datas) {
        //   res.json(datas)
        //   })
    });
}

