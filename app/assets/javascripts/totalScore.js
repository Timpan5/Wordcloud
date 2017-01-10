function getTotalScore(){
    var weighted = true;
    getCommentsBegin(weighted);
}

function getCommentsBegin(weighted) {
    $("#content").empty();
    $.ajax({
        url: 'https://www.reddit.com/user/'+ $("#username").val() +'/comments/.json?',
        method: 'GET'
    }).done(function(jsondata){
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

function displayCommentResults(frequency) {
    var sorted = [];

    for (var word in frequency) {
        sorted.push([word, frequency[word]]);
    }

    sorted.sort(function(a, b) {
        return b[1] - a[1];
    });

    var wordLabels = [];
    var scoreData = [];

    var number = Math.max(parseInt($("#top").val(), 10), 1);
    for (var i = 0; i < sorted.length && i < number; i++) {
        wordLabels.push(sorted[i][0]);
        scoreData.push(sorted[i][1]);
    }
    createChart(wordLabels, scoreData);
}

function createChart(wordLabels, scoreData) {
    //$("#content").empty();
    var $canvas = $("<canvas>").appendTo($("#content"));
    $canvas.css("width", (wordLabels.length * 3).toString() + "em");
    new Chart($canvas, {
        type: 'horizontalBar',
        data: {
            labels: wordLabels,
            datasets: [{
                label: 'Total Comment Score',
                data: scoreData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}

function createProgressBar($container, max) {
    $("<progress>").attr({"max": max, "id": "progressBar"}).val(0).appendTo($container);
}

function progressBarIncrement() {
    $("#progressBar").get(0).value++;
}
