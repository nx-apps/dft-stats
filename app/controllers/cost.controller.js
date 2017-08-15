exports.today = function (req, res) {
    var costDate = req.query.costDate + 'T00:00:00+07:00';
    var cost = r.table('cost').filter(function (f) {
        return f('cost_date').inTimezone('+07').date().le(r.ISO8601(costDate))
            .and(
            f('cost_end').inTimezone('+07').date().ge(r.ISO8601(costDate))
            )
    }).coerceTo('array');
    r.branch(cost.eq([]), [], cost(0))
        .run()
        .then(function (data) {
            res.json(data)
        })
}
exports.update = function (req, res) {
    var oldData = r.table('cost').filter(function (f) {
        return f('cost_date').inTimezone('+07').date().le(r.ISO8601(req.body.cost_date))
            .and(
            f('cost_end').inTimezone('+07').date().ge(r.ISO8601(req.body.cost_date))
            )
    }).coerceTo('array');
    var Reql;
    if (typeof req.body.id === "undefined") {
        Reql = r.expr(req.body).merge(function (m) {
            var costDate = r.ISO8601(m('cost_date'));
            return {
                cost_date: costDate,
                cost_end: oldData(0)('cost_end')
            }
        }).do(function (d) {
            var endDateNew = r.time(d('cost_date').year(),
                d('cost_date').month(),
                d('cost_date').day().sub(1),
                '+07');
            return r.table('cost').insert(d)
                .do(r.table('cost').get(oldData(0)('id')).update({ cost_end: endDateNew }))
        })
    } else {
        Reql = r.table('cost').get(req.body.id).update(r.expr(req.body).without('cost_date', 'cost_end', 'id'))
    }

    Reql.run().then(function (data) {
        res.json(data);
    })
}