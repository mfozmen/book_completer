'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _json2csv = require('json2csv');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var path = require('path');

var csvWriter = function () {
    function csvWriter(file) {
        _classCallCheck(this, csvWriter);

        this.file = file;
        this.fields = ['authors', 'title', 'price', 'isbn13', 'image'];
        this.opts = {
            fields: this.fields,
            header: false,
            delimiter: ';'
        };
        this.create();
    }

    _createClass(csvWriter, [{
        key: 'create',
        value: function create() {
            this.csv = '';
            for (var i = 0; i < this.opts.fields.length; i++) {
                var field = this.opts.fields[i];
                this.csv += '' + field + this.opts.delimiter;
            }
            this.csv = this.csv.slice(0, -1); // Remove last delimiter
            this.csv += '\r\n';
        }
    }, {
        key: 'append',
        value: function append(book) {
            this.csv += (0, _json2csv.parse)(book, this.opts) + '\r\n';
        }
    }, {
        key: 'writeToFileAsync',
        value: function writeToFileAsync() {
            return new Promise(function (resolve, reject) {
                if (this.ensureDirectoryExistence(this.file)) {
                    fs.writeFile(this.file, this.csv, function (err) {
                        if (err) reject(err);else resolve(true);
                    });
                }
            }.bind(this));
        }
    }, {
        key: 'ensureDirectoryExistence',
        value: function (_ensureDirectoryExistence) {
            function ensureDirectoryExistence(_x) {
                return _ensureDirectoryExistence.apply(this, arguments);
            }

            ensureDirectoryExistence.toString = function () {
                return _ensureDirectoryExistence.toString();
            };

            return ensureDirectoryExistence;
        }(function (filePath) {
            var dirname = path.dirname(filePath);
            if (fs.existsSync(dirname)) {
                return true;
            }
            ensureDirectoryExistence(dirname);
            fs.mkdirSync(dirname);
        })
    }]);

    return csvWriter;
}();

exports.default = csvWriter;