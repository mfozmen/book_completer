'use strict';

Object.defineProperty(String.prototype, 'convertTrToEn', {
    value: function value() {
        var dic = {
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
        };
        var result = [];
        for (var i = 0; i < this.length; i++) {
            if (dic[this[i]]) result[i] = dic[this[i]];else result[i] = this[i];
        }
        return result.join('');
    }
});