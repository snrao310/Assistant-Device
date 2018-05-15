import {isNullOrUndefined} from "util";
let serverUrl: string = require("../../appConfig.json").serverUrl;

export class ServerConnection{

    public static socket: any = ServerConnection.createSocket();

    private static createSocket() {
        const io = require('socket.io-client');
        let socket = io.connect(serverUrl);
        socket.on('pop', function (data) {
            console.log(data);
        });

        socket.on('received', function (data) {
            console.log("AWESOME");
            socket.disconnect();
        });
        return socket;
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