'use strict';

var _nodeDependencyInjection = require('node-dependency-injection');

var _fileReader = require('./utils/fileReader');

var _fileReader2 = _interopRequireDefault(_fileReader);

var _csvReader = require('./utils/csvReader');

var _csvReader2 = _interopRequireDefault(_csvReader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var program = require('commander');

program.version('0.1.0').option('-i, --inputfile [file]', 'Input CSV File').option('-l, --limit <n>', 'How many records should be read', parseInt).option('-o, --offset <n>', 'How many records should be skipped', parseInt).parse(process.argv);

try {
    if (!program.inputfile) throw new Error("You have to specify a CSV file to read books.");

    var container = new _nodeDependencyInjection.ContainerBuilder();

    container.register('service.fileReader', _fileReader2.default).addArgument(_csvReader2.default);

    var reader = container.get('service.fileReader')._readerService;

    reader.readAsync(program.inputfile, program.limit, program.offset).then(function (json) {
        console.log(json);
    }).catch(function (e) {
        throw e;
    });
} catch (error) {
    console.error(error);
    process.exit(1);
}