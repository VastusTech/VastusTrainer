import { Storage } from "aws-amplify";
import { consoleLog, consoleError } from "../logic/DebuggingHelper";

class S3Storage {
    // User-Level Functions
    // static putImages(folderPath, images, successHandler, failureHandler) {
    //
    // }
    // Content-Level Functions
    static putImage(path, image, successHandler, failureHandler) {
        S3Storage.put(path, image, "image/*", successHandler, failureHandler);
    }
    static putVideo(path, video, successHandler, failureHandler) {
        S3Storage.put(path, video, "video/*", successHandler, failureHandler);
    }
    static putVideoOrImage(path, media, successHandler, failureHandler) {
        S3Storage.put(path, media, "video/*;image/*", successHandler, failureHandler);
    }
    // Low Level Functions
    static get(path, successHandler, failureHandler) {
        // returns URL
        Storage.get(path).then((url) => {
            consoleLog("Storage successfully retrieved file! URL = " + url);
            if (successHandler) { successHandler(url); }
        }).catch((error) => {
            consoleError("Storage failed to retrieve file with path = " + path + "... Error: " + JSON.stringify(error));
            if (failureHandler) { failureHandler(error); }
        });
    }
    static put(path, file, contentType, successHandler, failureHandler) {
        Storage.put(path, file, { contentType }).then((result) => {
            consoleLog("Storage successfully put file in! Result: " + JSON.stringify(result));
            if (successHandler) { successHandler(result); }
        }).catch((error) => {
            consoleError("Storage failed put function... Error: " + JSON.stringify(error));
            if (failureHandler) { failureHandler(error); }
        });
    }
    static delete(path, successHandler, failureHandler) {
        Storage.remove(path).then((result) => {
            consoleLog("Storage successfully removed file! Result: " + JSON.stringify(result));
            if (successHandler) { successHandler(result); }
        }).catch((error) => {
            consoleError("Storage failed remove function... Error: " + JSON.stringify(error));
            if (failureHandler) { failureHandler(error); }
        });
    }
}

export default S3Storage;
