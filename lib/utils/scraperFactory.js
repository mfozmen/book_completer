"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var scraperFactory = function () {
    function scraperFactory() {
        _classCallCheck(this, scraperFactory);

        this.scrapers = [];
    }

    _createClass(scraperFactory, [{
        key: "register",
        value: function register(scraper) {
            this.scrapers.push(scraper);
        }
    }, {
        key: "get",
        value: function get(book) {
            var scraper = this.scrapers[Math.floor(Math.random() * this.scrapers.length)];
            return new scraper(book);
        }
    }]);

    return scraperFactory;
}();

exports.default = scraperFactory;