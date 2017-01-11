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

function createProgressBar($container, max) {
    $("<progress>").attr({"max": max, "id": "progressBar"}).val(0).appendTo($container);
}

function progressBarIncrement() {
    $("#progressBar").get(0).value++;
}