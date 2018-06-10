import {Logger} from "../Utils/Logger";
import * as fs from "fs";

// const player = require('play-sound')({});

var AudioPlayer1 = require('sox-play');



const defaultFileName = 'output.mp3';

export class AudioPlayer{

    private static playing: boolean = false;

    public static isPlaying(){
        return this.playing;
    }

    public static playAudio(speech: string, isFileName: boolean){
        this.playing = true;
        let fileName = (isFileName)?speech:defaultFileName;
        if(!isFileName){
            // Write the binary audio content to a local file
            fs.writeFile(fileName, speech, 'binary', err => {
                if (err) {
                    Logger.error('Error while writing audio to file');
                    throw err;
                }
                Logger.info('Audio content written to file: output.mp3');
                this.playAudioFile(fileName);
            });
        }
        else{
            this.playAudioFile(fileName);
        }
    }

    private static playAudioFile(fileName: string){
        // player.play(fileName, function(err){
        //     AudioPlayer.playing = false;
        //     if (err){
        //         Logger.error('Error while playing audio');
        //         throw err;
        //     }
        // });





        var player = new AudioPlayer1({file:fileName}); // http://www.portal2sounds.com/2265

        player.on('start', function(filePath){
            console.log('started playing', filePath);
        });

        player.on('status', function(status){
            // console.log('status! ', status.position);
            /*
            status: {
              loaded: 0-1 (%)
              position: PlayerPosition instance (see below)
              remaining: PlayerPosition  instance
              dataPlayed: strings like '14k'
            }
            PlayerPosition : {
              hours
              minutes
              seconds
              frac
            }
            */
        });

        player.on('stop', function(filePath){
            console.log('Done playing', filePath);
            AudioPlayer.playing = false;
        });

        player.play();

        // setTimeout(function() {
        //
        //     // $stream.end();
        // }, 5000);
    }
}