import Lambda from "../Lambda";
import UserFunctions from "./UserFunctions";

const itemType = "Trainer";

class TrainerFunctions extends UserFunctions {
    // TODO THESE ARE THE HIGH-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    // Create Functions ============================================================

    // Update Functions ============================================================


    // TODO THESE ARE THE LOW-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    static create() {
        // TODO Implement
        console.log("Not implemented...");
    }
    static updateAdd(fromID, trainerID, attributeName, attributeValue, successHandler, failureHandler) {
        super.updateAdd(fromID, itemType, trainerID, attributeName, attributeValue, successHandler, failureHandler);
    }
    static updateRemove(fromID, trainerID, attributeName, attributeValue, successHandler, failureHandler) {
        super.updateRemove(fromID, itemType, trainerID, attributeName, attributeValue, successHandler, failureHandler);
    }
    static updateSet(fromID, trainerID, attributeName, attributeValue, successHandler, failureHandler) {
        super.updateSet(fromID, itemType, trainerID, attributeName, attributeValue, successHandler, failureHandler);
    }
    static delete(fromID, trainerID, successHandler, failureHandler) {
        super.delete(fromID, itemType, trainerID, successHandler, failureHandler);
    }
}

export default TrainerFunctions;
