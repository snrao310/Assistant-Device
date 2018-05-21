import {TextPrompterWakeWord} from "../WakeWordDetection/TextPrompterWakeWord";
import {LocalWakeWordDetector} from "./LocalWakeWordDetector";

export class WakeWordDetector{
    private static voiceRecognition: string = require("../../appConfig.json").wakeWordRecognition;

    public static async start(){
        if(this.voiceRecognition){
            LocalWakeWordDetector.start();
        }
        else{
            TextPrompterWakeWord.start();
        }
    }

    public static stop(){
        if(this.voiceRecognition){
            LocalWakeWordDetector.stop();
        }
        else{
            TextPrompterWakeWord.stop();
        }
    }
}