class scraperFactory{
    constructor(){
        this.scrapers = [];
    }

    register(scraper){
        this.scrapers.push(scraper);
    }

    get(){
        var scraper = this.scrapers[Math.floor(Math.random() * this.scrapers.length)];
        return new scraper();
    }
}

export default scraperFactory;