const record = require('node-record-lpcm16');
// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
// Creates a client
const client = new speech.SpeechClient();

const encoding = 'LINEAR16'; //'Encoding of the audio file, e.g. LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US'; //'BCP-47 language code, e.g. en-US';

export class CloudSpeechDetector {

    public static start(){
        const request = {
            config: {
                encoding: encoding,
                sampleRateHertz: sampleRateHertz,
                languageCode: languageCode,
            },
            interimResults: false, // If you want interim results, set this to true
        };

        let socket: any = this.createSocket();

        const recognizeStream = this.createRecognizeStream(request);


        // Start recording and send the microphone input to the Speech API
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

        console.log('Listening, press Ctrl+C to stop.');
    }


    private static createSocket(){
        const io = require('socket.io-client');
        var socket = io.connect('http://localhost:3000');
        socket.on('pop', function (data) {
            console.log(data);
        });

        socket.on('received', function (data) {
            console.log("AWESOME");
            socket.disconnect();
        });
        return socket;
    }

    private static createRecognizeStream(request){
        const recognizeStream = client
            .streamingRecognize(request)
            .on('error', console.error)
            .on('data', data => {
                    if(data.results[0] && data.results[0].alternatives[0]){
                        var request = require('request');
                        const options = {
                            method: "POST",
                            url: "http://localhost:3000",
                            // headers: {
                            //     "content-type": "application/json"
                            // },
                            body: {
                                speech: data.results[0].alternatives[0].transcript,
                                key: 'Hanuman',
                            },
                            json:true
                        };
                        // request(options, (error, response, body) => {
                        //
                        //     if (error) {
                        //         throw new Error(error);
                        //     }
                        //
                        //     console.log(response.body);
                        // });
                        // socket.connect('http://localhost:3000');
                        socket.emit('sendingData',options);
                    }
                    process.stdout.write(
                        data.results[0] && data.results[0].alternatives[0]
                            ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
                            : `\n\nReached transcription time limit, press Ctrl+C\n`
                    )
                }
            );
        return recognizeStream;
    }

}