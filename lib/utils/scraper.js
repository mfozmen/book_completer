'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _nodeHtmlParser = require('node-html-parser');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var download = require('image-downloader');
var uuidv1 = require('uuid/v1');
var fs = require('fs');

var scraper = function () {
    function scraper(book) {
        _classCallCheck(this, scraper);

        this.requestTimeout = 60000;
        this.localImageDir = './img/';
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
                    if (detailsUrl) return _this.getDetailsPageAsync(detailsUrl);else {
                        _logger2.default.error('The book ' + JSON.stringify(_this.book) + ' is not found.');
                        return null;
                    }
                }).then(function (detailsPage) {
                    if (detailsPage) return _this.parseBookAsync(detailsPage);else return null;
                }).then(function (book) {
                    if (book) {
                        _this.copyProperties(book);
                        resolve(book);
                    } else resolve(_this.book);
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
        key: 'parseBookAsync',
        value: function parseBookAsync(detailsPage) {
            return new Promise(function (resolve) {
                var _this2 = this;

                var root = (0, _nodeHtmlParser.parse)(detailsPage);
                var parsedBook = {
                    title: this.extractTitle(root),
                    authors: this.extractAuthors(root),
                    price: this.extractPrice(root),
                    isbn13: this.extractISBN13(root)
                };
                this.extractImageAsync(root).then(function (fileName) {
                    parsedBook.image = fileName;
                    return parsedBook;
                }).catch(function () {
                    return _logger2.default.error('Unable to download image for (' + JSON.stringify(_this2.book) + ')');
                }).then(function () {
                    return resolve(parsedBook);
                });
            }.bind(this));
        }
    }, {
        key: 'downloadImageAsync',
        value: function downloadImageAsync(url, fileName) {
            this.createDirIfNotExists(this.localImageDir);
            var options = {
                url: url,
                dest: '' + this.localImageDir + fileName
            };
            return new Promise(function (resolve, reject) {
                download.image(options).then(function (_ref) {
                    var filename = _ref.filename;

                    resolve(filename);
                }).catch(function (err) {
                    reject(err);
                });
            });
        }
    }, {
        key: 'copyProperties',
        value: function copyProperties(book) {
            for (var i = 0; i < Object.keys(this.book).length; i++) {
                var prop = Object.keys(this.book)[i];
                if (book[prop] !== this.book[prop]) {
                    if (prop === 'isbn13' && this.book.isbn13 && book.isbn13) {
                        _logger2.default.info('The book "' + this.book.title + '" has invalid ISBN13. It\'s updating. Old Value: ' + this.book.isbn13 + ', New Value: ' + book.isbn13);
                    }
                    this.book[prop] = book[prop];
                }
            }
            this.book.image = book.image;
        }
    }, {
        key: 'generateGuid',
        value: function generateGuid() {
            return uuidv1();
        }
    }, {
        key: 'createDirIfNotExists',
        value: function createDirIfNotExists(dir) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        }
    }]);

    return scraper;
}();

exports.default = scraper;