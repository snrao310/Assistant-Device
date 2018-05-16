import {isNullOrUndefined} from "util";
import {Logger} from "../Utils/Logger";
let serverUrl: string = require("../../appConfig.json").serverUrl;

export class ServerConnection{

    public static socket: any = ServerConnection.createSocket();

    private static createSocket() {
        try{
            const io = require('socket.io-client');
            let socket = io.connect(serverUrl);
            socket.on('serverAskingDisconnect', function (data) {
                Logger.info('Socket event \'serverAskingDisconnect\' triggered');
                Logger.debug(data);
                socket.disconnect();
            });

            socket.on('serverMessage', function (data) {
                Logger.info("Socket event \'serverMessage\' triggered");
                Logger.debug(data);
            });
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
            //none of that for now since only one user.
            const options = {
                method: "POST",
                url: serverUrl,
                body: {
                    message: data,
                },
                json: true
            };
            this.socket.emit('userMessage', options);
        }
    }
}