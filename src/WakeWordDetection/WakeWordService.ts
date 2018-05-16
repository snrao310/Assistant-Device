import {CloudSpeechDetector} from "../SpeechRecognition/CloudSpeechDetector";
import {Logger} from "../Utils/Logger";

const record = require('node-record-lpcm16');
const Detector = require('snowboy').Detector;
const Models = require('snowboy').Models;

const models  = new Models();

const HOTWORD : any = ['Jarvis','Jarvis']; //string for other hotwords
const SENSITIVITY : string = "0.8,0.80";
const MODELPATH : string = 'snowboyResources/models/jarvis.umdl';


export class WakeWordService {

    public static start(){
        try{
            models.add(
                {
                    file: MODELPATH,
                    sensitivity: SENSITIVITY,
                    hotwords : HOTWORD
                });

            const detector = new Detector({
                resource: "snowboyResources/common.res",
                models: models,
                audioGain: 4.0,
                applyFrontend: true
            });

            this.initializeEvents(detector);

            const mic = record.start({
                threshold: 0,
                verbose: false
            });

            mic.pipe(detector);
        }
        catch(err){
            Logger.error('Error while starting Wake Word Service');
            throw err;
        }
    }

    private static initializeEvents(detector){
        detector.on('silence', function () {
            // Logger.info('silence');
        });

        detector.on('sound', function (buffer) {
            // <buffer> contains the last chunk of the audio that triggers the "sound"
            // event. It could be written to a wav stream.
            // Logger.info('sound');
        });

        detector.on('error', function () {
            Logger.error('error in detector');
        });

        detector.on('hotword', function (index, hotword, buffer) {
            // <buffer> contains the last chunk of the audio that triggers the "hotword"
            // event. It could be written to a wav stream. You will have to use it
            // together with the <buffer> in the "sound" event if you want to get audio
            // data after the hotword.
            // Logger.info(buffer);
            Logger.info('Hotword detected '+ index + ', hotword');
            record.stop();
            try{
                CloudSpeechDetector.start();
            }
            catch(err){
                throw err;
            }
        });
    }
}