var XLSX = require('xlsx');
exports.read = function (req, res) {
    r.table('upload').get(req.query.id)
        .run()
        .then(function (fileUpload) {
            var workbook = XLSX.readFile('../dft-stats/public/files/' + fileUpload.file_path);
            var file = workbook.Sheets;
            var data = [];
            for (var sheet in file) {
                data.push({
                    sheet_name: sheet,
                    data: XLSX.utils.sheet_to_json(file[sheet])
                });
            }
            res.json(data);
        })

}
exports.init = function (req, res) {
    var workbook = XLSX.readFile('../dft-stats/public/files/fob.xlsx');
    var file = workbook.Sheets;
    var data = [];
    // for (var sheet in file[]) {
    data.push({
        table: 'fob',
        data: XLSX.utils.sheet_to_json(file['fob'])
    });
    // }
    // res.json(data);
    r.expr(data).forEach(function (row) {
        return r.db('stats').tableList().contains(row('table'))
            .do(function (tbExists) {
                return r.branch(tbExists,
                    r.db('stats').table(row('table')).delete(),
                    r.db('stats').tableCreate(row('table'))
                ).do(function (tbInsert) {
                    return r.db('stats').table(row('table')).insert(row('data'))
                })
            })
    })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.convert = function (req, res) {
    var key = r.db('stats').table('fob')(0).without('id', 'price_date', 'month', 'date', 'year').keys();
    var fob = r.db('stats').table('fob')
        .map(function (m) {
            return m.pluck('price_date')
                .merge({
                    rice_id: key.map(function (m2) {
                        return {
                            rice_id: m2.coerceTo('number'),
                            price_fob: m(m2).coerceTo('number'),
                            price_dit: 0,
                            price_thai: 0,
                            price_paddy: 0,
                            price_usa: 0,
                            price_india: 0,
                            price_vietnam: 0,
                            price_pakistan: 0,
                            price_date: m('price_date'),
                            date_created:r.now().inTimezone('+07'),
                            date_updated:r.now().inTimezone('+07')
                        }
                    })
                        .eqJoin('rice_id', r.table('price_config')).without({ right: 'id' }).zip()
                })
        })
        .getField('rice_id')
        .reduce(function (left, right) {
            return left.add(right)
        });
    r.table('price').insert(fob)
        .run().then(function (data) {
            res.json(data);
        })
}
 r.expr(dataSheet).forEach(function (row) {
        return r.db('stats').tableList().contains(row('table'))
            .do(function (tbExists) {
                return r.branch(tbExists,
                    r.db('stats').table(row('table')).delete(),
                    r.db('stats').tableCreate(row('table'))
                ).do(function (tbInsert) {
                    return r.db('stats').table(row('table')).insert(row('data'))
                })
            })
    })
function str2NumOnly(string) { //input AB123  => output 123
    let t = [];
    for (let i = 0; i < string.length; i++) {
        if ((string[i].charCodeAt(0) >= 48) && (string[i].charCodeAt(0) <= 57)) {
            t.push(string[i].charCodeAt(0));
        }
    }
    return String.fromCharCode(t);
}
function str2CharOnly(string) { //input AB123  => output AB
    let t = [];
    for (let i = 0; i < string.length; i++) {
        if ((string[i].charCodeAt(0) >= 65) && (string[i].charCodeAt(0) <= 90)) {
            t.push(string[i].charCodeAt(0));
        }
    }
    return String.fromCharCode.apply(String, t);
}
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}