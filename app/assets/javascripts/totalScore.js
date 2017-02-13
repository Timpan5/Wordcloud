function getTotalScore(){
    var weighted = true;
    getFromDatabase(weighted);
    //getCommentsBegin(weighted);
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



