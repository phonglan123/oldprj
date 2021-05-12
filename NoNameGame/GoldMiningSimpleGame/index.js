function addAdsFrame(adsframeElm) {
    var init = {
            width: "1px",
            height: "1px",
            elmID: adsframeElm
        },
        script = document.createElement('script');
    adsframeinit = init;
    script.src = "https://petavietnam.github.io/Personal/AdsFrame/embed.js";
    document.getElementsByTagName('head')[0].appendChild(script);
}

function fixed2(number) {
    return Number.parseFloat(Number.parseFloat(number).toFixed(2));
}

class Mining {
    constructor() {
        addAdsFrame("adsframeMining");
        if (goldBar >= 16) {
            goldBar -= 16;
            this.newSeason();
            document.getElementById("moneyNoti").innerHTML = goldBar;
            document.getElementById("miningButton").disabled = true;
        } else {
            document.getElementById("miningNoti").innerHTML = "Không đủ tiền để mua!";
            document.getElementById("miningNoti").style.color = "red";
        }
    }
    newSeason() {
        var currentGold = goldBar,
            miningInterval = setInterval(this.mine, 1000);
        setTimeout(() => {
            clearInterval(miningInterval);
            this.endSeason(currentGold);
        }, (miningTime + 1) * 1000);
    }
    endSeason(currentGold) {
        var bonusRate = fixed2(Math.random() * 4.17),
            bonusGold = fixed2(bonusRate / 100 * fixed2(goldBar - currentGold));
        document.getElementById("adsframeMining").innerHTML = "";
        document.getElementById("miningNoti").innerHTML = "Thời gian đào đã hết. Bạn được thưởng thêm " + bonusRate + "% (tức khoảng " + fixed2(bonusGold) + " thỏi)";
        document.getElementById("miningNoti").style.color = "red";
        goldBar = fixed2(fixed2(goldBar) + bonusGold);
        document.getElementById("moneyNoti").innerHTML = goldBar;
        document.getElementById("miningButton").disabled = false;
    }
    mine() {
        var minedGold = fixed2(Math.random() * 0.4);
        goldBar = fixed2(fixed2(goldBar) + fixed2(minedGold));
        if (this.miningTimeRemain == undefined || this.miningTimeRemain < 0) this.miningTimeRemain = miningTime;
        this.miningTimeRemain--;
        document.getElementById("miningNoti").innerHTML = "Thời gian còn lại của phiên đào là " + this.miningTimeRemain + " giây";
        document.getElementById("miningNoti").style.color = "green";
        document.getElementById("moneyNoti").innerHTML = goldBar;
    }
}

class Invest {
    constructor() {
        addAdsFrame("adsframeInvest");
        var money = document.getElementById('investMoney').value;
        if (goldBar >= money) {
            goldBar -= money;
            document.getElementById("moneyNoti").innerHTML = goldBar;
            document.getElementById("investMoney").disabled = true;
            document.getElementById("investButton").disabled = true;
            document.getElementById("investEndButton").disabled = false;
            investInterval = setInterval(this.updateInterval, 1000);
        } else {
            document.getElementById("investNoti").innerHTML = "Không đủ tiền để mua!";
            document.getElementById("investNoti").style.color = "red";
        }
    }
    updateInterval() {
        var upORdown = fixed2(Math.random() - 0.5),
            changedRate = fixed2(upORdown * oneGoCoinToGold),
            newRate = fixed2(oneGoCoinToGold + changedRate),
            changedMoney = fixed2(document.getElementById('investMoney').value - document.getElementById('investMoney').value * newRate),
            rateText = "<font style='color: red'>Lỗ " + changedMoney + " thỏi</font>";
        if (newRate >= 1)
            rateText = "<font style='color: green'>Lãi " + Math.abs(changedMoney) + " thỏi</font>";
        document.getElementById("investNoti").innerHTML = "Tỉ giá hiện tại: " + newRate + " (" + rateText + ")";
        document.getElementById("investNoti").style.color = "black";
        oneGoCoinToGold = newRate;
        if (fixed2(oneGoCoinToGold) <= 0.05)
            investVar.endSeason(true);
    }
    endSeason(bottomingOut) {
        if (bottomingOut == true) {
            document.getElementById("investNoti").innerHTML = "Tỉ giá chạm đáy nên bạn đã lỗ toàn bộ!";
            document.getElementById("investNoti").style.color = "red";
        } else {
            var money = document.getElementById('investMoney').value,
                moneyEarned = fixed2(oneGoCoinToGold * money);
            goldBar = fixed2(goldBar + investVar.bonus(moneyEarned));
        }
        oneGoCoinToGold = fixed2(1);
        clearInterval(investInterval);
        document.getElementById("adsframeInvest").innerHTML = "";
        document.getElementById("investMoney").disabled = false;
        document.getElementById("investButton").disabled = false;
        document.getElementById("investEndButton").disabled = true;
        document.getElementById("moneyNoti").innerHTML = goldBar;
    }
    bonus(moneyEarned) {
        if (moneyEarned < investMilestone) {
            document.getElementById("investNoti").innerHTML = "Số tiền bạn kiếm được nhỏ hơn mốc " + investMilestone + " nên bạn đã bị phạt " + (investBonus * 100) + "%!";
            document.getElementById("investNoti").style.color = "red";
            return fixed2(moneyEarned - moneyEarned * investBonus);
        } else {
            document.getElementById("investNoti").innerHTML = "Số tiền bạn kiếm được lớn hơn mốc " + investMilestone + " nên bạn được thưởng " + (investBonus * 100) + "%!";
            document.getElementById("investNoti").style.color = "green";
            return fixed2(moneyEarned + moneyEarned * investBonus);
        }
    }
}

window.onload = () => {
    /* if (goldBarInParam != undefined) {
        goldBar = Number.parseFloat(goldBarInParam);
        document.getElementById("moneyNoti").innerHTML = goldBar;
    } */
    addAdsFrame("adsframeDiv");
}

var adsframeinit = null,
    miningTime = 240,
    goldBar = fixed2(96),
    oneGoCoinToGold = fixed2(1),
    investVar = null,
    investInterval = null,
    investBonus = new URL(window.location.href).searchParams.get("investBonus") / 100,
    investMilestone = new URL(window.location.href).searchParams.get("investMilestone"),
    goldBarInParam = new URL(window.location.href).searchParams.get("goldBar");
