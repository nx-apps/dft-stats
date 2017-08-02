exports.hamonize = function (req, res) {
    var val = req.query;
    // var dateStart = req.query.dateStart;
    // var dateEnd = req.query.dateEnd;
    if (req.method == 'POST') val = req.body;
    req.jdbc.query('mssql', 'exec sp_stats_query_hamonize @hmYear=?,@hmCode=?,@dateStart=?,@dateEnd=?',
        [val.hmYear, val.hmCode, val.dateStart, val.dateEnd],
        function (err, data) {
            data = JSON.parse(data);
            // res.json(data);
            res.ireport("search/hamonize.jasper", req.query.export || "pdf", data, val);

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
exports.expt = function (req, res) {
    var val = req.query;


    if (req.method == 'POST') {
        val = req.body;
    }
    req.jdbc.query('mssql', 'exec sp_stats_rpt_refcode @refCode=?',
        [val.refCode],
        function (err, data) {
            data = JSON.parse(data);
            var len = data.length;
            var sub = [];
            for (var i = 0; i < 4; i++) {
                if (i < len) {
                    sub.push({
                        product_description: data[i].product_description,
                        tariff_code: data[i].tariff_code,
                        net_weight: data[i].net_weight,
                        net_weight_unit: data[i].net_weight_unit,
                        fob_amt_perunit: data[i].fob_amt_perunit,
                        currency_code: data[i].currency_code,
                        fob_amt_baht: data[i].fob_amt_baht
                    });
                } else {
                    sub.push({
                        product_description: '*********************************************************',
                        tariff_code: '',
                        net_weight: 0,
                        net_weight_unit: '',
                        fob_amt_perunit: 0,
                        currency_code: '',
                        fob_amt_baht: 0
                    });
                }
            }
            var main = data[0];
            main.sub = sub;
            // res.json(main);
            res.ireport("search/export.jasper", req.query.export || "pdf", [main], {
                OUTPUT_NAME: main.reference_code2
            });

        })
}
exports.impt = function (req, res) {
    // res.ireport("search/import.jasper", req.query.export || "pdf", [{}], {});
    var val = req.query;
    if (req.method == 'POST') val = req.body;
    req.jdbc.query('mssql', 'exec sp_stats_rpt_refcode @refCode=?',
        [val.refCode],
        function (err, data) {
            data = JSON.parse(data);
            var multi = (data.length == 1 ? true : false);
            var main = data[0];
            main.product_description2 = (multi ? '' : data[1].product_description);
            main.tariff_code2 = (multi ? '' : data[1].tariff_code);
            main.net_weight2 = (multi ? 0 : data[1].net_weight);
            main.net_weight_unit2 = (multi ? '' : data[1].net_weight_unit);
            main.fob_amt_perunit2 = (multi ? 0 : data[1].fob_amt_perunit);
            main.fob_amt_baht2 = (multi ? 0 : data[1].fob_amt_baht);
            main.quantity2 = (multi ? 0 : data[1].quantity);
            main.unit_code2 = (multi ? '' : data[1].unit_code);
            // res.json(main)
            res.ireport("search/import.jasper", req.query.export || "pdf", [main], {
                OUTPUT_NAME: main.reference_code2
            });

        })
}
exports.ec = function (req, res) {
    // res.ireport("search/import.jasper", req.query.export || "pdf", [{}], {});
    var val = req.query;
    if (req.method == 'POST') val = req.body;
    req.jdbc.query('mssql', 'exec sp_stats_rpt_refcode @refCode=?',
        [val.refCode],
        function (err, data) {
            data = JSON.parse(data);
            // res.json(main);
            res.ireport("search/ec.jasper", req.query.export || "pdf", data, {
                OUTPUT_NAME: data[0].reference_code2
            });
        });
}