import {WakeWordDetector} from "./WakeWordDetection/WakeWordDetector";
import {ServerConnection} from "./Connections/ServerConnection";
import {Logger} from "./Utils/Logger";

Logger.info('Device Started');

try{
    WakeWordDetector.start();
}
catch (err){
    Logger.error(err);
}