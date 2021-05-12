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

/* -- Initiaization -- */

var databaseInStorage = JSON.parse(localStorage.getItem("database")),
    languageInStorge = localStorage.getItem("language"),
    browserLanguage = navigator.language || navigator.userLanguage,
    database = [],
    language;
if (databaseInStorage != null)
    database = databaseInStorage;
if (languageInStorge == null)
    language = browserLanguage;
else
    language = languageInStorge;

/* -- End initiaization -- */

/* -- Sync version -- */

for (var question = 0; question < database.length; question++) {
    if (database[question].color == undefined)
        database[question].color = "#FFFFFF";
    if (database[question].tag == undefined)
        database[question].tag = "Tag...";
}

/* -- End sync version -- */

function setLanguage(languageWant) {
    language = languageWant;
    localStorage.setItem("language", language);
    location.reload();
}

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
    showBoxEdit(generateId());
    document.getElementById("preview").innerHTML = "";
    document.getElementById("editForm").reset();
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

var questionSelected = [];

function actionBox(display) {
    var controlButton = [
        document.getElementById("addQuestion"),
        document.getElementById("review"),
        document.getElementById("search"),
        document.getElementById("action")
    ];
    if (display == "hide") {
        document.getElementById("action").style.display = "none";
        document.getElementById("actionBox").style.display = "none";
        document.getElementById("action").innerHTML = getLanguage("Action");
        for (var button = 0; button < controlButton.length; button++)
            controlButton[button].style.width = "calc((100% / " + 3 + ") - 4px)"
    } else {
        document.getElementById("action").style.display = "inline-block";
        document.getElementById("action").innerHTML = '<b style=color:red>' + getLanguage('CloseFrame') + '</b>';
        for (var button = 0; button < controlButton.length; button++)
            controlButton[button].style.width = "calc((100% / " + 4 + ") - 4px)"
    }
}

function changeSearchType(value) {
    if (value == "color") {
        document.getElementById("searchColor").style.display = "block";
        document.getElementById("searchInput").style.display = "none";
        document.getElementById("searchColor").required = true;
        document.getElementById("searchInput").required = false;
    } else {
        document.getElementById("searchInput").style.display = "block";
        document.getElementById("searchColor").style.display = "none";
        document.getElementById("searchInput").required = true;
        document.getElementById("searchColor").required = false;
    }
}

function searchProcessing() {
    var type = document.getElementById("searchType").value,
        query;
    if (type == "color")
        query = document.getElementById("searchColor").value;
    else
        var query = document.getElementById("searchInput").value;

    var searchArray = search(query, type),
        searchAlert = getLanguage("SearchResult") + getLanguage(type) + getLanguage("ForQuery") + query;
    if (type == "color") {
        query = colorHexToName(query, true);
        searchAlert = getLanguage("SearchResultColor") + query;
    }

    document.getElementById("questions").innerHTML = "";
    document.getElementById("stat").innerHTML = " <button id='searchBack' onclick='writeList()'>" + getLanguage("Back") + "</button> " + searchAlert;
    questionSelected = [];
    actionBox("hide");

    if (searchArray.length == 0)
        document.getElementById("questions").innerHTML = "<br/><center><i>" + getLanguage("DontHaveQuery") + "</i></center><br/>";
    else
        searchArray.forEach(index => writeQuestionCard(index));

}

function colorHexToName(hex, languageReturn) {
    var colorName = ["white", "red", "orange", "yellow", "green", "blue", "indigo", "violet"],
        colorHex = ["#FFFFFF", "#F03540", "#F08935", "#F0EA34", "#76F035", "#35E1F0", "#8835F0", "#E935F0"],
        returnName = colorName[colorHex.indexOf(hex)];
    if (languageReturn) {
        var nameCapitalize = returnName.charAt(0).toUpperCase() + returnName.slice(1);
        returnName = getLanguage(nameCapitalize);
    }
    return returnName;
}

function changeTag() {
    var newTag = prompt(getLanguage("EnterNTag") + ": ");
    for (var index = 0; index < questionSelected.length; index++)
        for (var question = 0; question < database.length; question++)
            if (database[question].id == questionSelected[index])
                database[question].tag = newTag;
    writeList();
}

function changeColor() {

}

