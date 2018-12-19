import Lambda from "../Lambda";
import UserFunctions from "./UserFunctions";

const itemType = "Event";

class EventFunctions {
    // TODO THESE ARE THE HIGH-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    // Create Functions ============================================================
    static createEvent(fromID, owner, time, capacity, address, title, access, tags, successHandler, failureHandler) {
        this.create(fromID, null, owner, time, capacity, address, title, null, null, access, tags, successHandler, failureHandler);
    }
    static createEventOptional(fromID, owner, time, capacity, address, title, description, memberIDs, access, tags, successHandler, failureHandler) {
        this.create(fromID, null, owner, time, capacity, address, title, description, memberIDs, access, tags, successHandler, failureHandler);
    }
    static createChallengeEvent(fromID, challengeID, owner, time, capacity, address, title, access, tags, successHandler, failureHandler) {
        this.create(fromID, challengeID, owner, time, capacity, address, title, tags, null, access, tags, successHandler, failureHandler);
    }
    static createChallengeEventOptional(fromID, challengeID, owner, time, capacity, address, title, description, memberIDs, access, tags, successHandler, failureHandler) {
        this.create(fromID, challengeID, owner, time, capacity, address, title, description, memberIDs, access, tags, successHandler, failureHandler);
    }

    // Update Functions ============================================================
    static updateWinner(fromID, eventID, winnerID, successHandler, failureHandler) {
        this.updateSet(fromID, eventID, "winner", winnerID, successHandler, failureHandler);
    };
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
    static addMember(fromID, eventID, userID, successHandler, failureHandler) {
        UserFunctions.addEvent(fromID, userID, eventID, successHandler, failureHandler);
    }
    static removeMember(fromID, eventID, userID, successHandler, failureHandler) {
        UserFunctions.removeEvent(fromID, userID, eventID, successHandler, failureHandler);
    }
    static updateChallenge(fromID, eventID, challengeID, successHandler, failureHandler) {
        this.updateSet(fromID, eventID, "challenge", challengeID, successHandler, failureHandler);
    }
    static updateAddress(fromID, eventID, address, successHandler, failureHandler) {
        this.updateSet(fromID, eventID, "address", address, successHandler, failureHandler);
    }
    static updateCapacity(fromID, eventID, capacity, successHandler, failureHandler) {
        this.updateSet(fromID, eventID, "capacity", capacity, successHandler, failureHandler);
    }
    static updateTitle(fromID, eventID, title, successHandler, failureHandler) {
        this.updateSet(fromID, eventID, "title", title, successHandler, failureHandler);
    }
    static updateDescription(fromID, eventID, description, successHandler, failureHandler) {
        this.updateSet(fromID, eventID, "description", description, successHandler, failureHandler);
    }

    // TODO THESE ARE THE LOW-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    static create(fromID, challengeID, owner, time, capacity, address, title, description, memberIDs, access, tags, successHandler, failureHandler) {
        Lambda.create(fromID, itemType, {
            owner,
            time,
            capacity,
            address,
            title,
            description,
            memberIDs,
            access,
            tags,
            challenge: challengeID
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

export default EventFunctions;
