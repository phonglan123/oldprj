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
        return "Từ số " + subject + " đến số " + jammingPeople[0] + ", có người" + languageProcessPart2(infoName, infoValue);
    else if (type == "is")
        return "Số " + subject + languageProcessPart2(infoName, infoValue);
    else if (type == "or") {
        if (subject == jammingPeople[0])
            return "Số " + subject + languageProcessPart2(infoName, infoValue);
        return "Số " + subject + " hoặc số " + jammingPeople[0] + ", có người" + languageProcessPart2(infoName, infoValue);
    } else {
        if (jammingPeople.length == 1)
            return "Số " + subject + languageProcessPart2(infoName, infoValue);
        var result = "";
        for (var i = 0; i < jammingPeople.length; i++) {
            if (i == (jammingPeople.length - 1))
                result += "và số " + jammingPeople[i];
            else
                result += jammingPeople[i] + ", ";
        }
        return "Trong số " + result + ", có người" + languageProcessPart2(infoName, infoValue);
    }
}

function languageProcessPart2(infoName, infoValue) {
    switch (infoName) {
        case "couple":
            if (infoValue == "")
                return " vẫn chưa có gia đình (còn ế đó!)"
            else {
                var lucky = Math.floor(Math.random() * 2);
                switch (lucky) {
                    case 0:
                        return " có vợ/chồng là " + infoValue;
                    case 1:
                        return " đã lập gia đình!";
                }
            }
            break;
        case "birthday":
            if (infoValue.includes("d"))
                return " sinh ngày " + infoValue.replace("d", "");
            else if (infoValue.includes("m"))
                return " sinh tháng " + infoValue.replace("m", "");
            else if (infoValue.includes("y")) {
                var lucky = Math.floor(Math.random() * 2),
                    year = infoValue.replace("y", "");
                switch (lucky) {
                    case 0:
                        return " sinh năm " + year;
                    case 1:
                        if (parseInt(year) < 2000)
                            return " là người thuộc thế hệ " + year.charAt(2) + "x";
                }
            }
            break;
        case "address":
            if (infoValue == "")
                return "không có nhà để ở hoặc không có địa chỉ rõ ràng!";
            else
                return " ở " + infoValue;
            break;
        case "famousFor":
            if (infoValue == "")
                return " là người không quá nổi tiếng"
            else
                return " nổi tiếng vì " + infoValue;
            break;
        case "hobbies":
            if (infoValue == "")
                return " không có sở thích gì nổi bật!";
            else
                return " thích " + infoValue;
            break;
        case "jobs":
            if (infoValue == "")
                return " không có công việc cụ thể!";
            else
                return " đang là một " + infoValue;
            break;
        case "name":
            if (infoValue == "")
                return " không có họ/đệm/tên (Chắc vì đây là nghệ danh hoặc gì đó!)";
            else
                return " trong họ tên có chữ " + infoValue;
            break;
        case "nickname":
            if (infoValue == "")
                return " không có biệt danh";
            else
                return " còn được gọi là " + infoValue;
            break;
        case "school":
            if (infoValue == "")
                return " chưa đi học hoặc không còn đi học";
            else
                return " đang học tại " + infoValue;
            break;
        case "socialMedia":
            if (infoValue == "")
                return " không dùng mạng xã hội";
            else
                return " dùng " + infoValue;
            break;
        case "gender":
            if (infoValue == "")
                return " không có giới tính rõ ràng! Hoặc...";
            else
                return " là " + infoValue;
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
        var fullName = data["Họ"] + " " + data["Đệm"] + " " + data["Tên"],
            nickname = splitIfCan(data["Biệt danh"], ", "),
            school = splitIfCan(data["Trường học"], ", "),
            jobs = splitIfCan(data["Công việc"], ", "),
            hobbies = splitIfCan(data["Sở thích"], ", "),
            famousFor = splitIfCan(data["Nổi tiếng vì"], ", "),
            socialMedia = splitIfCan(data["Mạng xã hội"], ", ");
        information[fullName] = {
            "name": [data["Họ"], data["Đệm"], data["Tên"]],
            "gender": [data["Giới tính"]],
            "nickname": nickname,
            "birthday": ["d" + data["Ngày sinh"], "m" + data["Tháng sinh"], "y" + data["Năm sinh"]],
            "school": school,
            "address": [
                data["Thành phố"],
                data["Quốc gia"]
            ],
            "jobs": jobs,
            "hobbies": hobbies,
            "couple": [data["Vợ hoặc chồng"]],
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