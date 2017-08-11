exports.today = function (req, res) {
    var price = r.table('price').getAll(r.ISO8601(req.query.priceDate + 'T00:00:00+07:00'), { index: 'price_date' }).coerceTo('array');
    var newprice = r.table('price_config')
        .eqJoin('rice_id', r.table('typerice')).without({ right: 'id' }).zip()
        .merge({
            price_dit: 0,
            price_fob: 0,
            price_thai: 0,
            price_paddy: 0,
            price_usa: 0,
            price_india: 0,
            price_vietnam: 0,
            price_pakistan: 0,
            price_date: r.now().inTimezone('+07').date()
        });
    r.branch(price.eq([]),
        r.table('price').insert(newprice).do(function (d) {
            return price
        }),
        price
    ).orderBy('rice_id')
        .run()
        .then(function (data) {
            res.json(data)
        })
}
exports.update = function (req, res) {
    r.expr(req.body).pluck(
        'id',
        'price_dit',
        'price_fob',
        'price_thai',
        'price_paddy',
        'price_usa',
        'price_india',
        'price_vietnam',
        'price_pakistan'
    ).forEach(function (fe) {
        return r.table('price').get(fe('id'))
            .update(
            fe.merge({
                price_date: r.ISO8601(fe('price_date')).inTimezone('+07')
            })
            )
    })
        .run().then(function (data) {
            res.json(data)
        })
}