function getCommentsBegin(weighted) {
    $("#content").empty();
    $.ajax({
        url: 'https://www.reddit.com/user/'+ $("#username").val() +'/comments/.json?',
        method: 'GET'
    }).done(function(jsondata){
        saveData(jsondata);
        createProgressBar($("#content"), $("#count").val());
        var count = 0;
        var frequency = {};
        for (var i = 0; i < jsondata.data.children.length && count < $("#count").val(); i++) {
            var entry = jsondata.data.children[i].data;
            frequency = appendFrequencyMap(frequency, entry, weighted);
            count++;
            progressBarIncrement();
        }
        getAllComments(jsondata.data.after, count, frequency, weighted);
    }).fail(function() {
        alert("FAIL");
    });
}

function getAllComments(after, count, frequency, weighted) {
    var number = Math.min(parseInt($("#count").val(), 10), 999);
    if (count < number) {
        $.ajax({
            url: 'https://www.reddit.com/user/' + $("#username").val() + '/comments/.json?',
            method: 'GET',
            data: {"after": after, "count": count}
        }).done(function (jsondata) {
            saveData(jsondata);
            for (var i = 0; i < jsondata.data.children.length && count < number; i++) {
                var entry = jsondata.data.children[i].data;
                frequency = appendFrequencyMap(frequency, entry, weighted);
                count++;
                progressBarIncrement();
            }
            getAllComments(jsondata.data.after, count, frequency, weighted);
        });
    }
    else if (weighted) {
        displayCommentResults(frequency);
    }
    else {
        displayWordcloud(frequency);
    }
}

function appendFrequencyMap(frequency, entry, weighted) {
    var pattern = /^(([a-z]+)\W?([a-z]+))|[a-z]$/;
    var words = entry.body;
    var wordsArray = words.split(/\s+/);
    wordsArray.forEach(function(word){
        word = word.toLowerCase();
        word = pattern.exec(word);
        if(word) {
            word = word[0];
            if (frequency.hasOwnProperty(word)) {
                weighted? frequency[word] += entry.score : frequency[word] += 1;
            }
            else {
                weighted? frequency[word] = entry.score : frequency[word] = 1;
            }
        }
    });
    return frequency;
}

function createProgressBar($container, max) {
    $("<progress>").attr({"max": max, "id": "progressBar"}).val(0).appendTo($container);
}

function progressBarIncrement() {
    $("#progressBar").get(0).value++;
}

function checkInputs() {
    if (!$("#username").val()) {
        alert("Username");
    }

    if (!$("#count").val()) {
        alert("Count");
    }

    if (!$("#top").val()) {
        alert("Top");
    }
}

function getFromDatabase(weighted){
    checkInputs();
    var data = {"username" : $("#username").val(), "count" : Math.min(parseInt($("#count").val(), 10), 999)};
    $.ajax({
        url: 'retrieve',
        method: 'POST',
        data: data
    }).done(function(jsondata) {
        alert(JSON.stringify(jsondata));
    }).fail(function(){
        getCommentsBegin(weighted);
    });


}

function saveData(jsondata) {
    var data = {"username" : $("#username").val(), "comments" : jsondata};
    $.ajax({
        url: 'append',
        method: 'POST',
        data: data
    });
}