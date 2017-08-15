var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
var stream = require('stream');

exports.listUpload = function (req, res) {
    r.db('stats').table('upload')
        .orderBy(r.desc('data_uploaded'))
        .run()
        .then(function (result) {
            res.json(result);
        }).catch(function (err) {
            res.json(err);
        })
}
exports.uploadMc = function (req, res) {
    var form = new multiparty.Form();

    form.parse(req, function (err, fields, files) {
        var prefile = files.file[0];
        let time = new Date().toISOString().split('T')[0]
        let fileName = prefile.headers['content-disposition'].split('"')[3]
        let newFileName = time + '-' + fileName
        // console.log(fileName[3]);
        fs.readFile(prefile.path, function (err, data) {
            // console.log(data);
            fs.writeFile('./public/files/' + newFileName, data, ['utf8'], (err) => {
                if (err) {
                    return console.log(err);
                }
                else {
                    let data = {
                        file_name: fileName,
                        file_path: newFileName,
                        data_uploaded: r.now().inTimezone('+07'),
                    }
                    r.db('stats').table('upload')
                        .insert(data)
                        .run()
                        .then(function (result) {
                            res.json(result);
                        }).catch(function (err) {
                            res.json(err);
                        })
                }
            })
        })

    });

    return;
}