import {AudioPlayer} from "../AudioPlayback/AudioPlayer";
import {Logger} from "../Utils/Logger";

var alarm = require('alarm');

export class SetAlarm{

    public static execute(parameters: any){
        let date = new Date(parameters.time);
        Logger.info('Setting alarm for '+date);
        alarm(date, function() {
            console.log('Playing alarm at '+date);
            AudioPlayer.playAudio('./audioMessages/Anjaneyane.mp3',true);
        });
    }
}