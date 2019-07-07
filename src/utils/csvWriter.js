import {
    parse
} from 'json2csv';
const fs = require('fs');
const path = require('path');

class csvWriter {
    constructor(file) {
        this.file = file;
        this.fields = ['authors', 'title', 'price', 'isbn13', 'image'];
        this.opts = {
            fields: this.fields,
            header: false,
            delimiter: ';'
        };
        this.create();
    }

    create() {
        this.csv = '';
        for (let i = 0; i < this.opts.fields.length; i++) {
            const field = this.opts.fields[i];
            this.csv += `${field}${this.opts.delimiter}`;
        }
        this.csv = this.csv.slice(0, -1); // Remove last delimiter
        this.csv += '\r\n';
    }

    append(book) {
        this.csv += parse(book, this.opts) + '\r\n';
    }

    writeToFileAsync() {
        return new Promise(function (resolve, reject) {
            this.ensureDirectoryExistence(this.file);
            fs.writeFile(this.file, this.csv, function (err) {
                if (err)
                    reject(err);
                else
                    resolve(true);
            });

        }.bind(this));
    }

    ensureDirectoryExistence(filePath) {
        var dirname = path.dirname(filePath);
        if (fs.existsSync(dirname)) {
            return true;
        }
        this.ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
    }
}

export default csvWriter;