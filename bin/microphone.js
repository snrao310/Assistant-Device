const record = require('node-record-lpcm16');
const Detector = require('snowboy').Detector;
const Models = require('snowboy').Models;

const models = new Models();

models.add(
    {
        file: 'snowboyResources/models/jarvis.umdl',
        sensitivity: "0.8,0.80",
        hotwords : ['Jarvis','Jarvis']
    });


const detector = new Detector({
    resource: "snowboyResources/common.res",
    models: models,
    audioGain: 2.0,
    applyFrontend: false
});

detector.on('silence', function () {
    console.log('silence');
});

detector.on('sound', function (buffer) {
    // <buffer> contains the last chunk of the audio that triggers the "sound"
    // event. It could be written to a wav stream.
    console.log('sound');
});

detector.on('error', function () {
    console.log('error');
});

detector.on('hotword', function (index, hotword, buffer) {
    // <buffer> contains the last chunk of the audio that triggers the "hotword"
    // event. It could be written to a wav stream. You will have to use it
    // together with the <buffer> in the "sound" event if you want to get audio
    // data after the hotword.
    console.log(buffer);
    console.log('hotword', index, hotword);
});

const mic = record.start({
    threshold: 0,
    verbose: false
});

mic.pipe(detector);
