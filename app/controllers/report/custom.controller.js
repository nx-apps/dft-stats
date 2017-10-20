var rpt = require('../../global/report');
exports.whiterice = function (req, res) {

    req.jdbc.query("mssql", "exec sp_stats_rpt_custom_whiterice @month=?, @year=?, @zone=?", [req.query.modelMonth, req.query.modelYear, req.query.zoneName],
        function (err, data) {
            data = JSON.parse(data);
            const arrMonth = req.query.modelMonth.split(",").sort();
            var param = {
                date: req.query.date,
                FILE_TYPE: req.query.export,
                YEAR : req.query.modelYear,
                startMonth: rpt.getMonthName(Number(arrMonth[0])),
                endMonth: rpt.getMonthName(Number(arrMonth[arrMonth.length - 1])),
            };
            // var month = ["12", "05", "01"];
            // param.endMonth.sort();
            // var endMonth = param.endMonth.length;
            // for (var i = 1; i < 13; i++) {
            //     endMonth: rpt.getMonthName(Number(req.query.modelMonth))
            // }
            // if (endMonth.length > 1) {

            //     // this.set('req.query.modelMonth', month[month.length - 1].value)
            // }
            
            param.current_date = new Date().toISOString().slice(0, 10);
            param.OUTPUT_NAME = param.current_date.replace(/-/g, '') + '_ปริมาณและมูลค่าการส่งออกข้าวขาวของไทย'
            param = rpt.keysToUpper(param);
            // console.log(req.query.modelMonth)
            // res.json(param)
            res.ireport("custom/rpt_custom_export_whiterice.jasper", req.query.export || "pdf", data, param)
        })
}
exports.exportrice = function (req, res) {

    req.jdbc.query("mssql", "exec sp_stats_rpt_custom_allrice @month=?, @year=?, @zone=?", [req.query.modelMonth, req.query.modelYear, req.query.zoneName],
        function (err, data) {
            data = JSON.parse(data);
            const arrMonth = req.query.modelMonth.split(",").sort();
            var param = {
                date: req.query.date,
                FILE_TYPE: req.query.export,
            };
            param.startMonth = rpt.getMonthName(Number(arrMonth[0])),
            param.endMonth = rpt.getMonthName(Number(arrMonth[arrMonth.length - 1])),
            param.year = req.query.modelYear;
            param.current_date = new Date().toISOString().slice(0, 10);
            param.OUTPUT_NAME = param.current_date.replace(/-/g, '') + '_ปริมาณและมูลค่าการส่งออกข้าวของไทย'
            param = rpt.keysToUpper(param);
            res.ireport("custom/rpt_custom_export_rice.jasper", req.query.export || "pdf", data, param)
        })
}
exports.hommalirice = function (req, res) {
    req.jdbc.query("mssql", "exec sp_stats_rpt_custom_hommali @month=?, @year=?, @zone=?", [req.query.modelMonth, req.query.modelYear, req.query.zoneName],
        function (err, data) {
            // res.send(data);
            data = JSON.parse(data);
            const arrMonth = req.query.modelMonth.split(",").sort();
            var param = {
                date: req.query.date,
                FILE_TYPE: req.query.export,
            };
            param.startMonth = rpt.getMonthName(Number(arrMonth[0])),
            param.endMonth = rpt.getMonthName(Number(arrMonth[arrMonth.length - 1])),
            param.year = req.query.modelYear;
            param.current_date = new Date().toISOString().slice(0, 10);
            param.OUTPUT_NAME = param.current_date.replace(/-/g, '') + '_ปริมาณมูลค่าการส่งออกข้าวหอมมะลิไทย'
            param = rpt.keysToUpper(param);
            res.ireport("custom/rpt_custom_export_hommalirice.jasper", req.query.export || "pdf", data, param)
        })
}
exports.year = function (req, res) {
    req.jdbc.query("mssql", "exec sp_stats_rpt_custom_year @modelMonth=?, @modelYear=?, @backYear=?,@zone=?",
        [req.query.modelMonth, req.query.modelYear, req.query.backYear || '1', req.query.zoneName || ''],
        function (err, data) {
            // data = JSON.parse(data);
            var param = {
                date: req.query.date,
                FILE_TYPE: req.query.export,
                year_0: req.query.modelYear,
                year_1: Number(req.query.modelYear) - 1
            };
            if (typeof req.query.backYear !== 'undefined' && Number(req.query.backYear) > 1) {
                for (var i = 2; i <= Number(req.query.backYear); i++) {
                    param['year_' + i] = Number(req.query.modelYear) - i;
                }
            }
            param.startMonth = rpt.getMonthName(1);
            param.endMonth = rpt.getMonthName(Number(req.query.modelMonth));
            param.year = req.query.modelYear;
            param.current_date = new Date().toISOString().slice(0, 10);
            param.OUTPUT_NAME = param.current_date.replace(/-/g, '') + '_ปริมาณการส่งออกข้าวไทยรายปี';
            param = rpt.keysToUpper(param);
            res.ireport("custom/rpt_custom_year" + req.query.backYear + ".jasper", req.query.export || "pdf", JSON.parse(data), param)

        });
}
exports.getSearch = function (req, res) {
    var val = (req.method == "GET" ? req.query : req.body);
    req.jdbc.query("mssql", `exec sp_stats_search_custom
    @tranType=?,
    @modelYear=?,
    @modelMonth=?,
    @field1=?,
    @field2=?,
    @hsCode=?,
    @countryCode=?`,
        [val.tranType || 'E', val.modelYear, val.modelMonth || '00',
        val.field1 || 'hamonize', val.field2 || '', val.hsCode || '1006', val.countryCode || ''],
        function (err, datas) {
            datas = JSON.parse(datas);
            if (datas.length > 0) {
                var params = {
                    TRAN_TYPE: (val.tranType == 'I' ? 'นำเข้า' : 'ส่งออก'),
                    MONTH: rpt.getMonthName(Number(req.query.modelMonth)),
                    YEAR: req.query.modelYear,
                    // COUNTRY_NAME: countryName,
                    FIELD1: val.field1,
                    FIELD2: val.field2,
                    FILE_TYPE: req.query.export
                };
                params.CURRENT_DATE = new Date().toISOString().slice(0, 10);
                // params = rpt.keysToUpper(params);
                // res.send(params)
                res.ireport("custom/search/rpt_" + req.query.view + (typeof val.field2 === 'undefined' ? 1 : 2) + ".jasper", req.query.export || "pdf", datas, params);
                // const haveCode = datas[0].hsCode === null || isNaN(datas[0].hsCode);
                // const isPivot = (req.query.view == 'pivot' ? true : false);
                // const config = {
                //     lenMin: (haveCode ? 0 : datas[0].hsCode.length),
                //     lenMax: (haveCode ? 0 : datas[datas.length - 1].hsCode.length)
                // };
                // for (let i = 0; i < datas.length; i++) {
                //     let data = {};
                //     if (config.lenMin > 0) {
                //         let c = 0;
                //         if (val.field1 == 'country') {
                //             data['field' + c] = datas[i].field1;
                //             if (i == 0) arr['header']['field' + c] = 'ประเทศ';
                //             c++;
                //         }
                //         for (let l = config.lenMin; l <= config.lenMax; l += 2) {
                //             if (l == 10) l++;
                //             if (l == datas[i].hsCode.length) {
                //                 data['field' + c] = datas[i].hsCode + (isPivot ? ' ' + (val.field1 == 'hamonize' ? datas[i].field1 : datas[i].field2) : '');
                //             } else {
                //                 const thisLength = datas[i].hsCode.length;
                //                 const parentCode = datas[i].hsCode.substring(0, thisLength - (thisLength == 11 ? 3 : 2));
                //                 const parentData = arr['datas'].filter((f) => f.hsCode == parentCode);
                //                 data['field' + c] = (parentData.length > 0 ? parentData[0]['field' + c] : '');
                //             }
                //             if (i == 0) arr['header']['field' + c] = (isPivot ? 'ชนิดข้าว' : 'HSCODE' + l);//(l == config.lenMax ? 'ชนิดข้าว' : 'hmcode' + l);
                //             c++;
                //         }
                //         if (val.field1 == 'hamonize' || val.field2 == 'hamonize') {
                //             if (!isPivot) {
                //                 data['field' + c] = (val.field1 == 'hamonize' ? datas[i].field1 : datas[i].field2);
                //                 if (i == 0) arr['header']['field' + c] = 'ชนิดข้าว';
                //                 c++;
                //             }
                //         }
                //         if (val.field2 == 'country') {
                //             data['field' + c] = datas[i].field2;
                //             if (i == 0) arr['header']['field' + c] = 'ประเทศ';
                //             c++;
                //         }
                //     } else {
                //         data['field0'] = datas[i].field1;
                //         if (i == 0) arr['header']['field0'] = 'ประเทศ';
                //     }
                //     data['weight'] = datas[i].weight;
                //     data['avg_b'] = datas[i].avg_b;
                //     data['avg_d'] = datas[i].avg_d;
                //     data['value_b'] = datas[i].value_b;
                //     data['value_d'] = datas[i].value_d;
                //     data['hsCode'] = datas[i].hsCode;
                //     data['countryCode'] = datas[i].countryCode;
                //     arr['datas'].push(data);
                // }
                // let countHeader = Number(Object.keys(arr['header']).length);
                // if (isPivot) {
                //     arr.datas = arr['datas'].filter((f) => {
                //         return f.field0 != "" && f.field1 != "" && f.field2 != "" && f.field3 != "" && f.field4 != ""
                //     })
                // }
                // let countryName = '';
                // if (typeof val.countryCode !== 'undefined') {
                //     if (val.field1 == 'country') countryName = datas[0].field1;
                //     if (val.field2 == 'country') countryName = datas[0].field2;
                // }
            } else {
                res.ireport("custom/search/rpt_table1.jasper", req.query.export || "pdf", [], {});
            }
        });

}

