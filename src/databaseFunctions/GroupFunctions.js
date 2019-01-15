import Lambda from "../Lambda";
import UserFunctions from "./UserFunctions";

const itemType = "Group";

class GroupFunctions {
    // TODO THESE ARE THE HIGH-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    // Create Functions ============================================================
    static createGroup(fromID, title, description, successHandler, failureHandler) {
        this.create(fromID, title, description, null, null, null, null, null, successHandler, failureHandler);
    }
    static createGroupOptional(fromID, title, description, access, restriction, owners, members, tags, successHandler, failureHandler) {
        this.create(fromID, title, description, access, restriction, owners, members, tags, successHandler, failureHandler);
    }

    // Update Functions ============================================================
    static updateToPrivate(fromID, eventID, successHandler, failureHandler) {
        this.updateSet(fromID, eventID, "access", "private", successHandler, failureHandler);
    }
    static updateToPublic(fromID, eventID, successHandler, failureHandler) {
        this.updateSet(fromID, eventID, "access", "public", successHandler, failureHandler);
    }
    static updateToInviteOnly(fromID, eventID, successHandler, failureHandler) {
        this.updateAdd(fromID, eventID, "restriction", "invite", successHandler, failureHandler);
    }
    static updateToUnrestricted(fromID, eventID, successHandler, failureHandler) {
        this.updateSet(fromID, eventID, "restriction", null, successHandler, failureHandler);
    }
    static addTag(fromID, eventID, tag, successHandler, failureHandler) {
        this.updateAdd(fromID, eventID, "tags", tag, successHandler, failureHandler);
    }
    static removeTag(fromID, eventID, tag, successHandler, failureHandler) {
        this.updateRemove(fromID, eventID, "tags", tag, successHandler, failureHandler);
    }
    static addMember(fromID, groupID, userID, successHandler, failureHandler) {
        UserFunctions.addGroup(fromID, userID, groupID, successHandler, failureHandler);
    }
    static removeMember(fromID, groupID, userID, successHandler, failureHandler) {
        UserFunctions.removeGroup(fromID, userID, groupID, successHandler, failureHandler);
    }
    static updateTitle(fromID, groupID, title, successHandler, failureHandler) {
        this.updateSet(fromID, groupID, "title", title, successHandler, failureHandler);
    }
    static updateDescription(fromID, groupID, description, successHandler, failureHandler) {
        this.updateSet(fromID, groupID, "description", description, successHandler, failureHandler);
    }

    // TODO THESE ARE THE LOW-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    static create(fromID, title, description, access, restriction, owners, members, tags, successHandler, failureHandler) {
        Lambda.create(fromID, itemType, {
            title,
            description,
            access,
            restriction,
            owners,
            members,
            tags,
        }, successHandler, failureHandler);
    }
    static updateAdd(fromID, eventID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateAddToAttribute(fromID, eventID, itemType, attributeName, attributeValue, successHandler, failureHandler);
    }
    static updateRemove(fromID, eventID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateRemoveFromAttribute(fromID, eventID, itemType, attributeName, attributeValue, successHandler, failureHandler);
    }
    static updateSet(fromID, eventID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateSetAttribute(fromID, eventID, itemType, attributeName, attributeValue, successHandler, failureHandler);
    }
    static delete(fromID, eventID, successHandler, failureHandler) {
        Lambda.delete(fromID, eventID, itemType, successHandler, failureHandler);
    }
}

export default GroupFunctions;
