import {isNullOrUndefined} from "util";
import {Logger} from "../Utils/Logger";
import {AudioPlayer} from "../AudioPlayback/AudioPlayer";
import {CloudSpeechRecognizer} from "../SpeechRecognition/CloudSpeechRecognizer";
let serverUrl: string = require("../../appConfig.json").serverUrl;

export class ServerConnection{

    public static socket: any = ServerConnection.createSocket();

    private static createSocket() {
        try{
            const io = require('socket.io-client');
            let socket = io.connect(serverUrl);
            socket.on('serverAskingDisconnect', function (data) {
                Logger.info('Socket event \'serverAskingDisconnect\' triggered');
                let dataString = ServerConnection.getString(data);
                Logger.debug(dataString);
                socket.disconnect();
            });

            socket.on('serverMessage', function (data) {
                Logger.info("Socket event \'serverMessage\' triggered");
                if(data.hasOwnProperty('speechResponse')){
                    CloudSpeechRecognizer.stop();
                    AudioPlayer.playAudio(data.speechResponse,false);
                    CloudSpeechRecognizer.start();
                }
            });

            socket.on('connect', function () {});
            socket.on('disconnect', function () {});

            return socket;
        }
        catch (err){
            Logger.error('Error while initializing socket');
            throw err;
        }

    }

    public static sendMessage(data: any){
        if (!isNullOrUndefined(data)) {
            //any user specific data that will help identify user will go into the options.
            //none of that for now since only one user. For now, just sending Mr.Rao.
            const options = {
                method: "POST",
                url: serverUrl,
                body: {
                    message: data,
                    userName: 'Mr.Rao'
                },
                json: true
            };
            this.socket.emit('userMessage', options);
        }
    }

    private static getString(data: any){
        if(typeof data == "object"){
            return JSON.stringify(data);
        }
        return data;
    }
}