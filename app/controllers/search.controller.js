exports.list = function (req, res) {
    let date = new Object()
    let today = new Date(new Date().setFullYear(new Date().getFullYear()))
    req.body.tranType = req.body.tranType || 'a'
    req.body.field1 = req.body.field1 || ''
    req.body.field2 = req.body.field2 || ''
    req.body.field3 = req.body.field3 || ''
    req.body.value1 = req.body.value1 || ''
    req.body.value2 = req.body.value2 || ''
    req.body.value3 = req.body.value3 || ''
    req.body.dateStart = req.body.dateStart || date
    req.body.dateEnd = req.body.dateEnd || today

    var j = req.jdbc;
    j.query("mssql", `exec sp_stats_search_company 
    @tranType=?,
    @dateStart=?,
    @dateEnd=?,
    @field1=?,
    @field2=?,
    @field3=?,
    @value1=?,
    @value2=?,
    @value3=?`,
        [req.body.tranType, req.body.dateStart, req.body.dateEnd,
        req.body.field1, req.body.field2, req.body.field3,
        req.body.value1, req.body.value2, req.body.value3],
        function (err, data) {
            res.send(data);
        });
}