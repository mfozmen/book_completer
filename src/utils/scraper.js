import request from 'request';
import {
    parse
} from 'node-html-parser';
import logger from './logger';
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
        return new Promise(function (resolve) {
            this.searchAsync()
                .then(body => {
                    if (body)
                        return this.parseDetailsUrl(body);
                    else return null;
                })
                .then(detailsUrl => {
                    if (detailsUrl)
                        return this.getDetailsPageAsync(detailsUrl);
                    else {
                        logger.error(`The book ${JSON.stringify(this.book)} is not found.`)
                        return null;
                    }
                })
                .then(detailsPage => {
                    if (detailsPage)
                        return this.parseBookAsync(detailsPage);
                    else
                        return null;
                })
                .then(book => {
                    if (book) {
                        this.copyProperties(book);
                        resolve(book);
                    } else
                        resolve(this.book);
                })
                .catch(e => {
                    logger.error(e);
                    resolve(this.book)
                });
        }.bind(this));
    }

    searchAsync() {
        return new Promise(function (resolve) {
            var uri;
            if (this.book.title)
                uri = encodeURI(`${this.searchUrl}${this.book.title}`);
            else if (this.book.isbn13)
                uri = encodeURI(`${this.searchUrl}${this.book.isbn13}`);

            request(uri, {
                timeout: this.requestTimeout
            }, (err, _response, body) => {
                if (err)
                    resolve(null);
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
                .catch(() => logger.error(`Unable to download image for (${JSON.stringify(this.book)})`))
                .finally(() => resolve(parsedBook));
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
            if (book[prop] && book[prop] !== this.book[prop]) {
                if (prop === 'isbn13' && this.book.isbn13 && book.isbn13) {
                    logger.info(`The book "${this.book.title}" has invalid ISBN13. It's updating. Old Value: ${this.book.isbn13}, New Value: ${book.isbn13}`);
                }
                this.book[prop] = book[prop];
            }
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