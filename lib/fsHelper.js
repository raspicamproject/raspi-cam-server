var fs = require('fs'),
    path = require('path');

exports.clearDir = function(dirPath) {
    try {
        var files = fs.readdirSync(dirPath);
    } catch (e) {
        return;
    }
    var length = files.length;
    if (length > 0) {
        for (var i = 0; i < length; i++) {
            fs.unlinkSync(path.join(dirPath, files[i]));
        }
    }
}