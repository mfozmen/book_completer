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

    var container = new _nodeDependencyInjection.ContainerBuilder();

    container.register('fileReader', _fileReader2.default).addArgument(_csvReader2.default);

    var reader = container.get('fileReader')._readerService;

    var sf = createScraperFactory();
    var s = sf.get();

    reader.readAsync(program.inputfile, program.limit, program.offset).then(function (books) {}).catch(function (e) {
        throw e;
    });
} catch (error) {
    console.error(error);
    process.exit(1);
}

function createScraperFactory() {
    var sf = new _scraperFactory2.default();
    sf.register(_drScraper2.default);
    sf.register(_idefixScraper2.default);

    return sf;
}