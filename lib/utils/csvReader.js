'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _csvtojson = require('csvtojson');

var _csvtojson2 = _interopRequireDefault(_csvtojson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var csvReader = function () {
    function csvReader(file, limit, offset) {
        _classCallCheck(this, csvReader);

        this.file = file;
        if (offset) {
            this.start = offset;
            if (limit) this.end = limit + offset;
        }
    }

    _createClass(csvReader, [{
        key: 'readLineAsync',
        value: function readLineAsync(next) {
            var opts = this.createOptions();
            (0, _csvtojson2.default)({
                delimiter: [';']
            }).fromFile(this.file, opts).subscribe(function (data) {
                if (data) next(new Promise(function (resolve) {
                    resolve(data);
                }));
            });
        }
    }, {
        key: 'createOptions',
        value: function createOptions() {
            var options = {};
            if (this.start) options.start = this.start;
            if (this.end) options.end = this.end;

            return options;
        }
    }]);

    return csvReader;
}();

exports.default = csvReader;