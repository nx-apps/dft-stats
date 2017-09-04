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
    var month = '08';
    var workbook = XLSX.readFile(`../dft-stats/files/thaiprice60/${month}.xlsx`);
    // console.log(workbook)
    var file = workbook.Sheets;
    var data = [];
    var arr1 = {
        "ข.หอมA": 1,
        "ข.หอมB": 2,
        "ข.หอมปทุมฯ": 3,
        "ข.100%B": 4,
        "ข.100%C": 5,
        "5% ": 7,
        "10%": 8,
        "15%": 9,
        "25%": 11,
        "35%": 12,
        "45%": 13,
        "55%": 14,
        "ปขข.A1เลิศ": 15,
        "ปขข.A1พิเศษ": 16,
        "ขน.10%": 22,
        "ข.นึ่ง100%": 17,
        "ข.นึ่ง5%": 18,
        "ข.นึ่ง10%": 19,
        "ข.นึ่ง15%": 20,
        "ปข.นึ่งA1": 21
    };
    var arr2 = {
        1: ' ข.หอม A',
        2: ' ข.หอม B',
        3: ' ข.หอมปทุมฯ',
        4: 'ข.100%B',
        5: 'ข.100%C',
        7: '5% ',
        8: '10%',
        9: '15%',
        11: '25%',
        12: '    35%',
        13: '45%',
        14: '55%',
        15: 'ปขข.A1เลิศ',
        16: 'ปขข.A1พิเศษ',
        22: 'ขน.10%',
        17: 'ข.นึ่ง 100%',
        18: 'ข.นึ่ง 5%',
        19: 'ข.นึ่ง 10%',
        20: 'ข.นึ่ง 15%',
        21: 'ปข.นึ่งA1'
    }
    for (var sheet in file) {
        var price = XLSX.utils.sheet_to_json(file[sheet])
            .map(function (m) {
                var count = 1;
                return Object.keys(m).map(function (m2) {
                    if (arr1.hasOwnProperty(m2.replace(/ /g, '')))
                        var p = Number(m[arr2[arr1[m2.replace(/ /g, '')]]].replace(/,/g, ''));
                    return {
                        rice_id: arr1[m2.replace(/ /g, '')],
                        price_dit: (isNaN(p) ? 0 : p)
                    }
                })
            })[0].filter((f) => typeof f.rice_id !== 'undefined');
        data.push({
            price_date: `2017-${month}-` + (Number(sheet) < 10 ? '0' + sheet : sheet) + 'T00:00:00+07:00',
            data: price
        })
    }
    for (var x in data) {
        data[x].data.push({ rice_id: 6, price_dit: 0 });
        data[x].data.push({ rice_id: 7, price_dit: 0 });
        data[x].data.push({ rice_id: 10, price_dit: 0 });
    }
    // res.json(data);
    // r.expr(data).forEach(function (row) {
    //     return r.db('stats').tableList().contains(row('table'))
    //         .do(function (tbExists) {
    //             return r.branch(tbExists,
    //                 r.db('stats').table(row('table')).delete(),
    //                 r.db('stats').tableCreate(row('table'))
    //             ).do(function (tbInsert) {
    //                 return r.db('stats').table(row('table')).insert(row('data'))
    //             })
    //         })
    // })
    r.table('dit')
        .insert(data)
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
                            date_created: r.now().inTimezone('+07'),
                            date_updated: r.now().inTimezone('+07')
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
exports.dit = function (req, res) {
    r.table('dit')
        .merge(function (m) {
            return {
                have: r.table('price').getAll(r.ISO8601(m('price_date')), { index: 'price_date' }).count()
            }
        })
        .forEach(function (fe) {
            return r.branch(fe('have').gt(0),
                fe('data').forEach(function (m2) {
                    return r.table('price').getAll([r.ISO8601(fe('price_date')), m2('rice_id')], { index: 'priceDateRiceId' })
                        .update({ price_dit: m2('price_dit') })
                }),
                fe('data').forEach(function (m2) {
                    return r.table('price').insert({
                        rice_id: m2('rice_id'),
                        price_fob: 0,
                        price_dit: m2('price_dit'),
                        price_thai: 0,
                        price_paddy: 0,
                        price_usa: 0,
                        price_india: 0,
                        price_vietnam: 0,
                        price_pakistan: 0,
                        price_date: r.ISO8601(fe('price_date')),
                        date_created: r.now().inTimezone('+07'),
                        date_updated: r.now().inTimezone('+07')
                    })
                })
            )
        })
        .run()
        .then(function (data) {
            res.json(data)
        })
}
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