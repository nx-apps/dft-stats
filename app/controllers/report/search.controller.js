exports.hamonize = function (req, res) {
    req.jdbc.query('mssql', 'exec sp_stats_query_hamonize @hmYear=?,@hmCode=?,@dateStart=?,@dateEnd=?', [req.body.year, req.body.hmcodes, req.body.date_start, req.body.date_end],
        function (err, data) {
            res.send(data);
        })
}