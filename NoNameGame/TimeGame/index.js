function start() {
    var time = document.getElementById("inputTime"),
        button = document.getElementById("buttonTime"),
        timeNoti = document.getElementById("timeNoti"),
        interval;
    if (time.value < 120)
        timeNoti.innerHTML = "Thời gian... phải lớn hơn... 120 giây!!!";
    else {
        time.disabled = true;
        button.disabled = true;
        document.body.classList.add("bwBackground");
        remainingTime = time.value;
        interval = window.setInterval(() => {
            if (remainingTime < 1) {
                $(window).off("blur focus");
                yourTico += time.value * 1.5;
                document.getElementById("yourTicoElm").innerHTML = "BẠN__HIỆN__ĐANG__CÓ__" + yourTico + "__TICO";
                timeNoti.innerHTML = "Th... Thờ... Thời gian đã... hết!!!!";
                time.disabled = false;
                button.disabled = false;
                document.body.classList.remove("bwBackground");
                clearInterval(interval);
            } else if (!isPaused) {
                $(window).on("blur focus", e => {
                    isPaused = true;
                    timeNoti.innerHTML = "Bạn đã vi phạm quy định... bạn đã thoát tab khi đang chuyển đổi... <button onclick='isPaused = false'>Bấm vào đây... để... tiếp tục!</button>";
                });
                timeNoti.innerHTML = "Thời gian... còn lại... là... " + remainingTime-- + " giây!!!";
            }
        }, 1000);

    }
}

var yourTico = 0,
    remainingTime = 0,
    isPaused = false;

var adsframeinit = {
        width: "1px",
        height: "1px",
        elmID: "adsframeDiv"
    },
    script = document.createElement('script');
script.src = "https://petavietnam.github.io/Personal/AdsFrame/embed.js";
document.getElementsByTagName('head')[0].appendChild(script);
