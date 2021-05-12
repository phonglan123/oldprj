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

Object.prototype.find = function(query) {
	var arrayOfKeys = Object.keys(this),
		result = "";
	arrayOfKeys.forEach(key => {
		if (key == query)
			result = this[query];
	});
	return result;
}

var databaseInStorage = JSON.parse(localStorage.getItem("database")),
	languageInStorage = localStorage.getItem("language"),
	pointInStorage = localStorage.getItem("point"),
	browserLanguage = navigator.language || navigator.userLanguage,
	database = [],
	language = "en",
	point = 0;
if (databaseInStorage != null)
	database = databaseInStorage;
if (pointInStorage != null)
	point = pointInStorage;
if (languageInStorage == null)
	language = browserLanguage;
else
	language = languageInStorage;


for (var question = 0; question < database.length; question++) {
	if (database[question].color == undefined)
		database[question].color = "#FFFFFF";
	if (database[question].tag == undefined)
		database[question].tag = "Tag...";
}

function setLanguage(languageWant) {
	language = languageWant;
	localStorage.setItem("language", language);
	location.reload();
}

function generateId() {
	var randomId = () => {
		return (((1 + Math.random()) * 0x10000) | 0)
			.toString(16)
			.substring(1);
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
	document.getElementById("editForm")
		.reset();
	writeList();
}

function getToday() {
	var thisYear = new Date()
		.getFullYear();
	var thisMonth = new Date()
		.getMonth() + 1;
	var today = new Date()
		.getDate();
	return new Date(thisYear, thisMonth, today);
}

function time(startTime, endTime) {
	var differenceInTime = new Date(endTime)
		.getTime() - new Date(startTime)
		.getTime();
	var differenceInDays = differenceInTime / (1000 * 3600 * 24);
	return differenceInDays;
}

var questionSelected = [];

function actionBox(display) {
	var controlButton = [
		document.getElementById("addQuestion"),
		document.getElementById("search"),
		document.getElementById("review"),
		document.getElementById("action"),
		document.getElementById("settingButton")
	];
	if (display == "hide") {
		document.getElementById("action")
			.style.display = "none";
		document.getElementById("actionBox")
			.style.display = "none";
		document.getElementById("action")
			.innerHTML = '<b style=color:red>' + getLanguage('CloseFrame') + '</b>';
		for (var button = 0; button < controlButton.length; button++)
			controlButton[button].style.width = "calc((100% / 4) - 4px)";
	} else {
		document.getElementById("action")
			.style.display = "inline-block";
		document.getElementById("action")
			.innerHTML = getLanguage("Action");
		for (var button = 0; button < controlButton.length; button++)
			controlButton[button].style.width = "calc((100% / 5) - 4px)";
		document.getElementById("settingButton")
			.style.width = "calc((100% / 5) - 5px)";
	}
}

function changeSearchType(value) {
	if (value == "color") {
		document.getElementById("searchColor")
			.style.display = "inline-block";
		document.getElementById("searchInput")
			.style.display = "none";
		document.getElementById("searchColor")
			.required = true;
		document.getElementById("searchInput")
			.required = false;
	} else {
		document.getElementById("searchInput")
			.style.display = "inline-block";
		document.getElementById("searchColor")
			.style.display = "none";
		document.getElementById("searchInput")
			.required = true;
		document.getElementById("searchColor")
			.required = false;
	}
}

function searchProcessing() {
	var type = document.getElementById("searchType")
		.value,
		query;
	if (type == "color")
		query = document.getElementById("searchColor")
		.value;
	else
		var query = document.getElementById("searchInput")
			.value;

	var searchArray = search(query, type),
		searchAlert = getLanguage("SearchResult") + getLanguage(type) + getLanguage("ForQuery") + query;
	if (type == "color") {
		query = colorHexToName(query, true);
		searchAlert = getLanguage("SearchResultColor") + query;
	}

	document.getElementById("questions")
		.innerHTML = "";
	document.getElementById("stat")
		.innerHTML = " <button id='searchBack' onclick='writeList()'>" + getLanguage("Back") + "</button> " + searchAlert;
	questionSelected = [];
	actionBox("hide");

	if (searchArray.length == 0)
		document.getElementById("questions")
		.innerHTML = "<br/><center><i>" + getLanguage("DontHaveQuery") + "</i></center><br/>";
	else
		searchArray.forEach(index => writeQuestionCard(index));

}

function colorHexToName(hex, languageReturn) {
	var colorName = ["white", "gray1", "gray2", "red", "orange", "yellow", "green", "blue", "indigo", "violet", "violet", "pink", "brown"],
		colorHex = ["#ffffff", "#e8eaed", "#d2d2d4", "#f28b82", "#fbbc04", "#fff475", "#ccff90", "#a7ffeb", "#aecbfa", "#d7aefb", "#fdcfe8", "#e6c9a8"],
		returnName = colorName[colorHex.indexOf(hex)];
	if (languageReturn) {
		var nameCapitalize = returnName.charAt(0)
			.toUpperCase() + returnName.slice(1);
		returnName = getLanguage(nameCapitalize);
	}
	return returnName;
}

function getLevel(levelPointNeed, levelNames, getType) {
	if (point >= 100000)
		return "Master";
	else
		for (var index = 0; index < levelNames.length; index++)
			if (levelPointNeed[index][0] <= point && point <= levelPointNeed[index][1]) {
				if (getType == "nextPoint") {
					if (levelPointNeed[index + 1] == undefined)
						return [100000];
					return levelPointNeed[index + 1];
				}
				if (getType == "index")
					return index;
				return levelNames[index];
			}
}

function writePointList(pointNeed, levelNames) {
	var result = '<table class="himakeyPList" style="width: 100%">';
	levelNames.forEach((level, index) => {
		result += '<tr><td style="width: 10px"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><g fill="none" fill-rule="evenodd" transform="translate(-3 -3)"><circle cx="12" cy="12" r="8" fill="#3a86ff"></circle><path fill="#fff" d="' + getLevelIcon(index) + '"></path></g></svg></td><td>' + pointNeed[index][0] + '→' + pointNeed[index][1] + '</td><th>' + getLanguage(levelNames[index]) + '</th></tr>';
	});
	result += '<tr><td style="width: 10px; border-bottom: none"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><g fill="none" fill-rule="evenodd" transform="translate(-3 -3)"><circle cx="12" cy="12" r="8" fill="#3a86ff"></circle><path fill="#fff" d="M10.9 10.9s.5.5 1.1.5c.6 0 1.1-.5 1.1-.5l3.4-3.4-3.4 6.8s-.6.8-1.1.8c-.6 0-1.1-.9-1.1-.9L7.5 7.5l3.4 3.4zm-3.4 0c1.4 1.5 4.5 6.6 4.5 7.8 0 3.2 0 0 0 0s-4.2-1.6-5.6-4.4c-.8-1.5-2.2-7 1.1-3.4zm4.5 7.8c0-1.1 4.6-7.9 4.6-7.9 3.4-3.4 2 2 1.2 3.3-1.5 2.8-5.8 4.7-5.8 4.7zm0-12.3l2.3 1.1L12 9.8 9.7 7.5 12 6.4z"></path></g></svg></td><td style="border-bottom: none">100000+</td><th style="border-bottom: none">' + getLanguage("Master") + '</th></tr></table>';
	return result;
}

function getLevelIcon(levelIndex) {
	var levelIcon = [
		"",
		"M12 16.5c-.2-.4-2.5-2.4-3.2-4l-.2-1c0-3.2 2-3.6 3.4-3.6s3.4.4 3.4 3.5c0 .3-.1.7-.3 1-.7 1.7-3 3.7-3.1 4zm0 0z",
		"M12 6.8c1.3 0 3.4.3 3.4 3.4 0 1.2-1.6 3.2-2.3 4.7-1 2.4-1 3.4-1 3.4s-.2-1-1.2-3.4c-.6-1.5-2.2-3.5-2.2-4.7 0-3.1 2-3.4 3.3-3.4z",
		"M15.7 12.3c0 3.2-3.4 5.8-3.4 5.8v-7.3c0-3.2 2-2.9 3-2.9s.4 1.2.4 4.4zm-7.4 0c0-3.2-.7-4.4.3-4.4s3.1-.3 3.1 2.9V18s-3.4-2.6-3.4-5.8z",
		"M7.5 7.5c1 0 3.4.2 3.4 3.4v7.8S7.5 15.3 7.5 12s-1-4.5 0-4.5zm9 0c1 0 0 1.3 0 4.5S13 18.8 13 18.8v-8c0-3.1 2.4-3.3 3.4-3.3z",
		"M6.4 7.5c1 0 4.5 2.4 4.5 5.6v5.7s-3-.6-3.4-6.8c-.2-3.2-2-4.5-1.1-4.5zm11.2 0c1 0-1 1.3-1.1 4.5-.4 6.2-3.4 6.8-3.4 6.8V13c0-3.2 3.5-5.6 4.5-5.6zM12 5.9c.4 0 1 .2 1 1.6s-1 3.4-1 3.4-1-2-1-3.4.6-1.6 1-1.6z",
		"M12 17.5s.4-.2 1.1-2.2c.9-2.4 3.1-4.5 5.7-4.5 0 1.2-1 .7-2.3 4.5a4.8 4.8 0 0 1-4.5 3.4v-1.2 1.2a4.8 4.8 0 0 1-4.5-3.4c-1.4-3.8-2.3-3.4-2.3-4.5 2.6 0 4.8 2 5.7 4.5.7 2 1 2.2 1.1 2.2zm0-11s1.3.4 2.3 1c.6.5 1 1.2 1 1.2s-1.3 1-2.2 2.3c-.8 1-1.1 2.2-1.1 2.2s-.3-1.1-1.1-2.2C10 9.8 8.6 8.7 8.6 8.7s.6-.7 1.2-1.1c1-.7 2.2-1.1 2.2-1.1z",
		"M12 18.6v.1zm2.6-5a19 19 0 0 1 2-2.8c3.4-3.4 2 2 1.2 3.3-1.5 2.8-5.8 4.7-5.8 4.7S7.8 17 6.4 14.2c-.8-1.4-2.2-6.8 1.1-3.3l1.8 2.4-1.5-3.6 3 3.1s.6.6 1.2.6 1.1-.6 1.1-.6l3.1-3-1.6 3.7zM12 6.3L14.8 8 12 10.9 9.2 8 12 6.4z"
	];
	return levelIcon[levelIndex];
}

function writePointProgress(isButton) {
	var levelPointNeed = [
			[0, 499],
			[500, 2499],
			[2500, 4999],
			[5000, 7499],
			[7500, 9999],
			[10000, 19999],
			[20000, 49999],
			[50000, 99999]
		],
		levelNames = ["Beginner", "High beginner", "Low intermediate", "Intermediate", "High intermediate", "Low advanced", "Anvanced", "Professional"];
	if (isButton == true)
		return getLevel(levelPointNeed, levelNames);
	if (point >= 100000) {
		document.getElementById("masterLevelCong")
			.innerHTML = '<center style="margin-top: -50px;"><svg style="width: 100px; height: 100px; border-radius: 50%; box-shadow: 0 0 16px 0 #ccc" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><g fill="none" fill-rule="evenodd" transform="translate(-3 -3)"><circle cx="12" cy="12" r="8" fill="#3a86ff"></circle><path fill="#fff" d="M10.9 10.9s.5.5 1.1.5c.6 0 1.1-.5 1.1-.5l3.4-3.4-3.4 6.8s-.6.8-1.1.8c-.6 0-1.1-.9-1.1-.9L7.5 7.5l3.4 3.4zm-3.4 0c1.4 1.5 4.5 6.6 4.5 7.8 0 3.2 0 0 0 0s-4.2-1.6-5.6-4.4c-.8-1.5-2.2-7 1.1-3.4zm4.5 7.8c0-1.1 4.6-7.9 4.6-7.9 3.4-3.4 2 2 1.2 3.3-1.5 2.8-5.8 4.7-5.8 4.7zm0-12.3l2.3 1.1L12 9.8 9.7 7.5 12 6.4z"></path></g></svg><br/>' + getLanguage("CongMasterLV") + "</center>";
		document.getElementById("pointBarDisplay")
			.style.display = "none";
		document.getElementById("pointIcon")
			.style.display = "none";
		document.getElementById("pointListDisplay")
			.style.display = "none";
		document.getElementById("pointHr")
			.style.display = "none";
		document.getElementById("masterLevelCong")
			.style.display = "block";
	} else {
		document.getElementById("pointIcon")
			.style.display = "block";
		document.getElementById("masterLevelCong")
			.style.display = "none";
		document.getElementById("pointHr")
			.style.display = "block";
		document.getElementById("pointBarDisplay")
			.style.display = "block";
		document.getElementById("pointListDisplay")
			.style.display = "block";
		document.getElementById("pointBarDisplay")
			.innerHTML = "<b>" + getLanguage(getLevel(levelPointNeed, levelNames)) + "</b> (" + point + " " + getLanguage("point") + ")<br/>" + (getLevel(levelPointNeed, levelNames, "nextPoint")[0] - point) + getLanguage("toUpLv");
		document.getElementById("pointIcon")
			.innerHTML = '<center><svg style="margin-top: 16px; width: 75px; height: 75px; border-radius: 50%; box-shadow: 0 0 16px 0 #ccc" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><g fill="none" fill-rule="evenodd" transform="translate(-3 -3)"><circle cx="12" cy="12" r="8" fill="#3a86ff"></circle><path fill="#fff" d="' + getLevelIcon(getLevel(levelPointNeed, levelNames, "index")) + '"></path></g></svg></center>';
		document.getElementById("pointListDisplay")
			.innerHTML = writePointList(levelPointNeed, levelNames);
	}
}

function addPoint(action) {
	var list = {
		"delete": 5,
		"edit": 20,
		"search": 15,
		"changeTag": 10,
		"changeColor": 10,
		"completeQuestion": 20,
		"completeDay": 25,
		"openKeyword": 5,
		"addQuestion": 15
	};

	var pointAdd = list.find(action);
	point = parseInt(point) + pointAdd;
	localStorage.setItem("point", point);
	writePointProgress();
}

function changeTag() {
	var newTag = prompt(getLanguage("EnterNTag") + ": ");
	for (var index = 0; index < questionSelected.length; index++)
		for (var question = 0; question < database.length; question++)
			if (database[question].id == questionSelected[index]) {
				database[question].tag = newTag;
				addPoint("changeTag");
			}
	writeList();
}

function changeColor(newColor) {
	for (var index = 0; index < questionSelected.length; index++)
		for (var question = 0; question < database.length; question++)
			if (database[question].id == questionSelected[index]) {
				database[question].color = newColor;
				addPoint("changeColor");
			}
	writeList();
}

function selectAll() {
	for (var question = 0; question < database.length; question++)
		selectQuestion(database[question].id, "white");
}

function selectQuestion(id, backgroundColor) {
	if (backgroundColor.toString(16) != "rgb(204, 204, 204)") {
		questionSelected.push(id);
		var childrenElement = [].slice.call(document.getElementById(id)
			.children)
		childrenElement.forEach(element => element.style.backgroundColor = "#ccc");
		childrenElement.forEach(element => element.style.borderColor = "grey");
	} else {
		delete questionSelected[questionSelected.indexOf(id)];
		questionSelected = questionSelected.filter(function(el) {
			return el != null;
		});
		var childrenElement = [].slice.call(document.getElementById(id)
			.children)
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
	document.getElementById("questions")
		.innerHTML += '<div id="' + data.id + '"><div id="tag" style="background:' + data.color + '" onclick="selectQuestion(' + "'" + data.id + "'" + ',this.style.backgroundColor)">' + data.tag + '</div><div id="question" style="background:' + data.color + '" onclick="selectQuestion(' + "'" + data.id + "'" + ',this.style.backgroundColor)">' + data.question + '</div><div id="edit" style="background: ' + data.color + '"onclick="showBoxEdit(' + "'" + data.id + "'" + ')">' + getLanguage("Edit") + '</div></div>';
}

function writeList() {
	document.getElementById("questions")
		.innerHTML = "";
	for (var question = 0; question < database.length; question++)
		writeQuestionCard(database[question]);
	if (database.length == 0)
		document.getElementById("questions")
		.innerHTML = "<br/><center><i>" + getLanguage("DontHaveQues") + "</i></center><br/>";

	var copyOfQuestionSelected = questionSelected;
	questionSelected = [];
	copyOfQuestionSelected.forEach(id => selectQuestion(id, "rgb(204, 204, 204)"));
	actionBox("hide");

	document.getElementById("stat")
		.innerHTML = '';

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
			document.getElementById("editBox")
				.style.display = "none";
			document.body.style.overflow = "auto";
			var newQuestion = document.getElementById("editQuestion")
				.value;
			var newContent = tinymce.get("editContent")
				.getBody()
				.innerHTML;
			var newDifficult = document.getElementById("editDifficult")
				.value;
			var newTag = document.getElementById("editTag")
				.value;
			database[question].question = newQuestion;
			database[question].content = newContent;
			database[question].difficult = newDifficult;
			database[question].tag = newTag;
			addPoint("edit");
		}
	}
	writeList();
}

