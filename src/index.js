import {
    ContainerBuilder
} from 'node-dependency-injection'
import fileReader from './utils/fileReader';
import csvReader from './utils/csvReader';

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

    let container = new ContainerBuilder()

    container
        .register('service.fileReader', fileReader)
        .addArgument(csvReader)

    const reader = container.get('service.fileReader')._readerService;

    reader.readAsync(program.inputfile, program.limit, program.offset)
        .then(json => {
            console.log(json);
        })
        .catch(e => {
            throw e;
        });

} catch (error) {
    console.error(error);
    process.exit(1);
}