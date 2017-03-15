exports.list = function (req, res) {
    var r = req.r;
    r.table('hamonize_type')
        .run()
        .then(function (data) {
            res.json(data)
        })
}