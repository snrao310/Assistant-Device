import {ServerConnection} from "../Connections/ServerConnection";
import {Logger} from "../Utils/Logger";
import {AudioPlayer} from "../AudioPlayback/AudioPlayer";
import {WakeWordDetector} from "../WakeWordDetection/WakeWordDetector";

var inquirer = require('inquirer');
let lastUpdatedTime: any;


export class TextPrompterSpeech {

    public static stop(){
        Logger.info("Stopping MOCK Cloud Speech Detection");
    }

    private static async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static async start() {
        while(AudioPlayer.isPlaying()){
            await this.wait(250);
        }
        try{
            Logger.info("Started MOCK Cloud Speech Detection");
            this.startPrompt();
            await this.stopIfSilence();
        }
        catch (err){
            Logger.error('Error while getting prompt message');
            throw err;
        }
    }

    private static startPrompt(){
        inquirer.prompt([{
            type: 'input',
            name: 'userText',
            message: 'Usertext?',
            default: false
        }]).then(answers => {
            Logger.info('User Text: ' + answers.userText);
            ServerConnection.sendMessage(answers.userText);
            TextPrompterSpeech.start();
        });
    }

    private static async stopIfSilence(){
        lastUpdatedTime = new Date();
        await TextPrompterSpeech.wait(10000);
        let now : any= new Date();
        if(now - lastUpdatedTime >= 10000){
            Logger.info('Stopping MOCK stream');
            WakeWordDetector.start();
        }
    }

}