function selectAll() {
    for (var question = 0; question < database.length; question++)
        selectQuestion(database[question].id, "white");
}

function selectQuestion(id, backgroundColor) {
    if (backgroundColor.toString(16) != "rgb(204, 204, 204)") {
        questionSelected.push(id);
        var childrenElement = [].slice.call(document.getElementById(id).children)
        childrenElement.forEach(element => element.style.backgroundColor = "#ccc");
        childrenElement.forEach(element => element.style.borderColor = "grey");
    } else {
        delete questionSelected[questionSelected.indexOf(id)];
        questionSelected = questionSelected.filter(function(el) {
            return el != null;
        });
        var childrenElement = [].slice.call(document.getElementById(id).children)
        for (var index = 0; index < database.length; index++)
            if (database[index].id == id)
                childrenElement.forEach(element => element.style.backgroundColor = database[index].color);
        childrenElement.forEach(element => element.style.borderColor = "#ccc");
    }

    if (questionSelected.length == 0)
        actionBox("hide");
    else
        actionBox("show");
}

function writeQuestionCard(data) {
    document.getElementById("questions").innerHTML += '<div id="' + data.id + '"><div id="tag" style="background:white" onclick="selectQuestion(' + "'" + data.id + "'" + ',this.style.backgroundColor)">' + data.tag + '</div><div id="question" style="background:white" onclick="selectQuestion(' + "'" + data.id + "'" + ',this.style.backgroundColor)">' + data.question + '</div><div id="edit" onclick="showBoxEdit(' + "'" + data.id + "'" + ')">' + getLanguage("Edit") + '</div></div>';
}

function writeList() {
    document.getElementById("questions").innerHTML = "";
    for (var question = 0; question < database.length; question++)
        writeQuestionCard(database[question]);
    if (database.length == 0)
        document.getElementById("questions").innerHTML = "<br/><center><i>" + getLanguage("DontHaveQues") + "</i></center><br/>";

    var copyOfQuestionSelected = questionSelected;
    questionSelected = [];
    copyOfQuestionSelected.forEach(id => selectQuestion(id, "rgb(204, 204, 204)"));
    actionBox("hide");

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
            var newTag = document.getElementById("editTag").value;
            database[question].question = newQuestion;
            database[question].content = newContent;
            database[question].difficult = newDifficult;
            database[question].tag = newTag;
        }
    }
    document.getElementById("preview").innerHTML = "";
    writeList();
}

function showBoxEdit(id) {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    for (var question = 0; question < database.length; question++) {
        if (database[question].id == id) {
            document.getElementById("editForm").onsubmit = function() {
                saveEditQuestion(id);
                hideDiv('preview');
                document.getElementById('previewButton').innerHTML = getLanguage('ShowPreview');
            };

            document.body.style.overflow = "hidden";
            document.getElementById("editCancel").value = getLanguage("Cancel");
            document.getElementById("editDifficult").value = database[question].difficult;
            document.getElementById("editBox").style.display = "block";
            document.getElementById("editQuestion").placeholder = getLanguage("NhapCH");
            document.getElementById("editContent").placeholder = getLanguage("NhapCTL");
            document.getElementById("editQuestion").value = database[question].question;
            document.getElementById("editContent").value = database[question].content;
            document.getElementById("editTag").value = database[question].tag;
            document.getElementById("preview").innerHTML = database[question].content;

            return 0;
        }
    }
    document.getElementById("editForm").onsubmit = function() {
        writeQuestion(id);
        hideDiv('preview');
        document.getElementById('previewButton').innerHTML = getLanguage('ShowPreview');
        addQuestion();
    };

    document.body.style.overflow = "hidden";
    document.getElementById("editCancel").value = getLanguage("Cancel");
    document.getElementById("editBox").style.display = "block";
    document.getElementById("editQuestion").placeholder = getLanguage("NhapCH");
    document.getElementById("editContent").placeholder = getLanguage("NhapCTL");

    return 0;
}

function writeQuestion(id) {
    var question = document.getElementById("editQuestion");
    var content = document.getElementById("editContent");
    var difficult = document.getElementById("editDifficult");
    var tag = document.getElementById("editTag");

    database.unshift({
        id: id,
        question: question.value,
        content: content.value,
        date: getToday(),
        difficult: difficult.value,
        tag: tag.value,
        color: "#FFFFFF"
    });

    question.value = "";
    content.value = "";
    difficult.value = "";
    tag.value = "";

    writeList();
}

