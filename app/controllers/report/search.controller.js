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
exports.threeinone = function (req, res) {
    var val = req.query;
    if (req.method == 'POST') val = req.body;
    var params = {
        COLUMN_NAME1: (val.field1 == 'hamonize' ? 'ชนิดข้าว' : (val.field1 == 'country' ? 'ประเทศ' : 'บริษัท')),
        COLUMN_NAME2: (val.field2 == 'hamonize' ? 'ชนิดข้าว' : (val.field2 == 'country' ? 'ประเทศ' : 'บริษัท')),
        COLUMN_NAME3: (val.field3 == 'hamonize' ? 'ชนิดข้าว' : (val.field3 == 'country' ? 'ประเทศ' : 'บริษัท')),
        DATE_START: val.dateStart,
        DATE_END: val.dateEnd,
        TRAN_TYPE: (val.tranType == 'e' ? 'ส่งออก' : (val.tranType == 'i' ? 'นำเข้า' : 'นำเข้า-ส่งออก')),
        FILE_TYPE: req.query.export
    };
    req.jdbc.query("mssql", `exec sp_stats_search_3in1 
                @tranType=?,
                @dateStart=?,
                @dateEnd=?,
                @field1=?,
                @field2=?,
                @field3=?,
                @value1=?,
                @value2=?,
                @value3=?`,
        [val.tranType || '', val.dateStart || null, val.dateEnd || null,
        val.field1 || '', val.field2 || '', val.field3 || '',
        val.value1 || '', val.value2 || '', val.value3 || ''],
        function (err, data) {
            data = JSON.parse(data);
            var filename = 'rpt_' + val.view
                + (val.field3 != '' && typeof val.field3 !== 'undefined' ? '3' : (val.field2 != '' && typeof val.field2 !== 'undefined' ? '2' : '1'))
                + (val.tranType == 'a' ? '_all' : '');
            res.ireport("search/" + filename + ".jasper", req.query.export || "pdf", data, params);
        });

}
exports.company = function (req, res) {
    var val = req.query;
    if (req.method == 'POST') val = req.body;
    var params = {
        COLUMN_NAME1: 'บริษัท',
        COLUMN_NAME2: (val.field2 == 'hamonize' ? 'ชนิดข้าว' : 'ประเทศ'),
        COLUMN_NAME3: (val.field3 == 'hamonize' ? 'ชนิดข้าว' : 'ประเทศ'),
        DATE_START: val.dateStart,
        DATE_END: val.dateEnd,
        TRAN_TYPE: (val.tranType == 'e' ? 'ส่งออก' : 'นำเข้า'),
        FILE_TYPE: req.query.export
    };

    if (typeof val.field3 !== 'undefined') {
        // res.json(3)
        if (val.tranType == 'a') {
            req.jdbc.query('mssql', 'exec sp_stats_search_company @tranType=?,@taxNo=?,@dateStart=?,@dateEnd=?,@field2=?,@field3=?',
                [val.tranType, val.taxNo || '', val.dateStart, val.dateEnd, val.field2, val.field3],
                function (err, data) {
                    data = JSON.parse(data);
                    if (val.view == 'pivot') {
                        res.ireport("search/rpt_pivot3_all.jasper", req.query.export || "pdf", data, params);
                    } else {
                        res.ireport("search/rpt_raw3_all.jasper", req.query.export || "pdf", data, params);
                    }
                });
        } else {
            req.jdbc.query('mssql', 'exec sp_stats_search_company @tranType=?,@taxNo=?,@dateStart=?,@dateEnd=?,@field2=?,@field3=?',
                [val.tranType, val.taxNo || '', val.dateStart, val.dateEnd, val.field2, val.field3],
                function (err, data) {
                    data = JSON.parse(data);
                    if (val.view == 'pivot') {
                        res.ireport("search/rpt_pivot3.jasper", req.query.export || "pdf", data, params);
                    } else {
                        res.ireport("search/rpt_raw3.jasper", req.query.export || "pdf", data, params);
                    }
                });
        }

    } else if (typeof val.field2 !== 'undefined') {
        // res.json(2)
        if (val.tranType == 'a') {
            req.jdbc.query('mssql', 'exec sp_stats_search_company @tranType=?,@taxNo=?,@dateStart=?,@dateEnd=?,@field2=?',
                [val.tranType, val.taxNo || '', val.dateStart, val.dateEnd, val.field2],
                function (err, data) {
                    data = JSON.parse(data);
                    if (val.view == 'pivot') {
                        res.ireport("search/rpt_pivot2_all.jasper", req.query.export || "pdf", data, params);
                    } else {
                        res.ireport("search/rpt_raw2_all.jasper", req.query.export || "pdf", data, params);
                    }

                });
        } else {
            req.jdbc.query('mssql', 'exec sp_stats_search_company @tranType=?,@taxNo=?,@dateStart=?,@dateEnd=?,@field2=?',
                [val.tranType, val.taxNo || '', val.dateStart, val.dateEnd, val.field2],
                function (err, data) {
                    data = JSON.parse(data);
                    if (val.view == 'pivot') {
                        res.ireport("search/rpt_pivot2.jasper", req.query.export || "pdf", data, params);
                    } else {
                        res.ireport("search/rpt_raw2.jasper", req.query.export || "pdf", data, params);
                    }
                });
        }

    } else {
        // res.json(1)
        if (val.tranType == 'a') {
            req.jdbc.query('mssql', 'exec sp_stats_search_company @tranType=?,@taxNo=?,@dateStart=?,@dateEnd=?',
                [val.tranType, val.taxNo || '', val.dateStart, val.dateEnd],
                function (err, data) {
                    data = JSON.parse(data);
                    res.ireport("search/rpt_raw1_all.jasper", req.query.export || "pdf", data, params);

                });
        } else {
            req.jdbc.query('mssql', 'exec sp_stats_search_company @tranType=?,@taxNo=?,@dateStart=?,@dateEnd=?',
                [val.tranType, val.taxNo || '', val.dateStart, val.dateEnd],
                function (err, data) {
                    data = JSON.parse(data);
                    res.ireport("search/rpt_raw1.jasper", req.query.export || "pdf", data, params);

                });
        }
    }

}
exports.hamonize = function (req, res) {
    var val = req.query;
    if (req.method == 'POST') val = req.body;
    var params = {
        COLUMN_NAME1: 'ชนิดข้าว',
        COLUMN_NAME2: (val.field2 == 'company' ? 'บริษัท' : 'ประเทศ'),
        COLUMN_NAME3: (val.field3 == 'company' ? 'บริษัท' : 'ประเทศ'),
        DATE_START: val.dateStart,
        DATE_END: val.dateEnd,
        TRAN_TYPE: (val.tranType == 'e' ? 'ส่งออก' : 'นำเข้า'),
        FILE_TYPE: req.query.export
    };
    if (typeof val.field3 !== 'undefined') {
        if (val.tranType == 'a') {
            req.jdbc.query('mssql', 'exec sp_stats_search_hamonize @tranType=?,@hmYear=?,@hmCode=?,@dateStart=?,@dateEnd=?,@field2=?,@field3=?',
                [val.tranType, val.hmYear, val.hmCode || '', val.dateStart, val.dateEnd, val.field2, val.field3],
                function (err, data) {
                    data = JSON.parse(data);
                    if (val.view == 'pivot') {
                        res.ireport("search/rpt_pivot3_all.jasper", req.query.export || "pdf", data, params);
                    } else {
                        res.ireport("search/rpt_raw3_all.jasper", req.query.export || "pdf", data, params);
                    }
                });
        } else {
            req.jdbc.query('mssql', 'exec sp_stats_search_hamonize @tranType=?,@hmYear=?,@hmCode=?,@dateStart=?,@dateEnd=?,@field2=?,@field3=?',
                [val.tranType, val.hmYear, val.hmCode || '', val.dateStart, val.dateEnd, val.field2, val.field3],
                function (err, data) {
                    data = JSON.parse(data);
                    if (val.view == 'pivot') {
                        res.ireport("search/rpt_pivot3.jasper", req.query.export || "pdf", data, params);
                    } else {
                        res.ireport("search/rpt_raw3.jasper", req.query.export || "pdf", data, params);
                    }
                });
        }

    } else if (typeof val.field2 !== 'undefined') {
        if (val.tranType == 'a') {
            req.jdbc.query('mssql', 'exec sp_stats_search_hamonize @tranType=?,@hmYear=?,@hmCode=?,@dateStart=?,@dateEnd=?,@field2=?',
                [val.tranType, val.hmYear, val.hmCode || '', val.dateStart, val.dateEnd, val.field2],
                function (err, data) {
                    data = JSON.parse(data);
                    if (val.view == 'pivot') {
                        res.ireport("search/rpt_pivot2_all.jasper", req.query.export || "pdf", data, params);
                    } else {
                        res.ireport("search/rpt_raw2_all.jasper", req.query.export || "pdf", data, params);
                    }
                });
        } else {
            req.jdbc.query('mssql', 'exec sp_stats_search_hamonize @tranType=?,@hmYear=?,@hmCode=?,@dateStart=?,@dateEnd=?,@field2=?',
                [val.tranType, val.hmYear, val.hmCode || '', val.dateStart, val.dateEnd, val.field2],
                function (err, data) {
                    data = JSON.parse(data);
                    if (val.view == 'pivot') {
                        res.ireport("search/rpt_pivot2.jasper", req.query.export || "pdf", data, params);
                    } else {
                        res.ireport("search/rpt_raw2.jasper", req.query.export || "pdf", data, params);
                    }
                });
        }

    } else {
        if (val.tranType == 'a') {
            req.jdbc.query('mssql', 'exec sp_stats_search_hamonize @tranType=?,@hmYear=?,@hmCode=?,@dateStart=?,@dateEnd=?',
                [val.tranType, val.hmYear, val.hmCode || '', val.dateStart, val.dateEnd],
                function (err, data) {
                    data = JSON.parse(data);
                    res.ireport("search/rpt_raw1_all.jasper", req.query.export || "pdf", data, params);

                });
        } else {
            req.jdbc.query('mssql', 'exec sp_stats_search_hamonize @tranType=?,@hmYear=?,@hmCode=?,@dateStart=?,@dateEnd=?',
                [val.tranType, val.hmYear, val.hmCode || '', val.dateStart, val.dateEnd],
                function (err, data) {
                    data = JSON.parse(data);
                    res.ireport("search/rpt_raw1.jasper", req.query.export || "pdf", data, params);

                });
        }

    }

}
exports.country = function (req, res) {
    var val = req.query;
    if (req.method == 'POST') val = req.body;
    var params = {
        COLUMN_NAME1: 'ประเทศ',
        COLUMN_NAME2: (val.field2 == 'company' ? 'บริษัท' : 'ชนิดข้าว'),
        COLUMN_NAME3: (val.field3 == 'company' ? 'บริษัท' : 'ชนิดข้าว'),
        DATE_START: val.dateStart,
        DATE_END: val.dateEnd,
        TRAN_TYPE: (val.tranType == 'e' ? 'ส่งออก' : 'นำเข้า'),
        FILE_TYPE: req.query.export
    };

    if (typeof val.field3 !== 'undefined') {
        if (val.tranType == 'a') {
            req.jdbc.query('mssql', 'exec sp_stats_search_country @tranType=?,@countryCode=?,@dateStart=?,@dateEnd=?,@field2=?,@field3=?',
                [val.tranType, val.countryCode || '', val.dateStart, val.dateEnd, val.field2, val.field3],
                function (err, data) {
                    data = JSON.parse(data);
                    if (val.view == 'pivot') {
                        res.ireport("search/rpt_pivot3_all.jasper", req.query.export || "pdf", data, params);
                    } else {
                        res.ireport("search/rpt_raw3_all.jasper", req.query.export || "pdf", data, params);
                    }
                });
        } else {
            req.jdbc.query('mssql', 'exec sp_stats_search_country @tranType=?,@countryCode=?,@dateStart=?,@dateEnd=?,@field2=?,@field3=?',
                [val.tranType, val.countryCode || '', val.dateStart, val.dateEnd, val.field2, val.field3],
                function (err, data) {
                    data = JSON.parse(data);
                    if (val.view == 'pivot') {
                        res.ireport("search/rpt_pivot3.jasper", req.query.export || "pdf", data, params);
                    } else {
                        res.ireport("search/rpt_raw3.jasper", req.query.export || "pdf", data, params);
                    }
                });
        }

    } else if (typeof val.field2 !== 'undefined') {
        if (val.tranType == 'a') {
            req.jdbc.query('mssql', 'exec sp_stats_search_country @tranType=?,@countryCode=?,@dateStart=?,@dateEnd=?,@field2=?',
                [val.tranType, val.countryCode || '', val.dateStart, val.dateEnd, val.field2],
                function (err, data) {
                    data = JSON.parse(data);
                    if (val.view == 'pivot') {
                        res.ireport("search/rpt_pivot2_all.jasper", req.query.export || "pdf", data, params);
                    } else {
                        res.ireport("search/rpt_raw2_all.jasper", req.query.export || "pdf", data, params);
                    }
                });
        } else {
            req.jdbc.query('mssql', 'exec sp_stats_search_country @tranType=?,@countryCode=?,@dateStart=?,@dateEnd=?,@field2=?',
                [val.tranType, val.countryCode || '', val.dateStart, val.dateEnd, val.field2],
                function (err, data) {
                    data = JSON.parse(data);
                    if (val.view == 'pivot') {
                        res.ireport("search/rpt_pivot2.jasper", req.query.export || "pdf", data, params);
                    } else {
                        res.ireport("search/rpt_raw2.jasper", req.query.export || "pdf", data, params);
                    }
                });
        }

    } else {
        if (val.tranType == 'a') {
            req.jdbc.query('mssql', 'exec sp_stats_search_country @tranType=?,@countryCode=?,@dateStart=?,@dateEnd=?',
                [val.tranType, val.countryCode || '', val.dateStart, val.dateEnd],
                function (err, data) {
                    data = JSON.parse(data);
                    res.ireport("search/rpt_raw1_all.jasper", req.query.export || "pdf", data, params);

                });
        } else {
            req.jdbc.query('mssql', 'exec sp_stats_search_country @tranType=?,@countryCode=?,@dateStart=?,@dateEnd=?',
                [val.tranType, val.countryCode || '', val.dateStart, val.dateEnd],
                function (err, data) {
                    data = JSON.parse(data);
                    res.ireport("search/rpt_raw1.jasper", req.query.export || "pdf", data, params);

                });
        }
    }

}