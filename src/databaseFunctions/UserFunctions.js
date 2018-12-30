import Lambda from "../Lambda";
import { getItemTypeFromID } from "../logic/ItemType";

class UserFunctions {
    // TODO THESE ARE THE HIGH-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    // Create Functions ============================================================

    // Update Functions ============================================================
    // TODO Test to see if this actually works!!!!!!
    static addProfileImagePath(fromID, userID, profileImagePath, successHandler, failureHandler) {
        this.updateAdd(fromID, userID, "profileImagePaths", profileImagePath, successHandler, failureHandler);
    }
    static removeProfileImagePath(fromID, userID, profileImagePath, successHandler, failureHandler) {
        this.updateRemove(fromID, userID, "profileImagePaths", profileImagePath, successHandler, failureHandler);
    }
    static addFriend(fromID, userID, friendID, successHandler, failureHandler) {
        this.updateAdd(fromID, userID, "friends", friendID, successHandler, failureHandler);
    }
    static removeFriend(fromID, userID, friendID, successHandler, failureHandler) {
        this.updateRemove(fromID, userID, "friends", friendID, successHandler, failureHandler);
    }
    static addChallenge(fromID, userID, challengeID, successHandler, failureHandler) {
        this.updateAdd(fromID, userID, "challenges", challengeID, successHandler, failureHandler);
    }
    static removeChallenge(fromID, userID, challengeID, successHandler, failureHandler) {
        this.updateRemove(fromID, userID, "challenges", challengeID, successHandler, failureHandler);
    }
    static addEvent(fromID, userID, eventID, successHandler, failureHandler) {
        this.updateAdd(fromID, userID, "scheduledEvents", eventID, successHandler, failureHandler);
    }
    static removeEvent(fromID, userID, eventID, successHandler, failureHandler) {
        this.updateRemove(fromID, userID, "scheduledEvents", eventID, successHandler, failureHandler);
    }
    static addGroup(fromID, userID, groupID, successHandler, failureHandler) {
        this.updateAdd(fromID, userID, "groups", groupID, successHandler, failureHandler);
    }
    static removeGroup(fromID, userID, groupID, successHandler, failureHandler) {
        this.updateRemove(fromID, userID, "groups", groupID, successHandler, failureHandler);
    }
    static updateName(fromID, userID, name, successHandler, failureHandler) {
        this.updateSet(fromID, userID, "name", name, successHandler, failureHandler);
    }
    static updateGender(fromID, userID, gender, successHandler, failureHandler) {
        this.updateSet(fromID, userID, "gender", gender, successHandler, failureHandler);
    }
    static updateBirthday(fromID, userID, birthday, successHandler, failureHandler) {
        this.updateSet(fromID, userID, "birthday", birthday, successHandler, failureHandler);
    }
    static updateBio(fromID, userID, bio, successHandler, failureHandler) {
        this.updateSet(fromID, userID, "bio", bio, successHandler, failureHandler);
    }
    static updateProfileImagePath(fromID, userID, profileImagePath, successHandler, failureHandler) {
        this.updateSet(fromID, userID, "profileImagePath", profileImagePath, successHandler, failureHandler);
    }

    // TODO THESE ARE THE LOW-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    static updateAdd(fromID, userID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateAddToAttribute(fromID, userID, getItemTypeFromID(userID), attributeName, attributeValue, successHandler, failureHandler);
    }
    static updateRemove(fromID, userID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateRemoveFromAttribute(fromID, userID, getItemTypeFromID(userID), attributeName, attributeValue, successHandler, failureHandler);
    }
    static updateSet(fromID, userID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateSetAttribute(fromID, userID, getItemTypeFromID(userID), attributeName, attributeValue, successHandler, failureHandler);
    }
    static delete(fromID, userID, successHandler, failureHandler) {
        Lambda.delete(fromID, userID, getItemTypeFromID(userID), successHandler, failureHandler);
    }
}

export default UserFunctions;
