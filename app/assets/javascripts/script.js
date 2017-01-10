function getComments() {
    $("#content").empty();
    $.ajax({
        url: 'https://www.reddit.com/user/'+ $("#username").val() +'/comments/.json?',
        method: 'GET'
    }).done(function(jsondata){
        var count = 0;
        var frequency = {};

        for (var i = 0; i < jsondata.data.children.length && count < $("#count").val(); i++) {
            var entry = jsondata.data.children[i].data;
            frequency = appendFrequencyMap(frequency, entry);
            count++;
        }

        getAllComments(jsondata.data.after, count, frequency);

    }).fail(function() {
        alert("FAIL");
    });
}

function getAllComments(after, count, frequency) {
    var number = Math.min(parseInt($("#count").val(), 10), 999);
    if (count < number) {
        $.ajax({
            url: 'https://www.reddit.com/user/' + $("#username").val() + '/comments/.json?',
            method: 'GET',
            data: {"after": after, "count": count}
        }).done(function (jsondata) {
            for (var i = 0; i < jsondata.data.children.length && count < number; i++) {
                var entry = jsondata.data.children[i].data;
                frequency = appendFrequencyMap(frequency, entry);
                count++;
            }

            getAllComments(jsondata.data.after, count, frequency);
        });
    }
    else {
        displayCommentResults(frequency);
    }
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
            if (frequency.hasOwnProperty(word)) {
                frequency[word] += entry.score;
            }
            else {
                frequency[word] = entry.score;
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
    testChart(wordLabels, scoreData);
}

function testChart(wordLabels, scoreData) {
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