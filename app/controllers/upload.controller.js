var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
var stream = require('stream');

exports.uploadMc = function (req, res) {
    var form = new multiparty.Form();

    form.parse(req, function (err, fields, files) {
        var prefile = files.file[0];
        let fileName = prefile.headers['content-disposition'].split('"')
        // console.log(fileName[3]);
        fs.readFile(prefile.path, function (err, data) {
            // console.log(data);
            fs.writeFile('./public/files/' + fileName[3], data, ['utf8'], (err) => {
                if (err) {
                    return console.log(err);
                }
                else {
                    // console.log("The file was saved!");
                    res.status(200).json('FIN');
                    // res.writeHead(200, { 'content-type': 'text/plain' });
                    // res.write('received upload:\n\n');
                    // res.end(util.inspect({ fields: fields, files: files }));
                }
            })
        })

    });

    return;
}