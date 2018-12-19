import Lambda from "../Lambda";
import UserFunctions from "./UserFunctions";

const itemType = "Client";

class ClientFunctions extends UserFunctions {
    // TODO THESE ARE THE HIGH-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    // Create Functions ============================================================
    static createClient(fromID, name, gender, birthday, email, username, successHandler, failureHandler) {
        this.create(fromID, name, gender, birthday, email, username, null, successHandler, failureHandler);
    }
    static createClientOptional(fromID, name, gender, birthday, email, username, bio, successHandler, failureHandler) {
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

export default ClientFunctions;
