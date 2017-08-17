exports.today = function (req, res) {
    var priceDate = req.query.priceDate + 'T00:00:00+07:00';
    var price = r.table('price').getAll(r.ISO8601(priceDate), { index: 'price_date' }).coerceTo('array');
    var newprice = r.table('price_config')
        .eqJoin('id', r.table('typerice')).without({ right: 'id' }).zip()
        .merge({
            rice_id: r.row('id'),
            price_dit: 0,
            price_fob: 0,
            price_thai: 0,
            price_paddy: 0,
            price_usa: 0,
            price_india: 0,
            price_vietnam: 0,
            price_pakistan: 0,
            price_date: r.ISO8601(priceDate)
        });
    r.branch(price.count().eq(0),
        newprice.without('id')
        // r.table('price').insert(newprice.without('id'))
        //     .do(function (d) {
        //         return price
        //     })
        ,
        price.eqJoin('rice_id', r.table('price_config')).without({ right: 'id' }).zip()
            .merge(function (m) {
                return {
                    typerice: r.table('typerice').get(m('rice_id')).getField('typerice')
                }
            })
    )
        .orderBy('rice_id')
        .run()
        .then(function (data) {
            res.json(data)
        })
}
exports.update = function (req, res) {
    r.expr(req.body)
        // .filter(function (f) {
        //     return f.hasFields('id')
        // })
        // .pluck(
        //     'id',
        //     'price_dit',
        //     'price_fob',
        //     'price_thai',
        //     'price_paddy',
        //     'price_usa',
        //     'price_india',
        //     'price_vietnam',
        //     'price_pakistan'
        //     )
        .forEach(function (fe) {
            return r.branch(fe.hasFields('id'),
                r.table('price').get(fe('id')).update(fe),
                r.table('price').insert(fe.merge({ price_date: r.ISO8601(fe('price_date')).inTimezone('+07') }))
            )
        })
        .run().then(function (data) {
            res.json(data)
        })
}