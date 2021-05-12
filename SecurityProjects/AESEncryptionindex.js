String.prototype.shuffle = function() {
    var array = this.toString().split(''),
        currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array.join("");
};

String.prototype.encrypt = function(salt) {
    var string = this.toString();
    var encrypted = CryptoJS.AES.encrypt(string, salt).toString();
    return encrypted;
}

String.prototype.decrypt = function(salt) {
    var encrypted = this.toString();
    var string = CryptoJS.AES.decrypt(encrypted, salt).toString(CryptoJS.enc.Utf8);
    return string;
}

String.prototype.generateSalt = function() {
    var type = Math.floor(Math.random() * 2),
        string = this.toString(),
        salt;

    switch (type) {
        case 0:
            salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            break;
        case 1:
            for (var copy = 0; copy < (25 / string.length); copy++)
                string += string;
            string = string.split("").map((v) => Math.round(Math.random()) ? v.toUpperCase() : v.toLowerCase()).join("");
            string = string.substring(0, 20).shuffle();
            salt = string;
            break;
    }

    return salt;
}

function encrypt() {
    var string = document.getElementById("encryptString").value;
    var salt = document.getElementById("encryptSalt").value;
    var output = document.getElementById("encryptOuput");

    if (string != "") {
        if (salt == "")
            salt = string.generateSalt();
        output.innerHTML = string.encrypt(salt);
        document.getElementById("encryptSalt").value = salt;
    }
}

function decrypt() {
    var string = document.getElementById("decryptString").value;
    var salt = document.getElementById("decryptSalt").value;
    var output = document.getElementById("decryptOuput");

    if (string != "" && salt != "")
        output.innerHTML = string.decrypt(salt);
}