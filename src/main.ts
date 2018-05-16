import {WakeWordService} from "./WakeWordDetection/WakeWordService";
import {ServerConnection} from "./Connections/ServerConnection";
import {Logger} from "./Utils/Logger";

Logger.info('Device Started');

try{
    WakeWordService.start();
}
catch (err){
    Logger.error(err);
}