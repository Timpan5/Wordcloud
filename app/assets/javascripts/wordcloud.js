function test1() {
    var word_array = [
        {text: "Lorem", weight: 15},
        {text: "Ipsum", weight: 9, link: "http://jquery.com/"},
        {text: "Dolor", weight: 6, html: {title: "I can haz any html attribute"}},
        {text: "Sit", weight: 7},
        {text: "Amet", weight: 5}
    ];

    $("#content").append( $("<div>").css({"width": "100vw", "height": "100vh"}).jQCloud(word_array));

}

function displayWordcloud(frequency) {

}