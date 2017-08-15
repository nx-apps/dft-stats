var XLSX = require('xlsx');
exports.read = function (req, res) {
    r.table('upload').get(req.query.id)
        .run()
        .then(function (fileUpload) {
            var workbook = XLSX.readFile('../dft-stats/public/files/' + fileUpload.file_path);

            var file = workbook.Sheets;
            // res.json(file);
            var data = {};
            var temp = { db: "", col: [], maxCol: "" };
            var keyIndex = 1; //num row has field_key
            var row = {};
            // // res.json(file);
            for (var sheet in file) {
                for (var key in file[sheet]) {
                    if (key !== '!ref' && key !== '!margins' && key !== '!autofilter' && key !== '!sort') {
                        if (str2NumOnly(key) == keyIndex) {
                            console.log(file[sheet][key].v);
                            // temp.col[str2CharOnly(key)] = file[sheet][key].v;
                            // temp.maxCol = str2CharOnly(key);
                        } else {
                            // if (temp.col[str2CharOnly(key)].indexOf("date") > -1) {
                            //     row[temp.col[str2CharOnly(key)]] = file[sheet][key].w;
                            // } else {
                            //     row[temp.col[str2CharOnly(key)]] = file[sheet][key].v;
                            // }
                            // if (str2CharOnly(key) == temp.maxCol) {
                            //     data[temp.db].push(row);
                            //     row = {};
                            // }
                        }

                    } else {
                        temp.col = [];
                        temp.db = sheet;
                        if (!data.hasOwnProperty(sheet)) {
                            data[sheet] = [];
                        }
                    }
                }
            }
            // var dataSheet = [];
            // for (table in data) {
            //     dataSheet.push({ table: table, data: data[table] });
            // }

            res.json(fileUpload);
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