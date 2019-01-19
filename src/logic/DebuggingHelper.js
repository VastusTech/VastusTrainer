import { ifLogging } from "../Constants";

export function consoleLog(message) {
    if (ifLogging) {
        console.log(message);
    }
}
export function consoleError(message) {
    if (ifLogging) {
        console.error(message);
    }
}