function showBoxEdit(id) {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
	document.body.style.overflow = "hidden";
	document.getElementById("editCancel")
		.value = getLanguage("Cancel");
	document.getElementById("editBox")
		.style.display = "block";
	document.getElementById("editQuestion")
		.placeholder = getLanguage("NhapCH");
	document.getElementById("editTag")
		.placeholder = getLanguage("NhapTag");

	for (var question = 0; question < database.length; question++) {
		if (database[question].id == id) {
			document.getElementById("editForm")
				.onsubmit = function() {
					saveEditQuestion(id);
				};

			setEditorPlaceholder(tinymce.get("editContent")
				.getBody()
				.innerHTML);
			document.getElementById("editDifficult")
				.value = database[question].difficult;
			document.getElementById("editQuestion")
				.value = database[question].question;
			tinymce.get("editContent")
				.getBody()
				.innerHTML = database[question].content;
			document.getElementById("editTag")
				.value = database[question].tag;

			return 0;
		}
	}

	document.getElementById("editForm")
		.onsubmit = function() {
			writeQuestion(id);
			addQuestion();
		};
	setEditorPlaceholder("");

	return 0;
}

function writeQuestion(id) {
	var question = document.getElementById("editQuestion");
	var content = tinymce.get("editContent")
		.getBody();
	var difficult = document.getElementById("editDifficult");
	var tag = document.getElementById("editTag");

	database.unshift({
		id: id,
		question: question.value,
		content: content.innerHTML,
		date: getToday(),
		difficult: difficult.value,
		tag: tag.value,
		color: "#FFFFFF"
	});

	question.value = "";
	content.innerHTML = "";
	difficult.value = "";
	tag.value = "";

	writeList();
	addPoint("addQuestion");
}

