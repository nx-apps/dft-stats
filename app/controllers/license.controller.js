// var today = new Date();
// var dd = today.getDate();
// var dt = today.getDate() + 1;
// var mm = today.getMonth() + 1; //January is 0!
// var yyyy = today.getFullYear();
// if (dd < 10) {
//     dd = '0' + dd;
// }
// if (dt < 10) {
//     dt = '0' + dt;
// }
// if (mm < 10) {
//     mm = '0' + mm;
// }
// var today = '2016' + '-' + mm + '-' + dd;
// var tomorrow = '2016' + '-' + mm + '-' + dt;

exports.get = function (req, res) {
    var j = req.jdbc;
    var val = req.query;
    // //console.log(req.query);
    if (req.method == "POST") val = req.body;
    if (typeof val.dateStart === "undefined") val.dateStart = '';
    if (typeof val.dateEnd === "undefined") val.dateEnd = '';
    if (typeof val.refCode === "undefined") val.refCode = '';
    // //console.log(val);
    // val
    // let reference_code2 = req.query.reference_code2 || ''
    j.query("mssql", `exec sp_stats_search_refcode @refCode= ? ,@dateStart= ?, @dateEnd= ?, @dataType= ?`,
        [val.refCode, val.dateStart, val.dateEnd,'license'],
        // j.query("mssql", `select * from hamonize_type`, [],
        function (err, data) {
            // //console.log(data);
            res.send(data)
        })
}
