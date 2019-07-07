import {
    ContainerBuilder
} from 'node-dependency-injection'
import fileReader from './utils/fileReader';
import csvReader from './utils/csvReader';
import scraperFactory from './utils/scraperFactory';
import drScraper from './utils/drScraper';
import idefixScraper from './utils/idefixScraper';
var program = require('commander');

program
    .version('0.1.0')
    .option('-i, --inputfile [file]', 'Input CSV File')
    .option('-l, --limit <n>', 'How many records should be read', parseInt)
    .option('-o, --offset <n>', 'How many records should be skipped', parseInt)
    .parse(process.argv);

try {
    if (!program.inputfile)
        throw new Error("You have to specify a CSV file to read books.");

    var fReader = getFileReader();
    var scrapFac = createScraperFactory();

    fReader.readAsync()
        .then(books => {
            var promises = [];
            for (let i = 0; i < books.length; i++) {
                const book = books[i];
                if (book.title && book.authors && book.price && book.isbn13 && book.image)
                    promises.push(Promise.resolve(book));
                else if (book.title || book.isbn13) {
                    var scraper = scrapFac.get(book);
                    promises.push(scraper.completeBookAsync());
                }
            }
            return reportProgress(promises,
                (p) => {
                    console.log(`%${p.toFixed(2)} completed...`);
                });
        })
        .then(resultset => {
            console.log(resultset);
        })
        .catch(e => {
            throw e;
        });

} catch (error) {
    console.error(error);
    process.exit(1);
}

function getFileReader() {
    let container = new ContainerBuilder()

    container
        .register('fileReader', fileReader)
        .addArgument(new csvReader(program.inputfile, program.limit, program.offset))

    return container.get('fileReader')._readerService;
}

function createScraperFactory() {
    var sf = new scraperFactory();
    sf.register(drScraper);
    // sf.register(idefixScraper);

    return sf;
}

function reportProgress(promises, progress) {
    let d = 0;

    if (promises.length === 0)
        progress(100);
    else {
        progress(0);
        for (const p of promises) {
            p.finally(() => {
                d++;
                progress((d * 100) / promises.length);
            });
        }
    }

    return Promise.all(promises);
}