function hideDiv(id) {
	document.getElementById(id)
		.style.display = 'none';
}

function setDifficult(id, nextIndex) {
	var newDifficult = document.getElementById("reviewDifficult")
		.value;
	for (var question = 0; question < database.length; question++) {
		if (database[question].id == id) {
			database[question].difficult = newDifficult,
				database[question].date = getToday()
		}
	}
	writeList();
	showReview(nextIndex);
	addPoint("completeQuestion");
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
	document.getElementById("reviewContent")
		.style.display = "none";
	if (index >= listOfReview.length) {
		alert(getLanguage("NothingToReview"));
		document.getElementById("reviewBox")
			.style.display = "none";
		document.body.style.overflow = "auto";
		addPoint("completeDay")
	} else {
		document.getElementById("reviewBox")
			.style.display = "block";
		document.body.style.overflow = "hidden";
		document.getElementById("reviewQuestion")
			.innerHTML = listOfReview[index].question;
		document.getElementById("reviewContent")
			.innerHTML = listOfReview[index].content;
		var hideAnswer = "showHide('reviewContent', document.getElementById('reviewButton'), '<b>" + getLanguage("ShowKeyword") + "</b>', '<b>" + getLanguage("ShowDapAn") + "</b>')";
		document.getElementById("reviewControl")
			.innerHTML = '<form action="javascript:;" onsubmit="' + hideAnswer + '; setDifficult(' + "'" + listOfReview[index].id + "'," + (index + 1) + ');"> <select id="reviewDifficult" required> <option value="" disabled selected>' + getLanguage("Difficult") + '</option> <option value="easy">' + getLanguage("Easy") + '</option> <option value="medium">' + getLanguage("Medium") + '</option> <option value="hard">' + getLanguage("Hard") + '</option> </select> <button name="submit" id="reviewSave">' + getLanguage("CompleteReview") + '</button> </form>';
	}
}

