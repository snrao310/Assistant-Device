import {Logger} from "../Utils/Logger";
import * as fs from "fs";
import {CloudSpeechRecognizer} from "../SpeechRecognition/CloudSpeechRecognizer";

const player = require('play-sound')({});
const fileName = 'output.mp3';

export class AudioPlayer{

    public static playAudio(speech: string, isFileName: boolean){
        if(!isFileName){
            // Write the binary audio content to a local file
            fs.writeFile(fileName, speech, 'binary', err => {
                if (err) {
                    Logger.error('Error while writing audio to file');
                    throw err;
                }
                Logger.info('Audio content written to file: output.mp3');
            });
        }
        CloudSpeechRecognizer.stop();
        player.play(fileName, function(err){
            CloudSpeechRecognizer.start();
            if (err){
                Logger.error('Error while playing audio');
                throw err;
            }
        });
    }
}