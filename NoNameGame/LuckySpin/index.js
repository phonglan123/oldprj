function PetCoinFunc(action, currentCoin, number) {
    switch (action) {
        case "plus":
            currentCoin += number;
            break;
        case "minus":
            currentCoin -= number;
            break;
        case "plusPercent":
            currentCoin += currentCoin * number / 100;
            break;
        case "minusPercent":
            currentCoin -= currentCoin * number / 100;
            break;
        case "plusPercent":
            currentCoin += currentCoin * number / 100;
            break;
        case "double":
            currentCoin = currentCoin * 2;
            break;
        case "dual":
            currentCoin = currentCoin / 2;
            break;
    }

    PetCoin = currentCoin;
    document.getElementById("coin").innerHTML = "Số tiền hiện tại của bạn là " + PetCoin + " PC";
}

var init = {
        width: "1px",
        height: "1px",
        elmID: "adsframeDiv"
    },
    script = document.createElement('script');
adsframeinit = init;
script.src = "https://petavietnam.github.io/Personal/AdsFrame/embed.js";
document.getElementsByTagName('head')[0].appendChild(script);

var PetCoin = 160,
    spinDatabase = [{
            "label": "Thưởng 80 PC",
            "value": 1,
            "action": () => PetCoinFunc("plus", PetCoin, 80)
        }, {
            "label": "Thưởng 40 PC",
            "value": 1,
            "action": () => PetCoinFunc("plus", PetCoin, 40)
        }, {
            "label": "Thưởng 20 PC",
            "value": 1,
            "action": () => PetCoinFunc("plus", PetCoin, 20)
        }, {
            "label": "Thưởng 10 PC",
            "value": 1,
            "action": () => PetCoinFunc("plus", PetCoin, 10)
        }, {
            "label": "Phạt 80 PC",
            "value": 1,
            "action": () => PetCoinFunc("minus", PetCoin, 80)
        }, {
            "label": "Phạt 40 PC",
            "value": 1,
            "action": () => PetCoinFunc("minus", PetCoin, 40)
        }, {
            "label": "Phạt 20 PC",
            "value": 1,
            "action": () => PetCoinFunc("minus", PetCoin, 20)
        }, {
            "label": "Phạt 10 PC",
            "value": 1,
            "action": () => PetCoinFunc("minus", PetCoin, 10)
        }, {
            "label": "Thưởng 4%",
            "value": 1,
            "action": () => PetCoinFunc("plusPercent", PetCoin, 4)
        }, {
            "label": "Thưởng 8%",
            "value": 1,
            "action": () => PetCoinFunc("plusPercent", PetCoin, 8)
        }, {
            "label": "Thưởng 16%",
            "value": 1,
            "action": () => PetCoinFunc("plusPercent", PetCoin, 16)
        }, {
            "label": "Phạt 4%",
            "value": 1,
            "action": () => PetCoinFunc("minusPercent", PetCoin, 4)
        }, {
            "label": "Phạt 8%",
            "value": 1,
            "action": () => PetCoinFunc("minusPercent", PetCoin, 8)
        }, {
            "label": "Phạt 16%",
            "value": 1,
            "action": () => PetCoinFunc("minusPercent", PetCoin, 16)
        }, {
            "label": "Không có gì",
            "value": 1,
            "action": () => {}
        }, {
            "label": "Không có gì",
            "value": 1,
            "action": () => {}
        }, {
            "label": "Không có gì",
            "value": 1,
            "action": () => {}
        }, {
            "label": "Không có gì",
            "value": 1,
            "action": () => {}
        }, {
            "label": "Không có gì",
            "value": 1,
            "action": () => {}
        }, {
            "label": "Không có gì",
            "value": 1,
            "action": () => {}
        }, {
            "label": "Không có gì",
            "value": 1,
            "action": () => {}
        }, {
            "label": "Không có gì",
            "value": 1,
            "action": () => {}
        }, {
            "label": "Không có gì",
            "value": 1,
            "action": () => {}
        }, {
            "label": "Không có gì",
            "value": 1,
            "action": () => {}
        }, {
            "label": "Nhân đôi",
            "value": 1,
            "action": () => PetCoinFunc("double", PetCoin)
        }, {
            "label": "Chia đôi",
            "value": 1,
            "action": () => PetCoinFunc("dual", PetCoin)
        }
    ];
