'use strict';

var _nodeDependencyInjection = require('node-dependency-injection');

var _fileReader = require('./utils/fileReader');

var _fileReader2 = _interopRequireDefault(_fileReader);

var _fileWriter = require('./utils/fileWriter');

var _fileWriter2 = _interopRequireDefault(_fileWriter);

var _csvReader = require('./utils/csvReader');

var _csvReader2 = _interopRequireDefault(_csvReader);

var _csvWriter = require('./utils/csvWriter');

var _csvWriter2 = _interopRequireDefault(_csvWriter);

var _scraperFactory = require('./utils/scraperFactory');

var _scraperFactory2 = _interopRequireDefault(_scraperFactory);

var _drScraper = require('./utils/drScraper');

var _drScraper2 = _interopRequireDefault(_drScraper);

var _idefixScraper = require('./utils/idefixScraper');

var _idefixScraper2 = _interopRequireDefault(_idefixScraper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var program = require('commander');

program.version('0.1.0').option('-i, --inputfile [file]', 'Input CSV File').option('-l, --limit <n>', 'How many records should be read', parseInt).option('-o, --offset <n>', 'How many records should be skipped', parseInt).option('-f, --outputfile [file]', 'Output CSV File').parse(process.argv);

try {
    if (!program.inputfile) throw new Error("You have to specify a CSV file to read books.");

    var fReader = getFileReader();
    var fWriter = getFileWriter();
    var scrapFac = createScraperFactory();

    fReader.readAsync().then(function (books) {
        var promises = [];
        for (var i = 0; i < books.length; i++) {
            var book = books[i];
            if (book.title && book.authors && book.price && book.isbn13 && book.image) promises.push(Promise.resolve(book));else if (book.title || book.isbn13) {
                var scraper = scrapFac.get(book);
                promises.push(scraper.completeBookAsync().then(function (book) {
                    console.log(book);
                    fWriter.append(book);
                }).catch(function (e) {
                    throw e;
                }));
            }
        }
        return reportProgress(promises, function (percent, completedRecords, totalRecords) {
            console.log(completedRecords + '/' + totalRecords + ' %' + percent.toFixed(2) + ' completed...');
        }).catch(function (e) {
            throw e;
        }).then(function () {
            return fWriter.writeToFileAsync();
        }).then(function () {
            return console.log('Output file is generated: ' + program.outputfile);
        });
    }).catch(function (e) {
        throw e;
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

function getFileWriter() {
    var container = new _nodeDependencyInjection.ContainerBuilder();

    container.register('fileWriter', _fileWriter2.default).addArgument(new _csvWriter2.default(program.outputfile));

    return container.get('fileWriter')._writerService;
}

function createScraperFactory() {
    var sf = new _scraperFactory2.default();
    sf.register(_drScraper2.default);
    sf.register(_idefixScraper2.default);
    return sf;
}

function reportProgress(promises, progress) {
    var d = 0;

    if (promises.length === 0) progress(100, d, promises.length);else {
        progress(0, d, promises.length);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = promises[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var p = _step.value;

                p.finally(function () {
                    d++;
                    progress(d * 100 / promises.length, d, promises.length);
                });
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    return Promise.all(promises);
}