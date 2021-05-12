/* GIẢI THÍCH CÁC HĐ CỦA ADSFRAME.

Chương trình 1 (ADSFRAME): Sẽ có một cái code chèn khung quảng cáo (của mình) vào hệ thống các website của mình.
Chương trình 2 (PRYOWE): Sẽ là một chương trình dạng trang chuyển hướng nhưng sẽ mã hoá URL target, có đặt mật khẩu và thời gian chờ chuyển hướng
Chương trình 3 (AUTO-PRYOWE): Cũng là PRYOWE nhưng là tự động, tự động tạo link PRYOWE và rút gọn nó bằng rebrand.ly API cho tất cả liên kết. Tức là thấy liên kết ngoài (liên kết out khỏi trang web của mình) là tạo PRYOWE

*/
var adsFrameDomain = 'https://petavietnam.github.io/Personal/NewAdsFrame/',
    scriptAttr = document.currentScript.attributes,
    addScript = (src, onerror) => {
        var script = document.createElement('script');
        if (onerror != undefined)
            script.onerror = onerror;
        script.src = src;
        document.head.appendChild(script);
    },
    userLang = navigator.language || navigator.userLanguage,
    links = document.getElementsByTagName("A"),
    includesExtra = (originalString, queries) => {
        var includes = false;
        queries.forEach(query => originalString.includes(query) ? includes = true : null);
        return includes;
    },
    shortLink = (longUrl, callback) => {
        $.ajax({
            url: "https://api.rebrandly.com/v1/links",
            type: "post",
            data: JSON.stringify({
                destination: longUrl
            }),
            headers: {
                "Content-Type": "application/json",
                "apikey": "40e7a63ea9134661b39e0e2ab7bb2667",
                "workspace": "b5253b3f46d042eeb5d3af1d88f979f0"
            },
            dataType: "json",
            success: link => callback(link.shortUrl)
        });
    },
    createQrCode = (text, qrcodeElmId, width, height) => new QRCode(qrcodeElmId, {
        text: text,
        width: width,
        height: height,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
    }),
    createPryowe = (longLink, passwordInput, waitTime, callback) => {
        var password = (passwordInput == '' || passwordInput == null || passwordInput == undefined) ? 'DefaultPassword' : passwordInput,
            code = encodeURIComponent(Crypto.AES.encrypt(longLink, password)),
            pryoweUrl = adsFrameDomain + '?target=' + code + ((passwordInput == '' || passwordInput == null || passwordInput == undefined) ? '&password=DefaultPassword' : '') + '&waitTime=' + waitTime;
        shortLink(pryoweUrl, callback);
    };
document.write('<iframe src="' + adsFrameDomain + '" style="position: absolute; top: -1000; left: -1000"></iframe>');
addScript('https://code.jquery.com/jquery-3.6.0.min.js');

// BlockAdBlock
// ...

// QR Code class
// ...

// AES class
// ...

// Auto create Pryowe for all links
if (scriptAttr.protectlinksexcept != undefined) {
    var linksExcept = scriptAttr.protectlinksexcept.nodeValue.replace("deactivated; ").split(",");
    for (var i = 0; i < links.length; i++)
        if (links[i].href.includes("http") && !includesExtra(links[i].href, linksExcept)) {
            var encryptedLink = encodeURIComponent(Crypto.AES.encrypt(links[i].href, 'DefaultPassword')),
                aTagText = links[i].innerHTML;
            links[i].href = adsFrameDomain + '?target=' + encryptedLink + '&password=DefaultPassword';
            links[i].target = "_blank";
            if (aTagText.includes("http"))
                links[i].innerHTML = aTagText.substring(0, aTagText.length / 1.5) + "...";
        }
}

// Website deactivated (redirect to AdsFrame homepage)
if (scriptAttr.protectlinksexcept.nodeValue.includes("deactivated")) {
    var alert = 'This website is no longer active, will redirect you in 10 seconds! (Website này không còn hoạt động, sẽ chuyển hướng trong 10 giây!)';
    document.title = alert;
    document.body.innerHTML = '<h1>' + alert.toUpperCase() + '</h1><script src="' + adsFrameDomain + 'embed.js"></script>';
    setTimeout(() => window.location.href = 'https://rebrand.ly/niewl7h', 10000);
}

