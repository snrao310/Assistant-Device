import {CloudSpeechRecognizer} from "../SpeechRecognition/CloudSpeechRecognizer";
import {TextPrompterSpeech} from "./TextPrompterSpeech";

export class SpeechRecognizer{
    private static voiceRecognition: string = require("../../appConfig.json").speechRecognition;

    public static async start(){
        if(this.voiceRecognition){
            CloudSpeechRecognizer.start();
        }
        else{
            TextPrompterSpeech.start();
        }
    }

    public static stop(){
        if(this.voiceRecognition){
            CloudSpeechRecognizer.stop();
        }
        else{
            TextPrompterSpeech.stop();
        }
    }
}