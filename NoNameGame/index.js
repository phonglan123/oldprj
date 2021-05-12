function ogShowFrame(game) {
    var text, image, frame, investB = 16,
        investM = 16,
        gmsgGold = 96;
    switch (game) {
        case "gmsg":
            text = "Đào và đầu tư vàng (từ nhà tài trợ GMSG)";
            image = "https://icons-for-free.com/iconfiles/png/512/gold+icon-1320184413669312446.png";
            frame = "GoldMiningSimpleGame/index.html?investBonus=" + investB + "&investMilestone=" + investM + "&goldBar=" + gmsgGold;
            break;
        case "ls":
            text = "Vòng quay may mắn (từ nhà tài trợ VieGame)";
            image = "https://www.playsmart.ca/wp-content/uploads/2019/03/8_BS_SpinningWheel-637x637-1.png";
            frame = "LuckySpin/index.html";
            break;
        case "mr":
            text = "Mưa tiền xu (từ nhà tài trợ P8420)";
            image = "https://blacklabelagency.com/wp-content/uploads/2017/08/money-icon.png";
            frame = "MoneyRain/index.html";
            break;
        case "tg":
            text = "Trò chơi thời gian (từ nhà tài trợ RedBlood)";
            image = "https://freeiconshop.com/wp-content/uploads/edd/clock-flat.png";
            frame = "TimeGame/index.html";
            break;
        case "intro":
            convertMoney(gameNow);
            text = "Hướng dẫn";
            image = "https://static.thenounproject.com/png/118652-200.png";
            frame = "blankOgIframe.html";
            document.getElementById("ogDiv").classList.add("hideOGdiv");
            break;
        case "convert":
            convertMoney(gameNow);
            text = document.getElementById("ogFrameName").innerHTML;
            image = document.getElementById("ogFrameIMG").src;
            frame = document.getElementById("ogIFRAME").src;
            break;
    }
    document.getElementById("ogFrameIMG").src = image;
    document.getElementById("ogFrameName").innerHTML = text;
    document.getElementById("ogIFRAME").src = frame;
    gameNow = game;
}

function fixed(amount, number) {
    return Number.parseFloat(Number.parseFloat(number).toFixed(amount));
}

function convertMoney(game) {
    switch (game) {
        case "gmsg":
            money = fixed(4, money) + (fixed(4, document.getElementById("ogIFRAME").contentWindow.goldBar) - 96) * 1.5;
            break;
        case "ls":
            money = fixed(4, money) + (fixed(4, document.getElementById("ogIFRAME").contentWindow.PetCoin) - 160) * 0.001;
            break;
        case "mr":
            money = fixed(4, money) + fixed(4, document.getElementById("ogIFRAME").contentWindow.yourMoney) * 4;
            break;
        case "tg":
            money = fixed(4, money) + fixed(4, document.getElementById("ogIFRAME").contentWindow.yourTico) * 0.1042;
            break;
    }
    document.getElementById("yourMoney").innerHTML = "Tiền của bạn: " + fixed(3, money);
    document.getElementById("ogMoney").innerHTML = "Tiền của bạn: " + fixed(3, money);
}

function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };
    xhr.send();
};

function loadGame(fileOrder) {
    getJSON('./CocCocGames/games' + fileOrder + '.json', (err, data) => data.results.forEach(game => game.categories.forEach(category => {
        if (category.name in gameCategories) gameCategories[category.name].push(game);
        else gameCategories[category.name] = [game];
    })));
}

function loadGames() {
    for (var i = 0; i < (initTimes - 1); i++)
        loadGame(i + 1);
    var init = {
            width: "1px",
            height: "1px",
            elmID: "adsframeDiv"
        },
        script = document.createElement('script');
    adsframeinit = init;
    script.src = "https://petavietnam.github.io/Personal/AdsFrame/embed.js";
    document.getElementsByTagName('head')[0].appendChild(script);
    document.getElementById("gameCategoriesSelect").innerHTML = "";
    Object.keys(gameCategories).forEach(category => addOption("gameCategoriesSelect", category));
}

function writeCategory(name) {
    document.getElementById("gameDivList").innerHTML = "";
    gameCategories[name].forEach(game => document.getElementById("gameDivList").innerHTML += '<img id="gameDiv" onclick="openGame(' + "'" + game.game_url + "'" + ')" src="' + game.thumb_image_url + '" title="' + game.game_name + '"/>');
}

function toggleHideShowElm(id, display) {
    document.getElementById(id).style.display = display;
}

function openGame(url) {
    document.getElementById('coccocGameIframe').src = url;
    toggleHideShowElm('coccocGameIframe', 'block');
    toggleHideShowElm('coccocGameClose', 'block');
    toggleHideShowElm('coccocGameTip', 'block');
    document.body.style.overflow = 'hidden';
    gameInterval = setInterval(() => {
        if (money <= 0) {
            toggleHideShowElm('coccocGameIframe', 'none');
            toggleHideShowElm('coccocGameClose', 'none');
            toggleHideShowElm('coccocGameTip', 'none');
            document.body.style.overflow = 'auto';
            document.getElementById('coccocGameIframe').src = "";
            clearInterval(gameInterval);
            document.getElementById("yourMoneyAlert").innerHTML = "Bạn đã không còn đủ tiền để chơi trò chơi nữa. Vui lòng kiếm thêm tiền!";
            document.getElementById("yourMoneyAlert").style.color = "red";
            setTimeout(() => {
                document.getElementById("yourMoneyAlert").innerHTML = "Bạn sẽ tiêu 0.1 tiền mỗi giây bạn chơi một trò chơi phía dưới. Bấm vào nút " + " để kiếm tiền!";
                document.getElementById("yourMoneyAlert").style.color = "black";
            }, 4000);
        } else {
            money -= 0.1;
            document.getElementById("yourMoney").innerHTML = "Tiền của bạn: " + fixed(3, money);
            document.getElementById("ogMoney").innerHTML = "Tiền của bạn: " + fixed(3, money);
        }
    }, 1000);
}

function addOption(selectId, optionText) {
    var x = document.getElementById(selectId);
    var option = document.createElement("option");
    option.text = optionText;
    x.add(option);
}

var gameNow, money = 16,
    gameCategories = [],
    gameInterval, initTimes = 5;

//Lưu ý, số tiền của bạn sẽ không lưu. Vì vậy... muốn chơi 160 giây thì cứ reload là được!
