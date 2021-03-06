Object.prototype.randomProperty = function() {
    var keys = Object.keys(this),
        randomKey = keys[keys.length * Math.random() << 0];
    return [randomKey, this[randomKey]];
}

Array.prototype.isOutOfArray = function(start, plus) {
    var length = this.length,
        indexWant = start + plus;
    if (indexWant >= length)
        return length;
    return indexWant;
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function peopleSame() {
    var randomPeople = information.randomProperty(),
        randomInfo = randomPeople[1].randomProperty(),
        randomNumber = Math.floor(Math.random() * 4) + 1;
    if (randomNumber == 1) {
        var startNumber = Object.keys(information).indexOf(randomPeople[0]);
        endNumber = Object.keys(information).isOutOfArray(startNumber, randomNumber);
        return [
            randomPeople[0],
            [Object.keys(information)[endNumber - 1]],
            "fromTo",
            randomInfo[0],
            randomInfo[1][Math.floor(Math.random() * randomInfo[1].length)]
        ];
    } else if (randomNumber == 2) {
        var randomInfoValue = randomInfo[1][Math.floor(Math.random() * randomInfo[1].length)],
            jammingPeople = peopleSameProperty(randomPeople[0], randomInfo[0], randomInfoValue);
        return [
            randomPeople[0],
            jammingPeople,
            "and",
            randomInfo[0],
            randomInfoValue
        ];
    } else if (randomNumber == 3) {
        var currentName = Object.keys(information);
        currentName.splice(currentName.indexOf(randomPeople[0]), 1);
        return [
            randomPeople[0],
            [shuffle(currentName)[0]],
            "or",
            randomInfo[0],
            randomInfo[1][Math.floor(Math.random() * randomInfo[1].length)]
        ];
    } else {
        return [
            randomPeople[0],
            [""],
            "is",
            randomInfo[0],
            randomInfo[1][Math.floor(Math.random() * randomInfo[1].length)]
        ];
    }
}

function peopleSameProperty(peopleName, infoName, infoValue) {
    var currentName = Object.keys(information),
        result = [];
    currentName.splice(currentName.indexOf(peopleName), 1);
    currentName.forEach(name => {
        if (information[name][infoName].includes(infoValue))
            result.push(name);
    });
    if (result == [])
        result.push("");
    return result;
}

function languageProcess(info) {
    var suggestions = "",
        subject = info[0],
        jammingPeople = info[1],
        type = info[2],
        infoName = info[3],
        infoValue = info[4];

    if (type != "fromTo" && type != "is") {
        jammingPeople.push(subject);
        jammingPeople = shuffle(jammingPeople);
    }
    jammingPeople = jammingPeople.filter(function(el) {
        return el;
    });

    if (type == "fromTo")
        return "T??? s??? " + subject + " ?????n s??? " + jammingPeople[0] + ", c?? ng?????i" + languageProcessPart2(infoName, infoValue);
    else if (type == "is")
        return "S??? " + subject + languageProcessPart2(infoName, infoValue);
    else if (type == "or") {
        if (subject == jammingPeople[0])
            return "S??? " + subject + languageProcessPart2(infoName, infoValue);
        return "S??? " + subject + " ho???c s??? " + jammingPeople[0] + ", c?? ng?????i" + languageProcessPart2(infoName, infoValue);
    } else {
        if (jammingPeople.length == 1)
            return "S??? " + subject + languageProcessPart2(infoName, infoValue);
        var result = "";
        for (var i = 0; i < jammingPeople.length; i++) {
            if (i == (jammingPeople.length - 1))
                result += "v?? s??? " + jammingPeople[i];
            else
                result += jammingPeople[i] + ", ";
        }
        return "Trong s??? " + result + ", c?? ng?????i" + languageProcessPart2(infoName, infoValue);
    }
}

function languageProcessPart2(infoName, infoValue) {
    switch (infoName) {
        case "couple":
            if (infoValue == "")
                return " v???n ch??a c?? gia ????nh (c??n ??? ????!)"
            else {
                var lucky = Math.floor(Math.random() * 2);
                switch (lucky) {
                    case 0:
                        return " c?? v???/ch???ng l?? " + infoValue;
                    case 1:
                        return " ???? l???p gia ????nh!";
                }
            }
            break;
        case "birthday":
            if (infoValue.includes("d"))
                return " sinh ng??y " + infoValue.replace("d", "");
            else if (infoValue.includes("m"))
                return " sinh th??ng " + infoValue.replace("m", "");
            else if (infoValue.includes("y")) {
                var lucky = Math.floor(Math.random() * 2),
                    year = infoValue.replace("y", "");
                switch (lucky) {
                    case 0:
                        return " sinh n??m " + year;
                    case 1:
                        if (parseInt(year) < 2000)
                            return " l?? ng?????i thu???c th??? h??? " + year.charAt(2) + "x";
                }
            }
            break;
        case "address":
            if (infoValue == "")
                return "kh??ng c?? nh?? ????? ??? ho???c kh??ng c?? ?????a ch??? r?? r??ng!";
            else
                return " ??? " + infoValue;
            break;
        case "famousFor":
            if (infoValue == "")
                return " l?? ng?????i kh??ng qu?? n???i ti???ng"
            else
                return " n???i ti???ng v?? " + infoValue;
            break;
        case "hobbies":
            if (infoValue == "")
                return " kh??ng c?? s??? th??ch g?? n???i b???t!";
            else
                return " th??ch " + infoValue;
            break;
        case "jobs":
            if (infoValue == "")
                return " kh??ng c?? c??ng vi???c c??? th???!";
            else
                return " ??ang l?? m???t " + infoValue;
            break;
        case "name":
            if (infoValue == "")
                return " kh??ng c?? h???/?????m/t??n (Ch???c v?? ????y l?? ngh??? danh ho???c g?? ????!)";
            else
                return " trong h??? t??n c?? ch??? " + infoValue;
            break;
        case "nickname":
            if (infoValue == "")
                return " kh??ng c?? bi???t danh";
            else
                return " c??n ???????c g???i l?? " + infoValue;
            break;
        case "school":
            if (infoValue == "")
                return " ch??a ??i h???c ho???c kh??ng c??n ??i h???c";
            else
                return " ??ang h???c t???i " + infoValue;
            break;
        case "socialMedia":
            if (infoValue == "")
                return " kh??ng d??ng m???ng x?? h???i";
            else
                return " d??ng " + infoValue;
            break;
        case "gender":
            if (infoValue == "")
                return " kh??ng c?? gi???i t??nh r?? r??ng! Ho???c...";
            else
                return " l?? " + infoValue;
            break;
    }
}

function setNumber(array, listOfNumber) {
    var result = [];
    array.forEach(name => result.push(listOfNumber.indexOf(name) + 1));
    return result;
}

function splitIfCan(original, stringSplit) {
    if (original.includes(stringSplit))
        return original.split(stringSplit);
    return [original];
}

function tableProcess(json) {
    json.forEach(data => {
        var fullName = data["H???"] + " " + data["?????m"] + " " + data["T??n"],
            nickname = splitIfCan(data["Bi???t danh"], ", "),
            school = splitIfCan(data["Tr?????ng h???c"], ", "),
            jobs = splitIfCan(data["C??ng vi???c"], ", "),
            hobbies = splitIfCan(data["S??? th??ch"], ", "),
            famousFor = splitIfCan(data["N???i ti???ng v??"], ", "),
            socialMedia = splitIfCan(data["M???ng x?? h???i"], ", ");
        information[fullName] = {
            "name": [data["H???"], data["?????m"], data["T??n"]],
            "gender": [data["Gi???i t??nh"]],
            "nickname": nickname,
            "birthday": ["d" + data["Ng??y sinh"], "m" + data["Th??ng sinh"], "y" + data["N??m sinh"]],
            "school": school,
            "address": [
                data["Th??nh ph???"],
                data["Qu???c gia"]
            ],
            "jobs": jobs,
            "hobbies": hobbies,
            "couple": [data["V??? ho???c ch???ng"]],
            "socialMedia": socialMedia,
            "famousFor": famousFor
        };
    });
}

function getSuggestions() {
    var numberOfMember = Object.keys(information),
        amountOfMember = Object.keys(information).length,
        numberOfSuggestions = amountOfMember * 5,
        suggestions = [],
        memberWithNumber = [];

    numberOfMember = shuffle(numberOfMember);
    numberOfMember.forEach((value, index) => memberWithNumber.push([value, index]));
    for (var i = 0; i < numberOfSuggestions; i++) {
        var peopleSameList = peopleSame();
        suggestions.push(languageProcess([
            setNumber([peopleSameList[0]], numberOfMember)[0],
            setNumber(peopleSameList[1], numberOfMember),
            peopleSameList[2],
            peopleSameList[3],
            peopleSameList[4],
        ]));
    }

    return {
        list: shuffle(memberWithNumber),
        suggestions: suggestions
    };
}

var information = {};