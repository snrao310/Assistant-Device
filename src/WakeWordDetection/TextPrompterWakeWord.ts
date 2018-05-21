import {Logger} from "../Utils/Logger";
import {AudioPlayer} from "../AudioPlayback/AudioPlayer";
import {SpeechRecognizer} from "../SpeechRecognition/SpeechRecognizer";
import {WakeWordDetector} from "./WakeWordDetector";

var inquirer = require('inquirer');
const CUE_MESSAGE_PATH : string = 'audioMessages/atYourService.mp3';

export class TextPrompterWakeWord {

    public static stop(){
        Logger.info("Stopping MOCK Wake word detection");
    }

    public static start(){
        Logger.info('Started MOCK Wake word detection');
        inquirer.prompt([{
            type: 'input',
            name: 'wakeword',
            message: 'Wakeword?'
        }]).then(answers => {
            console.log('Wake Word: ' + answers.wakeword);
            if(answers.wakeword.toLowerCase() === "jarvis"){
                try{
                    AudioPlayer.playAudio(CUE_MESSAGE_PATH,true);
                    SpeechRecognizer.start();
                }
                catch(err){
                    throw err;
                }
            }
            else
                TextPrompterWakeWord.start();
        });
    }

}