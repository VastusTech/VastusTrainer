import Lambda from "../Lambda";
import S3 from "../S3Storage";

const itemType = "Message";

class MessageFunctions {
    // TODO THESE ARE THE HIGH-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    // Create Functions ============================================================
    static createTextMessage(fromID, from, name, board, message, successHandler, failureHandler) {
        this.create(fromID, board, from, name, null, message, null, successHandler, failureHandler);
    }
    static createPictureMessage(fromID, from, name, board, picture, picturePath, successHandler, failureHandler) {
        this.create(fromID, board, from, name, "picture", picturePath, picture, successHandler, failureHandler);
    }
    static createVideoMessage(fromID, from, name, board, video, videoPath, successHandler, failureHandler) {
        this.create(fromID, board, from, name, "video", videoPath, video, successHandler, failureHandler);
    }

    // Update Functions ============================================================



    // TODO THESE ARE THE LOW-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    static create(fromID, board, from, name, type, message, file, successHandler, failureHandler) {
        Lambda.create(fromID, "Message", {
            from,
            name,
            board,
            type,
            message,
        }, (data) => {
            // TODO Soon we'll have to adjust the Java project to be able to delete messages!
            if (type) {
                const path = data.data + "/" + message;
                if (type === "picture") {
                    S3.putImage(path, file, () => { successHandler(data); }, failureHandler);
                }
                else if (type === "video") {
                    S3.putVideo(path, file, () => { successHandler(data); }, failureHandler);
                }
            }
            else {
                successHandler(data);
            }
        }, failureHandler);
    }
    // static updateAdd(fromID, inviteID, attributeName, attributeValue, successHandler, failureHandler) {
    //     Lambda.updateAddToAttribute(fromID, inviteID, itemType, attributeName, attributeValue, successHandler, failureHandler);
    // }
    // static updateRemove(fromID, inviteID, attributeName, attributeValue, successHandler, failureHandler) {
    //     Lambda.updateRemoveFromAttribute(fromID, inviteID, itemType, attributeName, attributeValue, successHandler, failureHandler);
    // }
    // static updateSet(fromID, inviteID, attributeName, attributeValue, successHandler, failureHandler) {
    //     Lambda.updateSetAttribute(fromID, inviteID, itemType, attributeName, attributeValue, successHandler, failureHandler);
    // }
    // static delete(fromID, inviteID, successHandler, failureHandler) {
    //     Lambda.invokeDatabaseLambda({
    //         fromID,
    //         itemType,
    //
    //     }, successHandler, failureHandler);
    // }
}

export default MessageFunctions;
