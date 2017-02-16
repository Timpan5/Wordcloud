function getWordcloud() {
    var weighted = false;
    getFromDatabase(weighted);
    //getCommentsBegin(weighted);
}

function displayWordcloud(frequency) {
    var sorted = [];
    for (var word in frequency) {
        sorted.push([word, frequency[word]]);
    }

    sorted.sort(function(a, b) {
        return b[1] - a[1];
    });

    var wordArray = [];
    var number = Math.max(parseInt($("#top").val(), 10), 1);
    for (var i = 0; i < sorted.length && i < number; i++) {
        wordArray.push({"text" : sorted[i][0], "weight" : sorted[i][1]});
    }

    $("#content").append( $("<div>").css({"width": "100vw", "height": "50vh"}).jQCloud(wordArray));
}