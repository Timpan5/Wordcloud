function test() {
    $.ajax({
        url: 'https://www.reddit.com/user/'+ $("#username").val() +'/comments/.json?',
        method: 'GET'
    }).done(function(jsondata){
        var count = 0;
        var frequency = {};

        for (var i = 0; i < jsondata.data.children.length; i++) {
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
    if (count < 99) {
        $.ajax({
            url: 'https://www.reddit.com/user/' + $("#username").val() + '/comments/.json?',
            method: 'GET',
            data: {"after": after, "count": count}
        }).done(function (jsondata) {
            for (var i = 0; i < jsondata.data.children.length; i++) {
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
    var pattern = /^([a-z]+)['-]?([a-z]+)$/;
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
    var $section = $("#content");
    (Object.keys(frequency)).forEach(function(word){
        $section.append($("<p>").html(word + " " + frequency[word]));
    });
}