import csv from 'csvtojson';

class csvReader {
    constructor(file, limit, offset = 0) {
        this.file = file;
        this.limit = limit;
        this.offset = offset;
    }

    readAsync() {
        return csv({
                delimiter: [';']
            })
            .fromFile(this.file)
            .then(data => {
                var start = this.offset;
                var end = data.length;
                if (this.limit)
                    end = this.limit + this.offset;
                return data.slice(start, end);
            });
    }
}

export default csvReader;