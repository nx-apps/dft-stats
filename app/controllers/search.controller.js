exports.list = function (req, res) {
    let date = new Object()
    let today = new Date(new Date().setFullYear(new Date().getFullYear()))
    var dd = req.query;
    if (req.method == "POST") dd = req.body;
    let tranType = dd.tranType || 'a'
    let field1 = dd.field1 || ''
    let field2 = dd.field2 || ''
    let field3 = dd.field3 || ''
    let value1 = dd.value1 || ''
    let value2 = dd.value2 || ''
    let value3 = dd.value3 || ''
    let dateStart = dd.dateStart || date
    let dateEnd = dd.dateEnd || today

    var j = req.jdbc;
    j.query("mssql", `exec sp_stats_search_3in1 
    @tranType=?,
    @dateStart=?,
    @dateEnd=?,
    @field1=?,
    @field2=?,
    @field3=?,
    @value1=?,
    @value2=?,
    @value3=?`,
        [tranType, dateStart, dateEnd,
            field1, field2, field3,
            value1, value2, value3],
        function (err, data) {
            res.send(data);
        });
}