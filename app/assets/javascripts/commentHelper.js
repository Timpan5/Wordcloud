function getFromDatabase(weighted){
    checkInputs();
    $("#content").empty();
    var data = {"username" : $("#username").val(), "count" : Math.min(parseInt($("#count").val(), 10), 999)};
    $.ajax({
        url: 'retrieve',
        method: 'POST',
        data: data
    }).done(function(jsondata) {
        weighted? displayCommentResults(jsondata.weighted) : displayWordcloud(jsondata.unweighted);
    }).fail(function(){
        getCommentsBegin(weighted);
    });
}

function getCommentsBegin(weighted) {
    $.ajax({
        url: 'https://www.reddit.com/user/'+ $("#username").val() +'/comments/.json?',
        method: 'GET'
    }).done(function(jsondata){
        createProgressBar($("#content"), $("#count").val());
        var count = 0;
        var frequency = {'weighted' : {}, 'unweighted' : {}};
        var number = Math.min(parseInt($("#count").val(), 10), 999);
        processComments(jsondata, count, number, frequency, weighted);
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
            processComments(jsondata, count, number, frequency, weighted);
        });
    }
    else {
        saveData(frequency);
        weighted? displayCommentResults(frequency.weighted) : displayWordcloud(frequency.unweighted);
    }
}

function processComments(jsondata, count, number, frequency, weighted){
    for (var i = 0; i < jsondata.data.children.length && count < number; i++) {
        var entry = jsondata.data.children[i].data;
        frequency = appendFrequencyMap(frequency, entry);
        count++;
        progressBarIncrement();
    }
    getAllComments(jsondata.data.after, count, frequency, weighted);
}

function appendFrequencyMap(frequency, entry) {
    var pattern = /^(([a-z]+)\W?([a-z]+))|[a-z]$/;
    var words = entry.body;
    var wordsArray = words.split(/\s+/);
    wordsArray.forEach(function(word){
        word = word.toLowerCase();
        word = pattern.exec(word);
        if(word) {
            word = word[0];
            if (frequency.weighted.hasOwnProperty(word)) {
                frequency.weighted[word] += entry.score;
                frequency.unweighted[word] += 1;
            }
            else {
                frequency.weighted[word] = entry.score;
                frequency.unweighted[word] = 1;
            }
        }
    });
    return frequency;
}

function saveData(frequency) {
    var data = {"username" : $("#username").val(), "weighted" : frequency.weighted, "unweighted" : frequency.unweighted};
    $.ajax({
        url: 'append',
        method: 'POST',
        data: data
    });
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