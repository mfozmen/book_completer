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
        return detailsUrl;
    }

    extractTitle(root) {
        var trTitle = root.querySelector('.product-name').text;
        trTitle = trTitle.clean();
        return trTitle.convertTrToEn();
    }

    extractAuthors(root) {
        var trAuthors = root.querySelector('.author span').text;
        trAuthors = trAuthors.clean();
        return trAuthors.convertTrToEn();
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

    extractImageAsync(root) {
        var img = root.querySelector('#main-product-img');
        if (img)
            return super.downloadImageAsync(img.attributes['src'], `${super.generateGuid()}.jpg`);
        else
            return Promise.resolve(null);
    }
}

export default drScraper;