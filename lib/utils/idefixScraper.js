'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _scraper2 = require('./scraper');

var _scraper3 = _interopRequireDefault(_scraper2);

var _nodeHtmlParser = require('node-html-parser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var idefixScraper = function (_scraper) {
    _inherits(idefixScraper, _scraper);

    function idefixScraper(book) {
        _classCallCheck(this, idefixScraper);

        var _this = _possibleConstructorReturn(this, (idefixScraper.__proto__ || Object.getPrototypeOf(idefixScraper)).call(this, book));

        _this.siteUrl = 'https://www.idefix.com';
        _this.searchUrl = _this.siteUrl + '/search?Q=';
        return _this;
    }

    _createClass(idefixScraper, [{
        key: 'parseDetailsUrl',
        value: function parseDetailsUrl(body) {
            var detailsUrl;
            var root = (0, _nodeHtmlParser.parse)(body);
            var productImage = root.querySelector('.product-image');
            if (productImage) detailsUrl = '' + this.siteUrl + productImage.attributes.href;else throw new Error('Unable to find the book (' + JSON.stringify(this.book) + ') on Idefix');

            if (detailsUrl) return detailsUrl;else throw new Error('Unable to parse details url for the book ' + JSON.stringify(this.book));
        }
    }, {
        key: 'extractTitle',
        value: function extractTitle(root) {
            var trTitle = root.querySelector('.prodyctDetailTopTitle h1').text;
            return trTitle.convertTrToEn();
        }
    }, {
        key: 'extractAuthors',
        value: function extractAuthors(root) {
            return root.querySelector('.author-text').text;
        }
    }, {
        key: 'extractPrice',
        value: function extractPrice(root) {
            return root.querySelector('#salePrice').text;
        }
    }, {
        key: 'extractISBN13',
        value: function extractISBN13(root) {
            var ulText = root.querySelector('.product-info-list ul').childNodes.map(function (n) {
                return n.text;
            }).reduce(function (a, b) {
                return a.concat(b);
            });
            var m = ulText.match(this.regexISBN13);
            if (m) return m[0];else return '';
        }
    }, {
        key: 'extractImageAsync',
        value: function extractImageAsync(root) {
            var img = root.querySelector('#main-product-img');
            if (img) return _get(idefixScraper.prototype.__proto__ || Object.getPrototypeOf(idefixScraper.prototype), 'downloadImageAsync', this).call(this, img.attributes['data-src'], _get(idefixScraper.prototype.__proto__ || Object.getPrototypeOf(idefixScraper.prototype), 'generateGuid', this).call(this) + '.jpg');else return Promise.resolve(null);
        }
    }]);

    return idefixScraper;
}(_scraper3.default);

exports.default = idefixScraper;