import scraper from "./scraper";
import {
    parse
} from 'node-html-parser';
import stringExtensions from "./stringExtensions";

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
        return detailsUrl;
    }

    extractTitle(root) {
        var root = root.querySelector('.prodyctDetailTopTitle h1');
        if (root) {
            var trTitle = root.text;
            trTitle = trTitle.clean();
            return trTitle.convertTrToEn();
        }
        return null;
    }

    extractAuthors(root) {
        var root = root.querySelector('.author-text');
        if (root) {
            var trAuthors = root.text;
            trAuthors = trAuthors.clean();
            return trAuthors.convertTrToEn();
        }
        return null;
    }

    extractPrice(root) {
        var root = root.querySelector('#salePrice');
        if (root)
            return root.text.clean();
        else
            return null;
    }

    extractISBN13(root) {
        var root = root.querySelector('.product-info-list ul');
        if (root) {
            var ulText = root.childNodes.map(n => {
                return n.text;
            }).reduce(function (a, b) {
                return a.concat(b);
            });
            var m = ulText.match(this.regexISBN13);
            if (m)
                return m[0];
        }
        return null;
    }

    extractImageAsync(root) {
        var img = root.querySelector('#main-product-img');
        if (img)
            return super.downloadImageAsync(img.attributes['data-src'], `${super.generateGuid()}.jpg`);
        else
            return Promise.resolve(null);
    }
}

export default idefixScraper;