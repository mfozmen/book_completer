"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _scraper2 = require("./scraper");

var _scraper3 = _interopRequireDefault(_scraper2);

var _nodeHtmlParser = require("node-html-parser");

var _stringExtensions = require("./stringExtensions");

var _stringExtensions2 = _interopRequireDefault(_stringExtensions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var drScraper = function (_scraper) {
    _inherits(drScraper, _scraper);

    function drScraper(book) {
        _classCallCheck(this, drScraper);

        var _this = _possibleConstructorReturn(this, (drScraper.__proto__ || Object.getPrototypeOf(drScraper)).call(this, book));

        _this.siteUrl = "https://www.dr.com.tr";
        _this.searchUrl = _this.siteUrl + "/search?q=";
        return _this;
    }

    _createClass(drScraper, [{
        key: "parseDetailsUrl",
        value: function parseDetailsUrl(body) {
            var detailsUrl;
            var root = (0, _nodeHtmlParser.parse)(body);
            var listCell = root.querySelector('.list-cell');
            if (listCell) detailsUrl = "" + this.siteUrl + listCell.querySelector('.item-name').attributes.href;else throw new Error("Unable to find the book (" + JSON.stringify(this.book) + ") on D&R");

            if (detailsUrl) return detailsUrl;else throw new Error("Unable to parse details url for the book " + JSON.stringify(this.book));
        }
    }, {
        key: "extractTitle",
        value: function extractTitle(root) {
            var trTitle = root.querySelector('.product-name').text;
            return trTitle.convertTrToEn();
        }
    }, {
        key: "extractAuthors",
        value: function extractAuthors(root) {
            return root.querySelector('.author span').text;
        }
    }, {
        key: "extractPrice",
        value: function extractPrice(root) {
            return root.querySelector('.product-price').text;
        }
    }, {
        key: "extractISBN13",
        value: function extractISBN13(root) {
            var text = root.querySelector('.pluses').text;
            var m = text.match(this.regexISBN13);
            if (m) return m[0];else return '';
        }
    }, {
        key: "extractImageAsync",
        value: function extractImageAsync(root) {
            var img = root.querySelector('#main-product-img');
            if (img) return _get(drScraper.prototype.__proto__ || Object.getPrototypeOf(drScraper.prototype), "downloadImageAsync", this).call(this, img.attributes['src'], _get(drScraper.prototype.__proto__ || Object.getPrototypeOf(drScraper.prototype), "generateGuid", this).call(this) + ".jpg");else return Promise.resolve(null);
        }
    }]);

    return drScraper;
}(_scraper3.default);

exports.default = drScraper;