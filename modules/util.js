var fs = require("fs");
var path = require("path");

var findFiles = function (rootPath, extension, excludeFiles, res, verbose) {
    if (!fs.existsSync(rootPath))
        return;

    var targetPath = fs.readdirSync(rootPath);

    for (var i = 0; i < targetPath.length; i++) {
        var filePath = path.join(rootPath, targetPath[i]);
        var fileStat = fs.lstatSync(filePath);

        if (fileStat.isDirectory())
            findFiles(filePath, extension, excludeFiles, res, verbose);
        else {
            var flag = false;

            for (var j = 0; j < excludeFiles.length; j++) {
                if (filePath == excludeFiles[j]) {
                    flag = true;
                    break;
                }
            }

            if (flag)
                continue;

            if (verbose)
                console.log("[find] " + filePath);

            if (new RegExp(extension + "$", "gim").test(filePath))
                res.push(filePath);
        }
    }
};

var util = {
    findFiles: findFiles
};

module.exports = util;