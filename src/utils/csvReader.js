import csv from 'csvtojson';

class csvReader {
    constructor(file, limit, offset) {
        this.file = file;
        if (offset) {
            this.start = offset;
            if (limit)
                this.end = limit + offset;
        }
    }

    readLineAsync(next) {
        var opts = this.createOptions();
        csv({
                delimiter: [';']
            })
            .fromFile(this.file, opts)
            .subscribe((data) => {
                if (data)
                    next(new Promise((resolve) => {
                        resolve(data);
                    }));
            })
    }

    createOptions() {
        var options = {};
        if (this.start)
            options.start = this.start;
        if (this.end)
            options.end = this.end;

        return options;
    }
}

export default csvReader;