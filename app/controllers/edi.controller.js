exports.getHamonize = function (req, res) {
    var j = req.jdbc;

    j.query("mssql", `SELECT * from fn_stats_get_hamonize(?,?,?) order by hamonize_code,hamonize_year`, [req.query.tranType || 'e', req.query.dateStart, req.query.dateEnd],
        function (err, data) {
            res.send(data)
        })
}
exports.getHamonizeGroup = function (req, res) {
    var j = req.jdbc;

    j.query("mssql", `SELECT * from fn_stats_get_hamonize_group(?,?,?) order by typerice_name,hamonize_code,hamonize_year`, [req.query.tranType || 'e', req.query.dateStart, req.query.dateEnd],
        function (err, data) {
            data = JSON.parse(data);
            var arr = [];
            var temp = '';
            for (var i = 0; i < data.length; i++) {
                if (temp != data[i].typerice_name) {
                    arr.push({ group_name: data[i].typerice_name, group_item: [] })
                    temp = data[i].typerice_name
                }
                arr.filter((f) => f.group_name == data[i].typerice_name)[0].group_item.push(data[i])
                // console.log(i)
            }
            res.json(arr)
        })
}
exports.getCompany = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT * from fn_stats_get_company(?,?,?) order by label`, [req.query.tranType || 'e', req.query.dateStart, req.query.dateEnd],
        function (err, data) {
            res.send(data)
        })
}
exports.getCountry = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `SELECT * from fn_stats_get_country(?,?,?) order by label`, [req.query.tranType || 'e', req.query.dateStart, req.query.dateEnd],
        function (err, data) {
            res.send(data)
        })
}
exports.getSearch = function (req, res) {
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
exports.getCert = function (req, res) {
    var j = req.jdbc;
    var val = req.query;
    if (req.method == "POST") val = req.body;
    if (typeof val.dateStart === "undefined") val.dateStart = '';
    if (typeof val.dateEnd === "undefined") val.dateEnd = '';
    if (typeof val.refCode === "undefined") val.refCode = '';
    if (typeof val.type === "undefined") val.type = 'cert';
    j.query("mssql", `exec sp_stats_search_refcode @refCode= ? ,@dateStart= ?, @dateEnd= ?, @dataType= ?`,
        [val.refCode, val.dateStart, val.dateEnd,val.type],
        function (err, data) {
            res.send(data)
        })
}
