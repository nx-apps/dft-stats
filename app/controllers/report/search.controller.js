exports.hamonize = function (req, res) {
    var val = req.query;
    var dateStart = req.query.dateStart;
    var dateEnd = req.query.dateEnd;
    if (req.method == 'POST') {
        val = req.body;
    }
    req.jdbc.query('mssql', 'exec sp_stats_query_hamonize @hmYear=?,@hmCode=?,@dateStart=?,@dateEnd=?',
        [val.year, val.hmcodes, val.dateStart, val.dateEnd],
        function (err, data) {
            data = JSON.parse(data);
            // res.json(data);
            res.ireport("search/hamonize.jasper", req.query.export || "pdf", data, { dateStart, dateEnd });

        })
}
exports.company = function (req, res) {
    var val = req.query;
    var dateStart = req.query.dateStart;
    var dateEnd = req.query.dateEnd;


    if (req.method == 'POST') {
        val = req.body;
    }
    req.jdbc.query('mssql', 'exec sp_stats_query_company @taxNo=?,@dateStart=?,@dateEnd=?',
        [val.taxNo, val.dateStart, val.dateEnd],
        function (err, data) {
            data = JSON.parse(data);
            // res.json(data);
            res.ireport("search/company.jasper", req.query.export || "pdf", data, { dateStart, dateEnd });

        })
}
exports.referenceCode = function (req, res) {
    var val = req.query;
   

    if (req.method == 'POST') {
        val = req.body;
    }
    req.jdbc.query('mssql', 'exec sp_stats_rpt_reference_code @refCode=?',
        [val.refCode],
        function (err, data) {
            data = JSON.parse(data);
            res.json(data);
            // res.ireport("search/report1.jasper", req.query.export || "pdf", data);

        })
}