import {ServerConnection} from "../Connections/ServerConnection";
import {Logger} from "../Utils/Logger";
import {AudioPlayer} from "../AudioPlayback/AudioPlayer";
import {WakeWordDetector} from "../WakeWordDetection/WakeWordDetector";

const record = require('node-record-lpcm16');
// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
// Creates a client
const client = new speech.SpeechClient();

const encoding = 'LINEAR16'; //'Encoding of the audio file, e.g. LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US'; //'BCP-47 language code, e.g. en-US';
let lastUpdatedTime: any;

export class CloudSpeechRecognizer {

    public static stop(){
        Logger.info("stopping recording");
        record.stop();
    }

    public static async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static async start() {
        while(AudioPlayer.isPlaying()){
            await this.wait(250);
        }

        try{
            const request = {
                config: {
                    encoding: encoding,
                    sampleRateHertz: sampleRateHertz,
                    languageCode: languageCode,
                    single_utterance: true
                },
                interimResults: false, // If you want interim results, set this to true
            };

            const recognizeStream = this.createRecognizeStream(request);
            // Start recording and send the microphone input to the Speech API
            this.startRecording(recognizeStream);
            Logger.info("Started Cloud Speech Detection");
        }
        catch (err){
            Logger.error('Error while starting Cloud Speech Detector');
            throw err;
        }
    }

    //sends received text from google to server
    private static createRecognizeStream(request) {
        const recognizeStream = client
            .streamingRecognize(request)
            .on('error', function () {
                Logger.info('Restarting');
                CloudSpeechRecognizer.start();
            })
            .on('data', data => {
                    ServerConnection.sendMessage(data.results[0] && data.results[0].alternatives[0].transcript);
                    process.stdout.write(
                        data.results[0] && data.results[0].alternatives[0]
                            ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
                            : `\n\nReached transcription time limit\n`
                    );
                    record.stop();
                    CloudSpeechRecognizer.start();
                    lastUpdatedTime = new Date();
                    CloudSpeechRecognizer.wait(10000)
                        .then(()=>{
                            let now : any= new Date();
                            if(now - lastUpdatedTime >= 10000){
                                Logger.info('Stopping stream');
                                record.stop();
                                WakeWordDetector.start();
                            }
                        });
                }
            );
        return recognizeStream;
    }

    private static startRecording(recognizeStream) {
        record
            .start({
                sampleRateHertz: sampleRateHertz,
                threshold: 0,
                // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
                verbose: false,
                recordProgram: 'rec', // Try also "arecord" or "sox"
                silence: '10.0',
            })
            .on('error', console.error)
            .pipe(recognizeStream);
    }

}