<script>
class Pefuha {
    // pefuha = PetaFunHash [^^]
    constructor() {}
    hash(string, hashLength = 4, randomEightNum = Math.floor(10000000 + Math.random() * 90000000), randomOneNum = Math.floor(Math.random() * 9) + 1) {
        var string = string.split(''),
            seed = randomEightNum.toString() + randomOneNum.toString() + hashLength.toString(),
            charset = 'abcdefghijklmnoqrstuvwxyzABCDEFGHIJKLMNOQRSTUVWXYZ';

        for (var i = 0; i < string.length; i++) {
            var temp = Math.pow((randomEightNum * Math.pow(string[i].charCodeAt(0), randomOneNum)), 1 / 4),
                result = parseInt(temp - parseInt(temp / Math.pow(10, hashLength)) * Math.pow(10, hashLength));
            string[i] = result;
            randomEightNum += randomOneNum;
        }
        
        string = string.join('').match(/.{1,2}/g);
        for (var i = 0; i < string.length; i++)
            string[i] = charset[(string[i] - 50 < 0) ? string[i] - 0 : string[i] - 50];

        return seed + string.join('');
    }
    check(hashed, checkString) {
        var checked = this.hash(checkString, parseInt(hashed.substring(9)), parseInt(hashed.substring(0, 8)), parseInt(hashed.substring(8, 9)));
        return hashed == checked;
    }
}

var pefuha = new Pefuha(),
	hashed = pefuha.hash('chào');
console.log(hashed)
console.log(pefuha.check(hashed, 'cháo'))
</script>
