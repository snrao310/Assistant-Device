import {Logger} from "../Utils/Logger";

const player = require('play-sound')({})

export class AudioPlayer{

    public static playAudio(fileName: string){
        player.play(fileName, function(err){
            if (err){
                Logger.error('Error while playing audio')
                throw err;
            }
        });
    }
}