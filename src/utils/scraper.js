class scraper {
    constructor(book) {
        this.book = book;
    }

    completeBookAsync() {
        return new Promise(function (resolve, reject) {
            try {
                var completedBook = this.completeBook()
                resolve(completedBook);
            } catch (e) {
                reject(e);
            }

        }.bind(this));
    }

    completeBook(){
        var detailsUrl;
        if (this.book.title)
            detailsUrl = this.searchByTitle(this.book.title);
    }

    searchByTitle(title){
        
    }
}

export default scraper;