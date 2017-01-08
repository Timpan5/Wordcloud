function test() {
    $.ajax({
        url: 'https://www.reddit.com/user/'+ $("#username").val() +'/comments/.json?',
        method: 'GET'
    }).done(function(jsondata){
        var count = 0;
        var $section = $("#comments");
        for (var i = 0; i < jsondata.data.children.length; i++) {
            var entry = jsondata.data.children[i].data;
            $section.append($("<p>").html(count + ": " + entry.score + " " + entry.body));
            count++;
        }
        getAllComments(jsondata.data.after, count);
    });
}

function getAllComments(after, count) {
        $.ajax({
            url: 'https://www.reddit.com/user/'+ $("#username").val() +'/comments/.json?',
            method: 'GET',
            data: {"after": after, "count": count}
        }).done(function (jsondata) {
            var $section = $("#comments");
            for (var i = 0; i < jsondata.data.children.length; i++) {
                var entry = jsondata.data.children[i].data;
                $section.append($("<p>").html(count + ": " + entry.score + " " + entry.body));
                count++;
            }
            if (count < 99) {
                getAllComments(jsondata.data.after, count);
            }
        });
}

