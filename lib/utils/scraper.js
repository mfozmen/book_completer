'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var scraper = function () {
    function scraper(book) {
        _classCallCheck(this, scraper);

        this.book = book;
    }

    _createClass(scraper, [{
        key: 'completeBookAsync',
        value: function completeBookAsync() {
            return new Promise(function (resolve, reject) {
                try {
                    var completedBook = this.completeBook();
                    resolve(completedBook);
                } catch (e) {
                    reject(e);
                }
            }.bind(this));
        }
    }, {
        key: 'completeBook',
        value: function completeBook() {
            var detailsUrl;
            if (this.book.title) detailsUrl = this.searchByTitle(this.book.title);

            return detailsUrl;
        }
    }, {
        key: 'searchByTitle',
        value: function searchByTitle(title) {
            console.log('yeah');
            return title;
        }
    }]);

    return scraper;
}();

exports.default = scraper;