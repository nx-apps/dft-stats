exports.getCountry = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT * from fn_stats_get_country(?,?,?) order by label`, [req.query.tranType || 'e', req.query.dateStart, req.query.dateEnd],
        function (err, data) {
            res.send(data)
        })
}
exports.list = function (req, res) {
    // //console.log(1111);
    var j = req.jdbc;

    var sql = `select 
            country_code,
            country_name,
            country_name_TH
            from P_Country_edi 
            where country_code != '99' `
    // res.json(sql);
    j.query("mssql", sql, [],
        function (err, data) {
            res.send(data)
        })
}
exports.search = function (req, res) {
    // //console.log(req.body);
    req.body.tranType = req.body.tranType || 'a'
    req.body.countryCode = req.body.countryCode || ''
    req.body.dateStart = req.body.dateStart || '2017-01-01'
    req.body.dateEnd = req.body.dateEnd || '2017-01-30'
    req.body.field2 = req.body.field2 ||''
    req.body.field3 = req.body.field3 ||''
    // //console.log(req.body);
    var j = req.jdbc;
    j.query("mssql", `exec sp_stats_search_country @tranType= ?,@countryCode= ?, @dateStart= ?, @dateEnd= ?,
     @field2= ?, @field3= ?`,
        [req.body.tranType ,req.body.countryCode, req.body.dateStart, req.body.dateEnd,req.body.field2 , req.body.field3],
        function (err, data) {
            // //console.log(data);
            res.send(data);
        })
}
