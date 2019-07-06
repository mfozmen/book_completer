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

    fReader.readLineAsync(function(r){
        r.then(book=> {
            var scraper = scrapFac.get(book);
            return scraper.completeBookAsync();
        })
        .then(book=>{
            console.log(book);
        })
        .catch(e=> {throw e;});
    })
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
    sf.register(idefixScraper);

    return sf;
}