// var val = (req.method == "GET" ? req.query : req.body);
    // var params = {
    //     // COLUMN_NAME1: (val.field1 == 'hamonize' ? 'ชนิดข้าว' : (val.field1 == 'country' ? 'ประเทศ' : 'บริษัท')),
    //     // COLUMN_NAME2: (val.field2 == 'hamonize' ? 'ชนิดข้าว' : (val.field2 == 'country' ? 'ประเทศ' : 'บริษัท')),
    //     // TRAN_TYPE: (val.tranType == 'e' ? 'ส่งออก' : (val.tranType == 'i' ? 'นำเข้า' : 'นำเข้า-ส่งออก')),
    //     MONTH: rpt.getMonthName(Number(req.query.modelMonth)),
    //     YEAR: req.query.modelYear,
    //     COLUMN_NAME1: (val.field1 == 'country' ? 'ประเทศ' : 'ชนิดข้าว'),
    //     COLUMN_NAME2: (val.field2 == 'hamonize' ? 'ชนิดข้าว' : 'ประเทศ'),
    //     TRAN_TYPE: val.tranType == 'i' ? 'นำเข้า' : 'ส่งออก',
    //     FILE_TYPE: req.query.export
    // };
    // // res.json(typeof val.view)
    // req.jdbc.query("mssql", `exec sp_stats_search_custom
    // @tranType=?,
    // @modelYear=?,
    // @modelMonth=?,
    // @field1=?,
    // @field2=?,
    // @hsCode=?,
    // @countryCode=?`,
    //     [val.tranType || 'E', val.modelYear, val.modelMonth || '00',
    //     val.field1 || 'hamonize', val.field2 || '', val.hsCode || '1006', val.countryCode || ''],
    //     function (err, data) {
    //         data = JSON.parse(data)
    //         // res.send(data);
    //         // res.send(params)
    //         var filename = 'rpt_' + val.view
    //             + (val.field2 != '' && typeof val.field2 !== 'undefined' ? '2' : '1');
    //         res.ireport("custom/search/" + filename + ".jasper", req.query.export || "pdf", data, params);
    //     });
