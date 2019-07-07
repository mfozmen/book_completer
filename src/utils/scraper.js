import request from 'request';
import {
    parse
} from 'node-html-parser';
const download = require('image-downloader')
const uuidv1 = require('uuid/v1');
var fs = require('fs');

class scraper {
    constructor(book) {
        this.requestTimeout = 60000;
        this.localImageDir = './img/';
        this.regexISBN13 = /([0-9]){13}/;
        this.book = book;
        this.siteUrl = '';
        this.searchUrl = '';
    }

    completeBookAsync() {
        return new Promise(function (resolve, reject) {
            this.searchAsync()
                .then(body => this.parseDetailsUrl(body))
                .then(detailsUrl => this.getDetailsPageAsync(detailsUrl))
                .then(detailsPage => this.parseBookAsync(detailsPage))
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

    parseBookAsync(detailsPage) {
        return new Promise(function (resolve) {
            var root = parse(detailsPage);
            var parsedBook = {
                title: this.extractTitle(root),
                authors: this.extractAuthors(root),
                price: this.extractPrice(root),
                isbn13: this.extractISBN13(root)
            };
            this.extractImageAsync(root)
                .then(fileName => {
                    parsedBook.image = fileName;
                    return parsedBook;
                })
                .catch(() => console.error(`Unable to download image for (${JSON.stringify(this.book)}) from D&R`))
                .then(() => resolve(parsedBook));
        }.bind(this));
    }

    downloadImageAsync(url, fileName) {
        this.createDirIfNotExists(this.localImageDir);
        const options = {
            url: url,
            dest: `${this.localImageDir}${fileName}`
        }
        return new Promise(function (resolve, reject) {
            download.image(options)
                .then(({
                    filename
                }) => {
                    resolve(filename);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }

    copyProperties(book) {
        for (let i = 0; i < Object.keys(this.book).length; i++) {
            const prop = Object.keys(this.book)[i];
            if (book[prop] !== this.book[prop])
                this.book[prop] = book[prop];
        }
        this.book.image = book.image;
    }

    generateGuid() {
        return uuidv1();
    }

    createDirIfNotExists(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }
}

export default scraper;