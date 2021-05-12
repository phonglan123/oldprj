Array.prototype.shuffle = function() {
    var array = this,
        currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

var databaseInStorage = JSON.parse(localStorage.getItem("database")),
    database = [];
if (databaseInStorage != null)
    database = databaseInStorage;

function generateId() {
    var randomId = () => {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    var idHaveInDatabase = false,
        allId = database.map(database => database.id),
        id;

    while (idHaveInDatabase == false) {
        id = randomId();
        if (!allId.includes(id))
            idHaveInDatabase = true;
    }

    return id;
}

function addQuestion() {
    var question = document.getElementById("inputQuestion");
    var content = document.getElementById("inputContent");
    var difficult = document.getElementById("inputDifficult");

    database.push({
        id: generateId(),
        question: question.value,
        content: content.value,
        date: getToday(),
        difficult: difficult.value
    });

    question.value = "";
    content.value = "";
    difficult.value = "";

    writeList();
}

function getToday() {
    var thisYear = new Date().getFullYear();
    var thisMonth = new Date().getMonth() + 1;
    var today = new Date().getDate();
    return new Date(thisYear, thisMonth, today);
}

function time(startTime, endTime) {
    var differenceInTime = new Date(endTime).getTime() - new Date(startTime).getTime();
    var differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays;
}

function writeList() {
    document.getElementById("questions").innerHTML = "";
    for (var question = 0; question < database.length; question++) {
        document.getElementById("questions").innerHTML += '<div id="' + database[question].id + '"><div id="question">' + database[question].question + '</div><div id="edit" onclick="showBoxEdit(' + "'" + database[question].id + "'" + ')">Sửa</div><div id="delete" onclick="deleteQuestion(' + "'" + database[question].id + "'" + ')">Xóa</div></div>';
    }
    if (database.length == 0) {
        document.getElementById("questions").innerHTML = "<br/><center><i>Chưa có câu hỏi nào. Bấm vào nút Thêm câu hỏi để thêm câu hỏi mới...</i></center><br/>";
    }
    stat();
    localStorage.setItem("database", JSON.stringify(database));
}

function showHide(id, button, closeText, defaultText) {
    var element = document.getElementById(id);
    if (element.style.display === "block") {
        button.innerHTML = defaultText;
        element.style.display = "none";
    } else {
        button.innerHTML = closeText;
        element.style.display = "block";
    }
}

function saveEditQuestion(id) {
    for (var question = 0; question < database.length; question++) {
        if (database[question].id == id) {
            document.getElementById("editBox").style.display = "none";
            document.body.style.overflow = "auto";
            var newQuestion = document.getElementById("editQuestion").value;
            var newContent = document.getElementById("editContent").value;
            var newDifficult = document.getElementById("editDifficult").value;
            database[question].question = newQuestion;
            database[question].content = newContent;
            database[question].difficult = newDifficult;
        }
    }
    writeList();
}

function showBoxEdit(id) {
    for (var question = 0; question < database.length; question++) {
        if (database[question].id == id) {
            var idPart = '<form id="editForm" action="javascript:;" onsubmit="saveEditQuestion(' + "'" + id + "'" + ')">';
            var questionPart = '<input type="text" placeholder="Nhập câu hỏi..." id="editQuestion" required value="' + database[question].question + '"/>';
            var contentPart = '<textarea id="editContent" placeholder="Nhập câu trả lời..." required>' + database[question].content + '</textarea>';
            var tipsPart = '<div id="editTips"> Lưu ý: <i>Đặt <b>từ khóa cần ghi nhớ</b> trong dấu ngoặc vuông "[]" để ẩn nó. Ví dụ: <b>Hello có nghĩa là [xin chào]</b>, khi đó, từ <b>"xin chào"</b> sẽ bị ẩn</i> </div>';
            var morePart = '<select id="editDifficult" required> <option value="" disabled selected>Chọn độ khó của câu này</option> <option value="easy">Dễ (1 tuần sau sẽ ôn lại)</option> <option value="medium">Trung bình (4 ngày sau sẽ ôn lại)</option> <option value="hard">Khó (1 ngày sau sẽ ôn lại)</option> </select> <button name="submit" id="editSave">Lưu</button> <input type="reset" id="editCancel" value="Hủy bỏ" onclick="hideDiv(' + "'editBox'" + '); document.body.style.overflow = ' + "'auto'" + ';"/> </form>';
            document.getElementById("editBox").innerHTML = idPart + questionPart + contentPart + tipsPart + morePart;
            document.getElementById("editDifficult").value = database[question].difficult;
            document.getElementById("editBox").style.display = "block";
            document.body.style.overflow = "hidden";
        }
    }
}

function hideDiv(id) {
    document.getElementById(id).innerHTML = '';
    document.getElementById(id).style.display = 'none';
}

function setDifficult(id, nextIndex) {
    var newDifficult = document.getElementById("reviewDifficult").value;
    for (var question = 0; question < database.length; question++) {
        if (database[question].id == id) {
            database[question].difficult = newDifficult,
                database[question].date = getToday()
        }
    }
    writeList();
    showReview(nextIndex);
}

var listOfReview = [];

function review() {
    listOfReview = [];
    var indexsOfReview = getQuestionNeedReview();
    for (var index = 0; index < indexsOfReview.length; index++) {
        var question = indexsOfReview[index];
        var content = database[question].content;
        content = content.replace(/\[/g, "<b id='keyword' onclick='showKeyword(this)'>");
        content = content.replace(/\]/g, "</b>");
        content = content.replace(/\\n/g, "<br/>");
        listOfReview.push({
            id: database[question].id,
            question: database[question].question,
            content: content
        });
    }
    listOfReview.shuffle();
    showReview(0);
}

function showReview(index) {
    if (index >= listOfReview.length) {
        alert("Bạn không còn gì để học hôm nay cả!");
        document.getElementById("reviewBox").style.display = "none";
        document.body.style.overflow = "auto";
    } else {
        document.getElementById("reviewBox").style.display = "block";
        document.body.style.overflow = "hidden";
        document.getElementById("reviewQuestion").innerHTML = listOfReview[index].question;
        document.getElementById("reviewContent").innerHTML = listOfReview[index].content;
        var hideAnswer = "showHide('reviewContent', document.getElementById('reviewButton'), '<b>Bấm vào các dải màu xám để hiện thị từ khóa chính bị ẩn</b>', '<b>Bấm vào đây để xem đáp án</b>')";
        document.getElementById("reviewControl").innerHTML = '<form action="javascript:;" onsubmit="' + hideAnswer + '; setDifficult(' + "'" + listOfReview[index].id + "'," + (index + 1) + ');"> <select id="reviewDifficult" required> <option value="" disabled selected>Chọn độ khó của câu này</option> <option value="easy">Dễ (1 tuần sau sẽ ôn lại)</option> <option value="medium">Trung bình (4 ngày sau sẽ ôn lại)</option> <option value="hard">Khó (1 ngày sau sẽ ôn lại)</option> </select> <button name="submit" id="reviewSave">Đã xong câu này</button> </form>';
    }
}

function showKeyword(keyword) {
    keyword.style = "color: black; background: white; text-align: justify";
}

function deleteQuestion(id) {
    for (var question = 0; question < database.length; question++) {
        if (database[question].id == id)
            database.splice(question, 1);
    }
    writeList();
}

function stat() {
    localStorage.setItem("database", JSON.stringify(database));
    var total = database.length;
    var needReview = getQuestionNeedReview().length;
    var reviewed = total - needReview;
    document.getElementById("stat").innerHTML = "Tổng cộng: " + total + " - Cần học: " + needReview + " - Đã học: " + reviewed;
}

function getQuestionNeedReview() {
    var needReview = [];
    for (var question = 0; question < database.length; question++) {
        var difference = time(database[question].date, getToday());
        if (database[question].difficult == "easy" && difference >= 7)
            needReview.push(question);
        else if (database[question].difficult == "medium" && difference >= 4 && difference < 7)
            needReview.push(question);
        else if (database[question].difficult == "hard" && difference >= 1 && difference < 4)
            needReview.push(question);
    }
    return needReview;
}

function showInputOutput() {
    document.getElementById("outputData").value = JSON.stringify(database);
    document.getElementById("inputOutputBox").style.display = "block";
    document.body.style.overflow = "hidden";
}

function inputDataSave() {
    document.getElementById("inputOutputBox").style.display = "none";
    document.body.style.overflow = "auto";
    var dataInput = document.getElementById("inputData").value;
    var dataParsed = JSON.parse(dataInput);
    database = dataParsed;
    writeList();
}

document.addEventListener('DOMContentLoaded', function() {
    writeList();
    if (database.length == 0)
        showHide("video", document.getElementById("videoTitle"), "<b style=color:red>Bấm vào đây để đóng video</b>", "Video hướng dẫn sử dụng");
}, false);
