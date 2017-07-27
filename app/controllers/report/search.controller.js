exports.hamonize = function (req, res) {
    var val = req.query;
    var date_start = req.query.date_start;
    var date_end = req.query.date_end;
   

    if (req.method == 'POST') {
        val = req.body;
    }
    req.jdbc.query('mssql', 'exec sp_stats_query_hamonize @hmYear=?,@hmCode=?,@dateStart=?,@dateEnd=?',
        [val.year, val.hmcodes, val.date_start, val.date_end],
        function (err, data) {
            data = JSON.parse(data);
            // res.json(data);
            res.ireport("search/report1.jasper", req.query.export || "pdf", data, { date_start, date_end});

        })
}