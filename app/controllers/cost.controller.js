exports.today = function (req, res) {
    r.table('cost').filter(function (f) {
        return f('cost_date').inTimezone('+07').date().le(r.ISO8601(req.query.costDate + 'T00:00:00+07:00'))
            .and(
            f('cost_end').inTimezone('+07').date().gt(r.ISO8601(req.query.costDate + 'T00:00:00+07:00'))
            )
    }).coerceTo('array')
        .run()
        .then(function (data) {
            res.json(data)
        })
}
exports.update = function (req, res) {
    var newdate = req.body.newdate;
    res.json(newdate);
}