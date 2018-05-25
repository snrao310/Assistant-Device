var serverUrl = "http://localhost:3000";
var socket;
var lastUpdatedTime;
window.onload = createSocket();

function createSocket() {
    socket = io(serverUrl);
    socket.on('connect', function () {});
    socket.on('disconnect', function () {});

    socket.on('serverAskingDisconnect', function (data) {
        console.log('Socket event \'serverAskingDisconnect\' triggered');
        console.log(dataString);
        socket.disconnect();
    });

    socket.on('serverMessage', function (data) {
        console.log("Socket event \'serverMessage\' triggered");
        if (data.hasOwnProperty('message')) {
            console.log(data.text);
            document.getElementById('AssistantResponse').innerText = "Response: " + data.text;
            startSpeechDetection();
        }
    });
}

function sendMessage(data) {
    if (data != null && data != undefined && data.length != 0) {
        const options = {
            method: "POST",
            url: serverUrl,
            body: {
                message: data
            },
            json: true
        };
        console.log('sending message to server');
        socket.emit('userMessage', options);
    }
}

function startSpeechDetection() {
    if (document.getElementById('wakeWordText').value.toLowerCase() == "jarvis") {
        document.getElementById('speechDiv').style.visibility = "visible";
        document.getElementById('wakeWordDiv').style.visibility = "hidden";
        stopIfSilence();
    }
}

function startWakeWordDetection() {
    document.getElementById('speechDiv').style.visibility = "hidden";
    document.getElementById('wakeWordDiv').style.visibility = "visible";
}

function sendTextToServer() {
    if (document.getElementById('speechText').value.length != 0) {
        sendMessage(document.getElementById('speechText').value);
        document.getElementById('speechText').value = '';
    }
}

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function stopIfSilence() {
    lastUpdatedTime = new Date();
    await wait(15000)
    let now = new Date();
    if (now - lastUpdatedTime >= 15000) {
        console.log("Stopping speech and starting wake word");
        startWakeWordDetection();
    }
}

function processWakeWordKeyPress(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) { //Enter keycode
        startSpeechDetection();
    }
}

function processSpeechKeyPress(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) { //Enter keycode
        sendTextToServer();
    }
}