import csv from 'csvtojson';

 class csvReader {
    constructor(){
        // super();
    }

    static readAsync(file, limit, offset) {
        return csv({
            delimeter: [';']
        }).fromFile(file);
    };
}

export default csvReader;


