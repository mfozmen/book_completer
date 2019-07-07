'use strict';

var _nodeDependencyInjection = require('node-dependency-injection');

var _fileReader = require('./utils/fileReader');

var _fileReader2 = _interopRequireDefault(_fileReader);

var _csvReader = require('./utils/csvReader');

var _csvReader2 = _interopRequireDefault(_csvReader);

var _scraperFactory = require('./utils/scraperFactory');

var _scraperFactory2 = _interopRequireDefault(_scraperFactory);

var _drScraper = require('./utils/drScraper');

var _drScraper2 = _interopRequireDefault(_drScraper);

var _idefixScraper = require('./utils/idefixScraper');

var _idefixScraper2 = _interopRequireDefault(_idefixScraper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var program = require('commander');

program.version('0.1.0').option('-i, --inputfile [file]', 'Input CSV File').option('-l, --limit <n>', 'How many records should be read', parseInt).option('-o, --offset <n>', 'How many records should be skipped', parseInt).parse(process.argv);

try {
    if (!program.inputfile) throw new Error("You have to specify a CSV file to read books.");

    var fReader = getFileReader();
    var scrapFac = createScraperFactory();

    fReader.readLineAsync(function (r) {
        r.then(function (book) {
            var scraper = scrapFac.get(book);
            return scraper.completeBookAsync();
        }).then(function (book) {
            console.log(book);
        }).catch(function (e) {
            throw e;
        });
    });
} catch (error) {
    console.error(error);
    process.exit(1);
}

function getFileReader() {
    var container = new _nodeDependencyInjection.ContainerBuilder();

    container.register('fileReader', _fileReader2.default).addArgument(new _csvReader2.default(program.inputfile, program.limit, program.offset));

    return container.get('fileReader')._readerService;
}

function createScraperFactory() {
    var sf = new _scraperFactory2.default();
    sf.register(_drScraper2.default);
    // sf.register(idefixScraper);

    return sf;
}