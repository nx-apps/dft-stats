var rpt = require('../../global/report');
exports.exportrice = function (req, res) {

    // req.query.year = 2560;
    // req.query.startMonth = '01';
    // param.startMonth = rpt.getMonthName(Number(req.query.startMonth));
    // param.startMonth = rpt.getMonthName(Number(req.query.startMonth));
    // req.query.endMonth = '04';
    // var monthArr = ['01', '02', '03', '04','05','06'];

    var monthArr = [];
    for (var i = Number(req.query.startMonth); i <= Number(req.query.endMonth); i++) {
        var n = (i < 10 ? '0' + i : i);
        monthArr.push(n)
    }
    req.jdbc.query("mssql", "exec sp_stats_rpt_custom_exportrice @month=?, @year=?, @zone=?", [monthArr.join(','), req.query.year, req.query.zone],
        function (err, data) {
            // res.send(data);
            // console.log(req.query.year)
            req.r.json(data).run().then(function (d2) {
                var param = {
                    date: req.query.date
                };
                param.startMonth = rpt.getMonthName(Number(req.query.startMonth));
                param.endMonth = rpt.getMonthName(Number(req.query.endMonth));
                param.year = req.query.year;
                param.current_date = new Date().toISOString().slice(0, 10);
                param = rpt.keysToUpper(param);
                // res.json(param)
                res.ireport("custom/rpt_custom_exportrice.jasper", req.query.export || "pdf", d2, param)
                //     approveDate: req.query.date,
                //     FILE_TYPE: req.query.export,
                //     OUTPUT_NAME: params.current_date.replace(/-/g, '') + '_ปริมาณและมูลค่าการส่งออกข้าวขาวของไทย'
                // });
            })
        })
}


// var rpt = require('../../global/report')
//     req.query.year = 2560;
//     req.query.startMonth = '01';
//     param.startMonth = rpt.getMonthName(Number(req.query.startMonth));
//     param.startMonth = rpt.getMonthName(Number(req.query.startMonth));
//     req.query.endMonth = '04';
//     var monthArr = ['01', '02', '03', '04'];
//     // for(var i = Number(req.query.startMonth );i<=Number(req.query.endMonth );i++){
//     //     //01
//     //     //02
//     //     //03
//     //     monthArr.push(i)
//     // }
//     monthArr.join(',') //=> @month= '01,02,03,04' ==> fn_split(@month,',')