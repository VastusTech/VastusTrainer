import Lambda from "../Lambda";
import S3 from "../S3Storage";

const itemType = "Message";

class MessageFunctions {
    // TODO THESE ARE THE HIGH-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    // Create Functions ============================================================
    static createTextMessage(fromID, from, board, message, successHandler, failureHandler) {
        this.create(fromID, board, from, null, message, successHandler, failureHandler);
    }
    static createPictureMessage(fromID, from, board, picture, picturePath, successHandler, failureHandler) {
        S3.putImage(picturePath, picture, () => {
            this.create(fromID, board, from, "picture", picturePath, successHandler, (error) => {
                // Try your best to correct, then give up...
                S3.delete(picturePath);
                failureHandler(error);
            });
        }, failureHandler);
    }
    static createVideoMessage(fromID, from, board, video, videoPath, successHandler, failureHandler) {
        S3.putVideo(videoPath, video, () => {
            this.create(fromID, board, from, "video", videoPath, successHandler, (error) => {
                // Try your best to correct, then give up...
                S3.delete(videoPath);
                failureHandler(error);
            });
        }, failureHandler);
    }
    // Update Functions ============================================================



    // TODO THESE ARE THE LOW-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    static create(fromID, board, from, type, message, successHandler, failureHandler) {
        Lambda.create(fromID, "Message", {
            from,
            board,
            type,
            message,
        }, successHandler, failureHandler);
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
    //     Lambda.delete(fromID, inviteID, itemType, successHandler, failureHandler);
    // }
}

export default MessageFunctions;
