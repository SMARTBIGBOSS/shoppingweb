let fs = require('fs');
var path = require("path");
let dir = 'uploads/sellers/' + '1' + '/products/' + '1' + '/details';

// fs.exists('uploads/seller/1', function(exist){
//     console.log(exist);
// });
//
// fs.mkdir('uploads/seller/1', function(path){
//     console.log(path);
// });

//Asynchronous
function buildFolder(dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (exists) {
            callback();
        } else {
            //console.log(path.dirname(dirname));
            buildFolder(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback);
            });
        }
    });
}

//Synchronize
function buildFolderSync(dirname) {
    //console.log(dirname);
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (buildFolderSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

// buildFolder('uploads/sellers/' + '1' + '/products/' + '1' + '/details', function (err) {
//     console.log(err);
// });
// buildFolderSync('./uploads/sellers/' + '1' + '/products/' + '1' + '/details');

module.exports.buildFolder = buildFolder;
module.exports.buildFolderSync = buildFolderSync;
