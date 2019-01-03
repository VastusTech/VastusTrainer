import Lambda from "../Lambda";
import S3 from "../S3Storage";
import UserFunctions from "./UserFunctions";

class PostFunctions {
    // TODO THESE ARE THE HIGH-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    // Create Functions ============================================================
    // TODO IMPORTANT: pictures and videos are objects with { key = S3Path : value = file }
    static createSubmission(fromID, by, challengeID, description, pictures, videos, successHandler, failureHandler) {
        this.create(fromID, by, description, "public", "submission", challengeID, pictures, videos, successHandler, failureHandler);
    }
    static createBarePost(fromID, by, description, access, successHandler, failureHandler) {
        this.createNormalPost(fromID, by, description, access, null, null, successHandler, failureHandler);
    }
    static createNewEventPost(fromID, by, description, access, eventID, successHandler, failureHandler) {
        this.createNewItemPost(fromID, by, description, access, "Event", eventID, successHandler, failureHandler);
    }
    static createNewChallengePost(fromID, by, description, access, challengeID, successHandler, failureHandler) {
        this.createNewItemPost(fromID, by, description, access, "Challenge", challengeID, successHandler, failureHandler);
    }
    static createNormalPost(fromID, by, description, access, pictures, videos, successHandler, failureHandler) {
        this.create(fromID, by, description, access, null, null, pictures, videos, successHandler, failureHandler);
    }
    static createShareItemPost(fromID, by, description, access, itemType, itemID, pictures, videos, successHandler, failureHandler) {
        this.create(fromID, by, description, access, itemType, itemID, pictures, videos, successHandler, failureHandler);
    }
    static createNewItemPost(fromID, by, description, access, itemType, itemID, successHandler, failureHandler) {
        this.create(fromID, by, description, access, "new" + itemType, itemID, null, null, successHandler, failureHandler);
    }

    // Update Functions ============================================================
    static updateDescription(fromID, postID, description, successHandler, failureHandler) {
        this.updateSet(fromID, postID, "description", description, successHandler, failureHandler);
    }
    static updateAccess(fromID, postID, access, successHandler, failureHandler) {
        this.updateSet(fromID, postID, "access", access, successHandler, failureHandler);
    }
    static addPicture(fromID, postID, picture, picturePath, successHandler, failureHandler) {
        S3.putImage(picturePath, picture, () => {
            this.updateAdd(fromID, postID, "picturePaths", picturePath, successHandler, (error) => {
                // Try your best to correct, then give up...
                S3.delete(picturePath);
                failureHandler(error);
            });
        }, failureHandler);
    }
    static addVideo(fromID, postID, video, videoPath, successHandler, failureHandler) {
        S3.putVideo(videoPath, video, () => {
            this.updateAdd(fromID, postID, "videoPaths", videoPath, successHandler, (error) => {
                // Try your best to correct, then give up...
                S3.delete(videoPath);
                failureHandler(error);
            });
        }, failureHandler);
    }
    static removePicture(fromID, postID, picturePath, successHandler, failureHandler) {
        this.updateRemove(fromID, postID, "picturePaths", picturePath, (data) => {
            S3.delete(picturePath, () => {
                successHandler(data);
            }, failureHandler);
        }, failureHandler);
    }
    static removeVideo(fromID, postID, videoPath, successHandler, failureHandler) {
        this.updateRemove(fromID, postID, "videoPaths", videoPath, (data) => {
            S3.delete(videoPath, () => {
                successHandler(data);
            }, failureHandler);
        }, failureHandler);
    }
    // TODO THESE ARE THE LOW-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    static create(fromID, by, description, access, postType, about, pictures, videos, successHandler, failureHandler) {
        const picturePaths = pictures.keys() ? pictures : null;
        const videoPaths = videos.keys() ? videos : null;
        let numPictures = 0;
        let numVideos = 0;
        if (picturePaths) { numPictures = picturePaths.length; }
        if (videoPaths) { numVideos = videoPaths.length; }
        Lambda.create(fromID, "Post", {
            by,
            description,
            access,
            postType,
            about,
            picturePaths,
            videoPaths,
        }, (data) => {
            const id = data.id;
            const numVideosAndPictures = numPictures + numVideos;
            let numFinished = 0;
            function finish() {
                numFinished++;
                if (numFinished >= numVideosAndPictures) { successHandler(data); }
            }
            function error(error) {
                // TODO Delete the object and abort!
                PostFunctions.delete(fromID, id);
                failureHandler(error);
            }
            if (numVideosAndPictures === 0) {
                successHandler(data);
            }
            else {
                if (pictures) {
                    for (const key in pictures) {
                        if (pictures.hasOwnProperty(key) && pictures[key]) {
                            S3.putImage(id + "/" + key, pictures[key], finish, error);
                        }
                    }
                }
                if (videos) {
                    for (const key in videos) {
                        if (videos.hasOwnProperty(key) && videos[key]) {
                            S3.putVideo(id + "/" + key, videos[key], finish, error);
                        }
                    }
                }
            }
        }, failureHandler);
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