function showKeyword(keyword) {
	keyword.style = "color: black; background: white; text-align: justify";
	addPoint("openKeyword");
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
					addPoint("delete");
				}
	id = id.filter(function(el) {
		return el != null;
	});
	writeList();
}

function getQuestionNeedReview() {
	var needReview = [];
	for (var question = 0; question < database.length; question++) {
		var difference = time(database[question].date, getToday()),
			difficult = database[question].difficult;
		if (difficult == "easy" && difference > 6)
			needReview.push(question);
		else if (difficult == "medium" && difference > 3)
			needReview.push(question);
		else if (difficult == "hard" && difference > 0)
			needReview.push(question);
	}
	return needReview;
}

function downloadOutputFile() {
	var choice = document.getElementById("outputType")
		.value;
	if (choice == "txt") {
		var fileName = Math.random()
			.toString(36)
			.substring(2, 15) + Math.random()
			.toString(36)
			.substring(2, 15) + ".txt",
			databaseStringfy = JSON.stringify(minifyDatabase());
		saveAs(new Blob([databaseStringfy], {
			type: "text/plain;charset=utf-8"
		}), fileName);
	} else if (choice == "xlsx")
		openDownloadDialog(sheetToBlob(XLSX.utils.json_to_sheet(database)));
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
			f: data.difficult,
			i: data.id,
			q: data.question,
			t: data.tag,
		});
	}

	return databaseMinify;
}

