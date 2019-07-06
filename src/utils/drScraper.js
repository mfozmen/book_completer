import scraper from "./scraper";

class drScraper extends scraper {
    constructor(book) {
        super(book);
        this.searchUrl = 'https://www.dr.com.tr/search?q=';
    }

    completeBook() {
        super.completeBook();
        
    }
}

export default drScraper;