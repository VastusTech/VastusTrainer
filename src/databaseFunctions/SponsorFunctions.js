import Lambda from "../Lambda";
import UserFunctions from "./UserFunctions";

const itemType = "Sponsor";

class SponsorFunctions extends UserFunctions {
    // TODO THESE ARE THE HIGH-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    // Create Functions ============================================================
    static createSponsor(fromID, name, email, username, successHandler, failureHandler) {
        this.create(fromID, name, null, null, email, username, null, successHandler, failureHandler);
    }
    static createSponsorOptional(fromID, name, gender, birthday, email, username, bio, successHandler, failureHandler) {
        this.create(fromID, name, gender, birthday, email, username, bio, successHandler, failureHandler);
    }

    // Update Functions ============================================================

    // TODO THESE ARE THE LOW-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    static create(fromID, name, gender, birthday, email, username, bio, successHandler, failureHandler) {
        Lambda.create(fromID, itemType, {
            name,
            gender,
            birthday,
            email,
            username,
            bio
        }, successHandler, failureHandler);
    }
}

export default SponsorFunctions;
