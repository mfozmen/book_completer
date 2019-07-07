'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var scraper = function () {
    function scraper(book) {
        _classCallCheck(this, scraper);

        this.requestTimeout = 60000;
        this.regexISBN13 = /([0-9]){13}/;
        this.book = book;
        this.siteUrl = '';
        this.searchUrl = '';
    }

    _createClass(scraper, [{
        key: 'completeBookAsync',
        value: function completeBookAsync() {
            return new Promise(function (resolve, reject) {
                var _this = this;

                this.searchAsync().then(function (body) {
                    return _this.parseDetailsUrl(body);
                }).then(function (detailsUrl) {
                    return _this.getDetailsPageAsync(detailsUrl);
                }).then(function (detailsPage) {
                    return _this.parseBook(detailsPage);
                }).then(function (book) {
                    _this.copyProperties(book);
                    resolve(book);
                }).catch(function (e) {
                    return reject(e);
                });
            }.bind(this));
        }
    }, {
        key: 'searchAsync',
        value: function searchAsync() {
            return new Promise(function (resolve, reject) {
                var uri;
                if (this.book.title) uri = encodeURI('' + this.searchUrl + this.book.title);else if (this.book.isbn13) uri = encodeURI('' + this.searchUrl + this.book.isbn13);

                (0, _request2.default)(uri, {
                    timeout: this.requestTimeout
                }, function (err, _response, body) {
                    if (err) reject(err);else resolve(body);
                });
            }.bind(this));
        }
    }, {
        key: 'getDetailsPageAsync',
        value: function getDetailsPageAsync(detailsUrl) {
            return new Promise(function (resolve, reject) {
                (0, _request2.default)(detailsUrl, {
                    timeout: this.requestTimeout
                }, function (err, _response, body) {
                    if (err) reject(err);else resolve(body);
                });
            }.bind(this));
        }
    }, {
        key: 'copyProperties',
        value: function copyProperties(book) {
            for (var i = 0; i < Object.keys(this.book).length; i++) {
                var prop = Object.keys(this.book)[i];
                if (book[prop] !== this.book[prop]) this.book[prop] = book[prop];
            }
            this.book.image = book.image;
        }
    }]);

    return scraper;
}();

exports.default = scraper;