exports.hamonize01 = function (req, res) {
    var j = req.jdbc;

    j.query("mssql", `exec sp_hamonize01 @sdate=?,@edate=?`, [req.query.sdate, req.query.edate],
        function (err, data) {
            res.send(data)
            //res.ireport(....)
        })
}