import csv from 'csvtojson';

 class csvReader {
    constructor(){
        
    }

    static readAsync(file, limit, offset) {
        return csv({
            delimiter: [';']
        }).fromFile(file);
    };
}

export default csvReader;


