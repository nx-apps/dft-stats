exports.today = function (req, res) {
    var priceDate = req.query.priceDate + 'T00:00:00+07:00';
    var price = r.table('price').getAll(r.ISO8601(priceDate), { index: 'price_date' }).coerceTo('array');
    var newprice = r.table('price_config')
        .eqJoin('id', r.table('typerice')).without({ right: 'id' }).zip()
        .merge(function (m) {
            var lastPrice = r.table('price').getAll(m('id'), { index: 'rice_id' })
                .filter(function (f) {
                    return f('price_date').lt(r.ISO8601(priceDate))
                });
            var keyPrice = m.without('id', 'typerice').keys();
            return r.branch(lastPrice.count().eq(0),
                keyPrice.map(function (m2) {
                    return [r.expr('price_').add(m2), 0]
                }).coerceTo('object'),
                lastPrice.max('price_date').without('id', 'date_created', 'date_updated')
            ).merge({
                rice_id: m('id'),
                price_date: r.ISO8601(priceDate)
            })
        });

    r.branch(price.count().eq(0),
        newprice.without('id'),
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
                r.table('price').get(fe('id')).update(fe.merge({ date_updated: r.now().inTimezone('+07') })),
                r.table('price').insert(fe.merge({
                    price_date: r.ISO8601(fe('price_date')).inTimezone('+07'),
                    date_created: r.now().inTimezone('+07'),
                    date_updated: r.now().inTimezone('+07')
                }))
            )
        })
        .run().then(function (data) {
            res.json(data)
        })
}