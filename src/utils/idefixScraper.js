import scraper from "./scraper";
import {
    parse
} from 'node-html-parser';

class idefixScraper extends scraper {
    constructor(book) {
        super(book);
        this.siteUrl = `https://www.idefix.com`;
        this.searchUrl = `${this.siteUrl}/search?Q=`;
    }

    parseDetailsUrl(body) {
        var detailsUrl;
        const root = parse(body);
        var productImage = root.querySelector('.product-image');
        if (productImage)
            detailsUrl = `${this.siteUrl}${productImage.attributes.href}`;
        else
            throw new Error(`Unable to find the book (${JSON.stringify(this.book)}) on Idefix`);

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
        var trTitle = root.querySelector('.prodyctDetailTopTitle h1').text;
        return trTitle.convertTrToEn();
    }

    extractAuthors(root) {
        return root.querySelector('.author-text').text;
    }

    extractPrice(root) {
        return root.querySelector('#salePrice').text;
    }

    extractISBN13(root) {
        var ulText = root.querySelector('.product-info-list ul').childNodes.map(n => {
            return n.text;
        }).reduce(function (a, b) {
            return a.concat(b);
        });
        var m = ulText.match(this.regexISBN13);
        if (m)
            return m[0];
        else
            return '';
    }
}

export default idefixScraper;