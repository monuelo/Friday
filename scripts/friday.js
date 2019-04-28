
const accessToken = "122d51b785d542d385d904ab195abcc1";
const baseUrl = "https://api.api.ai/v1/";

$(document).ready(function () {
    $("#input").keypress(function (event) {
        if (event.which == 13) {
            event.preventDefault();
            send();
        }
    });
    $("#rec").click(function (event) {
        switchRecognition();
    });
});

var recognition;

function startRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.onstart = function (event) {
        updateRec();
    };
    recognition.onresult = function (event) {
        var text = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
        }
        setInput(text);
        stopRecognition();
    };
    recognition.onend = function () {
        stopRecognition();
    };
    recognition.lang = "en-US";
    recognition.start();
}

function stopRecognition() {
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
    updateRec();
}

function switchRecognition() {
    if (recognition) {
        stopRecognition();
    } else {
        startRecognition();
    }
}

function setInput(text) {
    $("#input").val(text);
    send();
}

function updateRec() {
    $("#rec").children().text(recognition ? "stop" : "mic");
}

function send() {
    var text = $("#input").val();
    $.ajax({
        type: "POST",
        url: baseUrl + "query?v=20150910",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),

        success: function (data) {
            setResponse(data.result.fulfillment.messages[0].speech);
        },
        error: function () {
            setResponse("Internal Server Error");
        }
    });
    setResponse("Loading...");
}

function setResponse(val) {
    $("#response").text(val);
}