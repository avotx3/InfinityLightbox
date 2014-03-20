var through = require('through2');
var gutil = require('gulp-util');
var fs = require('fs');
var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'replacer';

function replacer(token, fileOfReplace, fileToReplace) {

    var content,filed,echo;

    filed = fs.readFileSync(fileOfReplace);

    var stream = through.obj(function (file, enc, callback) {
        if (file.isNull()) {
            return callback();
        }
        if (file.isBuffer()) {
            var echo = String(filed).replace(token, String(file.contents));

            file.base = '/';
            file.path = '/'+fileToReplace;
            file.contents = new Buffer(echo);

            return callback(null, file);
        }
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Stream not supported!'));
            return callback();
        }
    })
    return stream;
}

module.exports = replacer;