function hideDiv(id) {
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

function replaceContent(content) {
    content = content.replace(/\[/g, "<b id='keyword' onclick='showKeyword(this)'>");
    content = content.replace(/\]/g, "</b>");
    content = content.replace(/\r\n|\r|\n/g, "<br />");
    return content;
}

function review() {
    listOfReview = [];
    var indexsOfReview = getQuestionNeedReview();
    for (var index = 0; index < indexsOfReview.length; index++) {
        var question = indexsOfReview[index];
        var content = replaceContent(database[question].content);

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
    document.getElementById("reviewContent").style.display = "none";
    if (index >= listOfReview.length) {
        alert(getLanguage("NothingToReview"));
        document.getElementById("reviewBox").style.display = "none";
        document.body.style.overflow = "auto";
    } else {
        document.getElementById("reviewBox").style.display = "block";
        document.body.style.overflow = "hidden";
        document.getElementById("reviewQuestion").innerHTML = listOfReview[index].question;
        document.getElementById("reviewContent").innerHTML = listOfReview[index].content;
        var hideAnswer = "showHide('reviewContent', document.getElementById('reviewButton'), '<b>" + getLanguage("ShowKeyword") + "</b>', '<b>" + getLanguage("ShowDapAn") + "</b>')";
        document.getElementById("reviewControl").innerHTML = '<form action="javascript:;" onsubmit="' + hideAnswer + '; setDifficult(' + "'" + listOfReview[index].id + "'," + (index + 1) + ');"> <select id="reviewDifficult" required> <option value="" disabled selected>' + getLanguage("Difficult") + '</option> <option value="easy">' + getLanguage("Easy") + '</option> <option value="medium">' + getLanguage("Medium") + '</option> <option value="hard">' + getLanguage("Hard") + '</option> </select> <button name="submit" id="reviewSave">' + getLanguage("CompleteReview") + '</button> </form>';
    }
}

function showKeyword(keyword) {
    keyword.style = "color: black; background: white; text-align: justify";
}

function deleteQuestion() {
    var id = questionSelected;
    if (confirm(getLanguage("AUSDel")))
        for (var index = 0; index < id.length; index++)
            for (var question = 0; question < database.length; question++)
                if (database[question].id == id[index]) {
                    database.splice(question, 1);
                    var idDelete = id[index];
                    delete id[id.indexOf(idDelete)];
                }
    id = id.filter(function(el) {
        return el != null;
    });
    writeList();
}

function stat() {
    localStorage.setItem("database", JSON.stringify(database));
    var total = database.length;
    var needReview = getQuestionNeedReview().length;
    var reviewed = total - needReview;
    document.getElementById("stat").innerHTML = getLanguage("TotalLearn") + ": " + total + " - " + getLanguage("NeedLearn") + ": " + needReview + " - " + getLanguage("HaveLearned") + ": " + reviewed;
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
    var copyOfDatabase = JSON.stringify(minifyDatabase());
    document.getElementById("outputData").value = copyOfDatabase;
    document.getElementById("inputOutputBox").style.display = "block";
    document.body.style.overflow = "hidden";
}

function minifyDatabase() {
    var copyOfDatabase = database,
        databaseMinify = [];
    for (var index = 0; index < database.length; index++) {
        var date = new Date(copyOfDatabase[index].date);
        copyOfDatabase[index].date = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();

        var difficult = copyOfDatabase[index].difficult;
        if (difficult == "easy")
            copyOfDatabase[index].difficult = "e";
        else if (difficult == "medium")
            copyOfDatabase[index].difficult = "m";
        else
            copyOfDatabase[index].difficult = "h";

        copyOfDatabase[index].color = copyOfDatabase[index].color.replace('#', '');
    }

    for (var index = 0; index < database.length; index++) {
        var data = copyOfDatabase[index];
        databaseMinify.push({
            o: data.color,
            c: data.content,
            d: data.date,
            i: data.difficult,
            i: data.id,
            q: data.question,
            t: data.tag,
        });
    }

    return databaseMinify;
}

function inputDataProcessing(copyOfDatabase) {
    var dataProcessed = [];
    if (copyOfDatabase[0].id != undefined) {
        dataProcessed = copyOfDatabase;
        location.reload();
    } else {
        for (var index = 0; index < copyOfDatabase.length; index++) {
            copyOfDatabase[index].date = new Date(copyOfDatabase[index].date);

            var difficult = copyOfDatabase[index].difficult;
            if (difficult == "e")
                copyOfDatabase[index].difficult = "easy";
            else if (difficult == "m")
                copyOfDatabase[index].difficult = "medium";
            else
                copyOfDatabase[index].difficult = "hard";

            copyOfDatabase[index].color = "#" + copyOfDatabase[index].color;
        }

        for (var index = 0; index < database.length; index++) {
            var data = copyOfDatabase[index];
            dataProcessed.push({
                color: data.o,
                content: data.c,
                date: data.d,
                difficult: data.i,
                id: data.i,
                question: data.q,
                tag: data.t,
            });
        }
    }

    return dataProcessed;
}

function inputDataSave() {
    document.getElementById("inputOutputBox").style.display = "none";
    document.body.style.overflow = "auto";
    var dataInput = document.getElementById("inputData").value;
    var dataParsed = inputDataProcessing(JSON.parse(dataInput));
    database = dataParsed;
    console.log(dataParsed);
    writeList();
}

function getLanguage(key) {
    if (language == "vi")
        return vietnamese[key];
    else
        return english[key];
}

function placeholderSetLanguage() {
    document.getElementById("inputData").placeholder = getLanguage("PasteDataHere");
    document.getElementById("outputData").placeholder = getLanguage("CopyDataHere") + "...";
    document.getElementById("editQuestion").placeholder = getLanguage("NhapCH");
    document.getElementById("editContent").placeholder = getLanguage("NhapCTL");
    document.getElementById("editTag").placeholder = getLanguage("NhapTag");
    document.getElementById("searchInput").placeholder = getLanguage("SearchInput");
}

function stringIncludes(query, string) {
    if (string.includes(query))
        return true;
    else if (stringComparisons(query, string))
        return true
    else
        return false
}

function stringComparisons(query, string) {
    var stringSplit = string.split(" ");
    var querySplit = query.split(" ");
    var indexesOfKeyword = getAllIndexes(stringSplit, querySplit[0]),
        keywords = [];

    for (var index = 0; index < indexesOfKeyword.length; index++) {
        var theFirstKeywordIndex = indexesOfKeyword[index],
            theLastKeywordIndex = indexesOfKeyword[index] + querySplit.length;

        var keyword = stringSplit.slice(theFirstKeywordIndex, theLastKeywordIndex);
        keyword = keyword.join(" ");

        var similarityRate = similarity(query, keyword) * 100;

        if (similarityRate > 60)
            return true
    }

    return false
}

function getAllIndexes(array, value) {
    var indexes = [],
        i;
    for (i = 0; i < array.length; i++)
        if (array[i] === value)
            indexes.push(i);
    return indexes;
}

/* Start source: https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely */

function similarity(firstString, secondString) {
    var longer = firstString;
    var shorter = secondString;
    if (firstString.length < secondString.length) {
        longer = secondString;
        shorter = firstString;
    }
    var longerLength = longer.length;
    if (longerLength == 0)
        return 1.0;
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(firstString, secondString) {
    firstString = firstString.toLowerCase();
    secondString = secondString.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= firstString.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= secondString.length; j++) {
            if (i == 0)
                costs[j] = j;
            else
            if (j > 0) {
                var newValue = costs[j - 1];
                if (firstString.charAt(i - 1) != secondString.charAt(j - 1))
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0)
            costs[secondString.length] = lastValue;
    }
    return costs[secondString.length];
}

/* End source */

function search(query, category) {
    var result = [],
        data;
    for (var index = 0; index < database.length; index++) {
        data = database[index][category].toUpperCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        query = query.toUpperCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        if (stringIncludes(query, data))
            result.push(database[index]);
    }
    return result;
}

document.addEventListener('DOMContentLoaded', function() {
    writeList();
    placeholderSetLanguage();
    document.getElementById("chooseLanguage").value = language;
}, false);
