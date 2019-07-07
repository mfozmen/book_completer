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
    function csvReader(file, limit) {
        var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, csvReader);

        this.file = file;
        this.limit = limit;
        this.offset = offset;
    }

    _createClass(csvReader, [{
        key: 'readAsync',
        value: function readAsync() {
            var _this = this;

            return (0, _csvtojson2.default)({
                delimiter: [';']
            }).fromFile(this.file).then(function (data) {
                var start = _this.offset;
                var end = data.length;
                if (_this.limit) end = _this.limit + _this.offset;
                return data.slice(start, end);
            });
        }
    }]);

    return csvReader;
}();

exports.default = csvReader;