/*

TÁCH ĐOẠN SAU THÀNH  FILE INDEX.HTML NHÉ

<div id="adsPart" style="position: absolute;top:1000px">
    <!-- Chèn quảng cáo vô đây -->
</div>
<div id="disclaimer" style="position: absolute;padding: 4px;text-align: center;box-shadow: 0 0 10px 0 red;top: 8;left: 8;width: calc(100% - 24px);background: white;z-index:12"> Vui lòng chờ... (Please wait) </div>
<iframe id="iframe" style="position: absolute; top: 0; left: 0; border: none; width: 100%; height: 100%; background: white;z-index:11"></iframe>
<div id="introDiv" style="z-index:10"><code>
        <h2>EMBED ADSFRAME TO YOUR WEBSITE</h2>
        AutoPryowe exception case <font color="blue" onmouseover="this.innerHTML = '(You can set the exception case for the function createPryowe() here, split domains by the comma)'" onmouseout="this.innerHTML = '(?)'">(?)</font>: <input type="text" id="AdsSetting2" size="50" placeholder="youtube.com,google.com" onclick="clearTimeout(reloadPage)" /><br />
        Website deactivated: <input type="checkbox" id="AdsSetting3" onclick="clearTimeout(reloadPage)" /><br />
        <button onclick="document.getElementById('adsFrameCode').value = document.getElementById('adsFrameSampleCode').value.replace('links', document.getElementById('AdsSetting2').value).replace('deactivated', (document.getElementById('AdsSetting3').checked == true) ? 'deactivated;' : '').replace('[adsFrameDomain]', adsFrameDomain);">Get embed code</button>
        <div id="adsFrameOutput" style="display: inline-block"><input type="text" id="adsFrameCode" size="100" onclick="clearTimeout(reloadPage)" /><input type="text" id="adsFrameSampleCode" value="<script src='[adsFrameDomain]embed.js' protectLinksExcept='deactivated links'></script>" style="display: none" /></div><br /><br />

        <hr />

        <h2>PROTECT & SHORT YOUR LINK</h2>
        Address/URL: <input type="text" id="pryoweURL" placeholder="https://..." onclick="clearTimeout(reloadPage)"><br />
        Password (optional): <input type="text" id="pryowePass" placeholder="This is optional..." onclick="clearTimeout(reloadPage)"><br />
        Waiting time (second): <input type="number" id="pryoweTime" placeholder="The default value is 10 seconds" value="10" onclick="clearTimeout(reloadPage)"><br />
        <button onclick="createPryowe(document.getElementById('pryoweURL').value, document.getElementById('pryowePass').value, document.getElementById('pryoweTime').value, link => document.getElementById('pryoweOutput').innerHTML = 'Result: <a href=https://' + link + ' target=_blank>https://' + link + '</a>');">Protect & short link</button>
        <i id="pryoweOutput"></i>
    </code> </div>
<style>
    body {
        overflow: hidden;
    }

    .ubq66zq {
        dipslay: none;
    }

</style>
<div id="adsFrameDiv"></div>
<script src="./embed.js" embedElmID="adsFrameDiv" frameStyle="width: 100%; height: 100%; display: none; border: none;"></script>
<script>
    document.getElementById('adsFrameDiv').innerHTML = '';
    var reloadPage, redirectTimeout, goToWeb;
    if (new URL(window.location.href).searchParams.get('target') != undefined || new URL(window.location.href).searchParams.get('target') != null) {
        document.getElementById('disclaimer').style.display = 'block';
        document.title = 'Pryowe - Chuyển hướng, bảo vệ, rút gọn link của bạn';
        var targetUrlEncrypted = decodeURIComponent(new URL(window.location.href).searchParams.get('target')),
            waitTimeInParam = new URL(window.location.href).searchParams.get('waitTime'),
            waitTime = (waitTimeInParam == undefined || waitTimeInParam == null) ? 10 : waitTimeInParam,
            passwordInParam = new URL(window.location.href).searchParams.get('password'),
            password = (passwordInParam == undefined || passwordInParam == null) ? (password = prompt('Vui lòng nhập mật khẩu (Please enter the password): ')) : passwordInParam;
        document.getElementById('disclaimer').innerHTML = 'Vui lòng chờ chuyển hướng trong ' + waitTime + ' giây, dưới đây là bản xem trước trang web sẽ được hiển thị! Chúng tôi sẽ không chịu trách nhiệm về nội dung trang web dưới đây! <i>(Please wait for the redirect for ' + waitTime + ' seconds, below is the web preview that will be displayed! We will not be responsible for the website content below!)</i><br /> <b style="color: red; cursor: pointer" onclick="goToWeb()">Bấm vào đây để truy cập thẳng vào web <i>(Click here for direct access to the web)</i></b>';
        try {
            Crypto.AES.decrypt(targetUrlEncrypted, password);
        } catch (err) {
            document.getElementById('disclaimer').innerHTML = '<font color="red">SAI MẬT KHẨU (WRONG PASSWORD)!</font>';
            location.reload();
        }
        redirectTimeout = setTimeout(() => location.href = Crypto.AES.decrypt(targetUrlEncrypted, password), waitTime * 1000);
        document.getElementById('iframe').src = Crypto.AES.decrypt(targetUrlEncrypted, password);
        goToWeb = () => window.open(Crypto.AES.decrypt(targetUrlEncrypted, password));
    } else {
        location.href = location.href.replace('#introDiv', '') + '#introDiv';
        document.getElementById("iframe").style.display = 'none';
        document.getElementById("disclaimer").style.display = 'none';
        var iframeContent = (document.getElementById("iframe").contentWindow || document.getElementById("iframe").contentDocument),
            inputElm = document.body.getElementsByTagName("input");
        iframeContent.document.body.innerHTML = document.getElementById('introDiv').innerHTML;
        reloadPage = setTimeout(() => {
            window.location.reload(1);
            console.clear();
        }, 5000);
    }

</script>

*/
