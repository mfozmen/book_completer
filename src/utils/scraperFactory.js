class scraperFactory{
    constructor(){
        this.scrapers = [];
    }

    register(scraper){
        this.scrapers.push(scraper);
    }

    get(book){
        var scraper = this.scrapers[Math.floor(Math.random() * this.scrapers.length)];
        return new scraper(book);
    }
}

export default scraperFactory;