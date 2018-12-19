import Lambda from "../Lambda";

class PostFunctions {
    // TODO THESE ARE THE HIGH-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    // Create Functions ============================================================
    static createSubmission(fromID, by, challengeID, description, picturePaths, videoPaths, successHandler, failureHandler) {
        this.create(fromID, by, description, "public", "submission", challengeID, picturePaths, videoPaths, successHandler, failureHandler);
    }
    static createBarePost(fromID, by, description, access, successHandler, failureHandler) {
        this.createNormalPost(fromID, by, description, access, null, null, successHandler, failureHandler);
    }
    static createNewEventPost(fromID, by, description, access, eventID, picturePaths, videoPaths, successHandler, failureHandler) {
        this.createNewItemPost(fromID, by, description, access, "Event", eventID, picturePaths, videoPaths, successHandler, failureHandler);
    }
    static createNewChallengePost(fromID, by, description, access, challengeID, picturePaths, videoPaths, successHandler, failureHandler) {
        this.createNewItemPost(fromID, by, description, access, "Challenge", challengeID, picturePaths, videoPaths, successHandler, failureHandler);
    }
    static createNormalPost(fromID, by, description, access, picturePaths, videoPaths, successHandler, failureHandler) {
        this.create(fromID, by, description, access, null, null, picturePaths, videoPaths, successHandler, failureHandler);
    }
    static createShareItemPost(fromID, by, description, access, itemType, itemID, picturePaths, videoPaths, successHandler, failureHandler) {
        this.create(fromID, by, description, access, itemType, itemID, picturePaths, videoPaths, successHandler, failureHandler);
    }
    static createNewItemPost(fromID, by, description, access, itemType, itemID, picturePaths, videoPaths, successHandler, failureHandler) {
        this.create(fromID, by, description, access, "new" + itemType, itemID, picturePaths, videoPaths, successHandler, failureHandler);
    }

    // Update Functions ============================================================
    static updateDescription(fromID, postID, description, successHandler, failureHandler) {
        this.updateSet(fromID, postID, "description", description, successHandler, failureHandler);
    }
    static updateAccess(fromID, postID, access, successHandler, failureHandler) {
        this.updateSet(fromID, postID, "access", access, successHandler, failureHandler);
    }
    static addPicturePath(fromID, postID, picturePath, successHandler, failureHandler) {
        this.updateAdd(fromID, postID, "picturePaths", picturePath, successHandler, failureHandler);
    }
    static addVideoPath(fromID, postID, videoPath, successHandler, failureHandler) {
        this.updateAdd(fromID, postID, "videoPaths", videoPath, successHandler, failureHandler);
    }
    static removePicturePath(fromID, postID, picturePath, successHandler, failureHandler) {
        this.updateRemove(fromID, postID, "picturePaths", picturePath, successHandler, failureHandler);
    }
    static removeVideoPath(fromID, postID, videoPath, successHandler, failureHandler) {
        this.updateRemove(fromID, postID, "videoPaths", videoPath, successHandler, failureHandler);
    }

    // TODO THESE ARE THE LOW-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    static create(fromID, by, description, access, postType, about, picturePaths, videoPaths, successHandler, failureHandler) {
        Lambda.create(fromID, "Post", {
            by,
            description,
            access,
            postType,
            about,
            picturePaths,
            videoPaths,
        }, successHandler, failureHandler);
    }
    static updateAdd(fromID, postID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateAddToAttribute(fromID, postID, "Post", attributeName, attributeValue, successHandler, failureHandler);
    }
    static updateRemove(fromID, postID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateRemoveFromAttribute(fromID, postID, "Post", attributeName, attributeValue, successHandler, failureHandler);
    }
    static updateSet(fromID, postID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateSetAttribute(fromID, postID, "Post", attributeName, attributeValue, successHandler, failureHandler);
    }
    static delete(fromID, postID, successHandler, failureHandler) {
        Lambda.delete(fromID, postID, "Post", successHandler, failureHandler);
    }
}

export default PostFunctions;
