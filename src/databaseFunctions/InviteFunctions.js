import Lambda from "../Lambda";

const itemType = "Invite";

class InviteFunctions {
    // TODO THESE ARE THE HIGH-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================

    // Create Functions ============================================================

    // Update Functions ============================================================



    // TODO THESE ARE THE LOW-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    static createFriendRequest(fromID, from, to, successHandler, failureHandler) {
        this.create(fromID, from, to, "friendRequest", from, null, successHandler, failureHandler);
    }
    static createFriendRequestOptional(fromID, from, to, message, successHandler, failureHandler) {
        this.create(fromID, from, to, "friendRequest", from, message, successHandler, failureHandler);
    }
    static createEventInvite(fromID, from, to, eventID, successHandler, failureHandler) {
        this.create(fromID, from, to, "eventInvite", eventID, null, successHandler, failureHandler);
    }
    static createEventInviteOptional(fromID, from, to, eventID, message, successHandler, failureHandler) {
        this.create(fromID, from, to, "eventInvite", eventID, message, successHandler, failureHandler);
    }
    static createChallengeInvite(fromID, from, to, challengeID, successHandler, failureHandler) {
        this.create(fromID, from, to, "challengeInvite", challengeID, null, successHandler, failureHandler);
    }
    static createChallengeInviteOptional(fromID, from, to, challengeID, message, successHandler, failureHandler) {
        this.create(fromID, from, to, "challengeInvite", challengeID, message, successHandler, failureHandler);
    }
    static createEventRequest(fromID, from, eventID, successHandler, failureHandler) {
        this.create(fromID, from, eventID, "eventRequest", from, null, successHandler, failureHandler);
    }
    static createEventRequestOptional(fromID, from, eventID, message, successHandler, failureHandler) {
        this.create(fromID, from, eventID, "eventRequest", from, message, successHandler, failureHandler);
    }
    static createChallengeRequest(fromID, from, challengeID, successHandler, failureHandler) {
        this.create(fromID, from, challengeID, "challengeRequest", from, null, successHandler, failureHandler);
    }
    static createChallengeRequestOptional(fromID, from, challengeID, message, successHandler, failureHandler) {
        this.create(fromID, from, challengeID, "challengeRequest", from, message, successHandler, failureHandler);
    }
    static create(fromID, from, to, inviteType, about, description, successHandler, failureHandler) {
        Lambda.create(fromID, "Invite", {
            from,
            to,
            inviteType,
            about,
            description,
        }, successHandler, failureHandler);
    }
    static updateAdd(fromID, inviteID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateAddToAttribute(fromID, inviteID, itemType, attributeName, attributeValue, successHandler, failureHandler);
    }
    static updateRemove(fromID, inviteID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateRemoveFromAttribute(fromID, inviteID, itemType, attributeName, attributeValue, successHandler, failureHandler);
    }
    static updateSet(fromID, inviteID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateSetAttribute(fromID, inviteID, itemType, attributeName, attributeValue, successHandler, failureHandler);
    }
    static delete(fromID, inviteID, successHandler, failureHandler) {
        Lambda.delete(fromID, inviteID, itemType, successHandler, failureHandler);
    }
}

export default InviteFunctions;
