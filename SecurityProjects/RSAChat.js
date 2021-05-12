//Một dự án trao đổi thông tin giữa hai người bằng RSA!!!!! 
function rsa(object) {
    var js = new JSEncrypt({
        default_key_size: object.size
    });

    if (object.text != undefined) {
        if (object.publicKey == undefined || object.publicKey == "")
            object.publicKey = js.getPublicKey();
        if (object.privateKey == undefined || object.privateKey == "")
            object.privateKey = js.getPrivateKey();
        js.setPublicKey(object.publicKey);

        return {
            js: js,
            encrypted: js.encrypt(object.text),
            publicKey: object.publicKey,
            privateKey: object.privateKey
        };
    } else {
        js.setPrivateKey(object.privateKey);
        return js.decrypt(object.encrypted);
    }
}

if (localStorage.getItem("publicKey") == undefined)
    setTimeout(() => {
        var end = rsa({
            text: "",
            size: 512
        });

        document.getElementById("yourPublic").value = end.publicKey.replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "");
        localStorage.setItem("publicKey", end.publicKey);
        localStorage.setItem("privateKey", end.privateKey);
    }, 100);
else
    document.getElementById("yourPublic").value = localStorage.getItem("publicKey").replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "");
