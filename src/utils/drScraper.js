import scraper from "./scraper";
import {
    parse
} from 'node-html-parser';
import stringExtensions from "./stringExtensions";

class drScraper extends scraper {
    constructor(book) {
        super(book);
        this.siteUrl = `https://www.dr.com.tr`;
        this.searchUrl = `${this.siteUrl}/search?q=`;
    }

    parseDetailsUrl(body) {
        var detailsUrl;
        const root = parse(body);
        var listCell = root.querySelector('.list-cell');
        if (listCell)
            detailsUrl = `${this.siteUrl}${listCell.querySelector('.item-name').attributes.href}`;
        else
            throw new Error(`Unable to find the book (${JSON.stringify(this.book)}) on D&R`);

        if (detailsUrl)
            return detailsUrl;
        else
            throw new Error(`Unable to parse details url for the book ${JSON.stringify(this.book)}`);
    }

    parseBook(detailsPage) {
        var root = parse(detailsPage);
        return {
            title: this.extractTitle(root),
            authors: this.extractAuthors(root),
            price: this.extractPrice(root),
            isbn13: this.extractISBN13(root)
        }
    }

    extractTitle(root) {
        var trTitle = root.querySelector('.product-name').text;
        return trTitle.convertTrToEn();
    }

    extractAuthors(root) {
        return root.querySelector('.author span').text;
    }

    extractPrice(root) {
        return root.querySelector('.product-price').text;
    }

    extractISBN13(root) {
        var text = root.querySelector('.pluses').text;
        var m = text.match(this.regexISBN13);
        if (m)
            return m[0];
        else
            return '';
    }
}

export default drScraper;