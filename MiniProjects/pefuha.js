class Pefuha {
    // pefuha = PetaFunHash [^^]
    constructor(version = 1) {
        this.version = version;
    }
    hash(string, hashLength = 4, randomEightNum = Math.floor(10000000 + Math.random() * 90000000), randomOneNum = Math.floor(Math.random() * 9) + 1) {
        var string = string.split(''),
            seed = randomEightNum.toString() + randomOneNum.toString() + hashLength.toString();

        for (var i = 0; i < string.length; i++) {
            var temp = Math.pow((randomEightNum * Math.pow(string[i].charCodeAt(0), randomOneNum)), 1 / 4),
                result = parseInt(temp - parseInt(temp / Math.pow(10, hashLength)) * Math.pow(10, hashLength));
            string[i] = result;
            randomEightNum += randomOneNum;
        }

        return seed + '[P' + this.version + ']' + string.join('');
    }
    check(hashed, checkString) {
        var seed = hashed.split('[P' + this.version + ']')[0],
            checked = this.hash(checkString, parseInt(seed.substring(9)), parseInt(seed.substring(0, 8)), parseInt(seed.substring(8, 9)));
        return hashed == checked;
    }
}

var pefuha = new Pefuha();
console.log(pefuha.hash('xin chào'))
console.log(pefuha.check(pefuha.hash('chào'), 'cháo'))
