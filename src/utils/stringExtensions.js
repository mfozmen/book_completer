Object.defineProperty(String.prototype, 'convertTrToEn', {
    value() {
        const dic = {
            Ç: 'C',
            ç: 'c',
            Ğ: 'G',
            ğ: 'g',
            ı: 'i',
            İ: 'I',
            Ö: 'Ö',
            ö: 'ö',
            Ş: 'Ş',
            ş: 'ş',
            Ü: 'Ü',
            ü: 'ü'
        }
        var result =[];
        for (let i = 0; i < this.length; i++) {
            if (dic[this[i]])
                result[i] = dic[this[i]];
            else
                result[i] = this[i];
        }
        return result.join('');
    }
});

Object.defineProperty(String.prototype, 'clean', {
    value() {
        return this.replace(/\r\n/g, '').trim();
    }
});