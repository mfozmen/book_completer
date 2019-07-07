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
        var root = root.querySelector('.product-name');
        if (root) {
            var trTitle = root.text;
            trTitle = trTitle.clean();
            return trTitle.convertTrToEn();
        }
        return null;
    }

    extractAuthors(root) {
        var root = root.querySelector('.author span');
        if (root) {
            var trAuthors = root.text;
            trAuthors = trAuthors.clean();
            return trAuthors.convertTrToEn();
        }
        return null;
    }

    extractPrice(root) {
        var root = root.querySelector('.product-price');
        if (root)
            return root.text;
        return null;
    }

    extractISBN13(root) {
        var root = root.querySelector('.pluses');
        if (root) {
            var text = root.text;
            var m = text.match(this.regexISBN13);
            if (m)
                return m[0];
        }
        return null;
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