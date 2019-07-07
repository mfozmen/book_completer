import request from 'request';
class scraper {
    constructor(book) {
        this.requestTimeout = 60000;
        this.book = book;
        this.siteUrl = '';
        this.searchUrl = '';
    }

    completeBookAsync() {
        return new Promise(function (resolve, reject) {
            this.searchAsync()
                .then(body => this.parseDetailsUrl(body))
                .then(detailsUrl => this.getDetailsPageAsync(detailsUrl))
                .then(detailsPage => this.parseBook(detailsPage))
                .then(book => {
                    this.copyProperties(book);
                    resolve(book);
                })
                .catch(e => reject(e));
        }.bind(this));
    }

    searchAsync() {
        return new Promise(function (resolve, reject) {
            var uri;
            if (this.book.title)
                uri = encodeURI(`${this.searchUrl}${this.book.title}`);
            else if (this.book.isbn13)
                uri = encodeURI(`${this.searchUrl}${this.book.isbn13}`);

            request(uri, {
                timeout: this.requestTimeout
            }, (err, _response, body) => {
                if (err)
                    reject(err);
                else
                    resolve(body);
            });
        }.bind(this));
    }

    getDetailsPageAsync(detailsUrl) {
        return new Promise(function (resolve, reject) {
            request(detailsUrl, {
                timeout: this.requestTimeout
            }, (err, _response, body) => {
                if (err)
                    reject(err);
                else
                    resolve(body);
            });
        }.bind(this));
    }

    copyProperties(book) {
        for (let i = 0; i < Object.keys(this.book).length; i++) {
            const prop = Object.keys(this.book)[i];
            if (book[prop] !== this.book[prop])
                this.book[prop] = book[prop];
        }
        this.book.image = book.image;
    }
}

export default scraper;