function inputExcelProcess(data) {
	var workbook = XLSX.read(data, {
			type: 'binary'
		}),
		firstSheet = workbook.SheetNames[0],
		excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]),
		databaseFromSheet = [];
	excelRows.forEach(row => databaseFromSheet.push(row));
	database = databaseFromSheet;
	writeList();
}

function getFileExtensions() {
	var fullPath = document.getElementById('inputFileUpload')
		.value,
		filename;
	if (fullPath) {
		var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
		filename = fullPath.substring(startIndex);
		if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
			filename = filename.substring(1);
		}
	}
	return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
}

function inputDataProcessing(copyOfDatabase) {
	var dataProcessed = [];
	if (copyOfDatabase[0].id != undefined) {
		dataProcessed = copyOfDatabase;
		location.reload();
	} else {
		for (var index = 0; index < copyOfDatabase.length; index++) {
			copyOfDatabase[index].d = new Date(copyOfDatabase[index].d);

			var difficult = copyOfDatabase[index].f;
			if (difficult == "e")
				copyOfDatabase[index].f = "easy";
			else if (difficult == "m")
				copyOfDatabase[index].f = "medium";
			else
				copyOfDatabase[index].f = "hard";

			copyOfDatabase[index].o = "#" + copyOfDatabase[index].o;
		}
		for (index = 0; index < copyOfDatabase.length; index++) {
			var data = copyOfDatabase[index];

			dataProcessed.push({
				color: data.o,
				content: data.c,
				date: data.d,
				difficult: data.f,
				id: data.i,
				question: data.q,
				tag: data.t,
			});
		}
	}

	return dataProcessed;
}

