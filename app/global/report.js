const arrMonth = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
exports.keysToUpper = function (param) {
    var keyname = Object.keys(param);
    for (var i = 0; i < keyname.length; i++) {
        param[keyname[i].toUpperCase()] = param[keyname[i]];
        if (keyname[i] != keyname[i].toLowerCase() && keyname[i] != keyname[i].toUpperCase()) { // if CURrent_DATE != current_date and CURrent_DATE != CURRENT_DATE
            delete param[keyname[i]]; //CURrent_DATE
        } else {
            delete param[keyname[i].toLowerCase()];
        }
    }
    return param;
}
exports.getMonthName = function (index) {
    return arrMonth[index];
}
exports.getMonthNameRethink = function (index) {
    return r.expr(arrMonth)(index);
}