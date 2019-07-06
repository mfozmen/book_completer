const program = require('commander');

program
    .version('0.1.0')
    .option('-i, --inputfile', 'Input CSV File')
    .parse(process.argv);

if (!program.inputfile)
    console.error(new Error("You have to specify a CSV file to read books."))