function inputDataSave() {
	var FileExtensions = getFileExtensions()[0];
	if (FileExtensions == "txt")
		readTxtFile();
	else if (FileExtensions = "xls" || FileExtensions == "xlsx")
		inputExcelUpload();
	writeList();
}

function readTxtFile() {
	var input = $('#inputFileUpload')
		.get(0),
		reader = new FileReader();
	if (input.files.length) {
		var textFile = input.files[0];
		reader.readAsText(textFile);
		reader.onload = function() {
			database = inputDataProcessing(JSON.parse(reader.result));
			writeList();
		}
	}
}

function getLanguage(key) {
	if (language == "vi")
		return vietnamese[key];
	else
		return english[key];
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

function search(query, category) {
	var result = [],
		data;
	for (var index = 0; index < database.length; index++) {
		data = database[index][category].toUpperCase()
			.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
		query = query.toUpperCase()
			.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
		if (stringIncludes(query, data)) {
			result.push(database[index]);
			addPoint("search");
		}
	}
	return result;
}

function inputExcelUpload() {
	var fileUpload = document.getElementById("inputFileUpload"),
		regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
	if (regex.test(fileUpload.value.toLowerCase())) {
		if (typeof(FileReader) != "undefined") {
			var reader = new FileReader();
			if (reader.readAsBinaryString) {
				reader.onload = function(e) {
					inputExcelProcess(e.target.result);
				};
				reader.readAsBinaryString(fileUpload.files[0]);
			} else {
				reader.onload = function(e) {
					var data = "";
					var bytes = new Uint8Array(e.target.result);
					for (var i = 0; i < bytes.byteLength; i++)
						data += String.fromCharCode(bytes[i]);
					inputExcelProcess(data);
				};
				reader.readAsArrayBuffer(fileUpload.files[0]);
			}
		}
	}
}

function sheetToBlob(sheet, sheetName) {
	sheetName = sheetName || 'sheet1';
	var workbook = {
		SheetNames: [sheetName],
		Sheets: {}
	};
	workbook.Sheets[sheetName] = sheet;

	var wopts = {
		bookType: 'xlsx',
		bookSST: false,
		type: 'binary'
	};
	var wbout = XLSX.write(workbook, wopts);
	var blob = new Blob([s2ab(wbout)], {
		type: "application/octet-stream"
	});

	function s2ab(s) {
		var buf = new ArrayBuffer(s.length);
		var view = new Uint8Array(buf);
		for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	}
	return blob;
}

function openDownloadDialog(url, saveName) {
	if (typeof url == 'object' && url instanceof Blob) {
		url = URL.createObjectURL(url);
	}
	var aLink = document.createElement('a'),
		fileName = Math.random()
		.toString(36)
		.substring(2, 15) + Math.random()
		.toString(36)
		.substring(2, 15);
	aLink.href = url;
	aLink.download = saveName || fileName + ".xlsx";
	var event;
	if (window.MouseEvent) event = new MouseEvent('click');
	else {
		event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	}
	aLink.dispatchEvent(event);
}

function setEditorPlaceholder(content) {
	if (content != "")
		document.getElementById("editContent")
		.placeholder = "";
	else if (content == "")
		document.getElementById("editContent")
		.placeholder = getLanguage("NhapCTL");
}

document.addEventListener('DOMContentLoaded', function() {
	tinymce.init({
		selector: '#editContent',
		setup: function(editor) {
			editor.on('PreInit', function() {
				editor.schema.getSpecialElements()['iframe'] = new RegExp('</iframe[^>]*>', 'gi');
			});
		},
		language: language,
		height: 500,
		plugins: [
			'advlist autolink link image lists charmap print preview hr anchor pagebreak',
			'searchreplace wordcount visualblocks visualchars code fullscreen media nonbreaking',
			'table emoticons template paste toc autosave textpattern tabfocus save importcss legacyoutput',
			'imagetools directionality bbcode codesample'
		],
		toolbar: 'undo redo |  fontselect fontsizeselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent toc | link image forecolor backcolor emoticons',
		menubar: 'file edit view insert format tools table'
	});
	writeList();
	document.getElementById("chooseLanguage")
		.value = language;
	document.getElementById("searchInput")
		.placeholder = getLanguage("SearchInput");
	document.body.style.background = "url('" + new URLSearchParams(window.location.search)
		.get('bgImg') + "') no-repeat center center";
}, false);
