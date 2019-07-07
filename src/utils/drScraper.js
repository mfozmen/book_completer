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
        var firstListCell = root.querySelector('.list-cell');
        if (firstListCell)
            detailsUrl = `${this.siteUrl}${firstListCell.querySelector('.item-name').attributes.href}`;
        if (detailsUrl)
            return detailsUrl;
        else
            throw new Error('Unable to parse details url');
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

    extractISBN13(root){
        var preword = 'Barkod: ';
        var text = root.querySelector('.pluses').text;
        var index = text.search(preword);
        var startIndex = index+preword.length;
        var endIndex = startIndex+13;
        return text.slice(startIndex, endIndex);
    }
}

export default drScraper;