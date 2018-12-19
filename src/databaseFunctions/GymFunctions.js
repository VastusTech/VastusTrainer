import Lambda from "../Lambda";
import UserFunctions from "./UserFunctions";

const itemType = "Gym";

class GymFunctions extends UserFunctions {
    // TODO THESE ARE THE HIGH-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    // Create Functions ============================================================

    // Update Functions ============================================================


    // TODO THESE ARE THE LOW-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    static create(fromID, name, gender, birthday, email, username, bio, successHandler, failureHandler) {
        super.create(fromID, itemType, name, gender, birthday, email, username, bio, successHandler, failureHandler);
    }
    static updateAdd(fromID, gymID, attributeName, attributeValue, successHandler, failureHandler) {
        super.updateAdd(fromID, itemType, gymID, attributeName, attributeValue, successHandler, failureHandler);
    }
    static updateRemove(fromID, gymID, attributeName, attributeValue, successHandler, failureHandler) {
        super.updateRemove(fromID, itemType, gymID, attributeName, attributeValue, successHandler, failureHandler);
    }
    static updateSet(fromID, gymID, attributeName, attributeValue, successHandler, failureHandler) {
        super.updateSet(fromID, itemType, gymID, attributeName, attributeValue, successHandler, failureHandler);
    }
    static delete(fromID, gymID, successHandler, failureHandler) {
        super.delete(fromID, itemType, gymID, successHandler, failureHandler);
    }
}

export default GymFunctions;
