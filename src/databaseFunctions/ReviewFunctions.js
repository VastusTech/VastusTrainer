import Lambda from "../Lambda";

const itemType = "Review";

class ReviewFunctions {
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
    static updateAdd(fromID, reviewID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateAddToAttribute(fromID, reviewID, itemType, attributeName, attributeValue, successHandler, failureHandler);
    }
    static updateRemove(fromID, reviewID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateRemoveFromAttribute(fromID, reviewID, itemType, attributeName, attributeValue, successHandler, failureHandler);
    }
    static updateSet(fromID, reviewID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateSetAttribute(fromID, reviewID, itemType, attributeName, attributeValue, successHandler, failureHandler);
    }
    static delete(fromID, reviewID, successHandler, failureHandler) {
        Lambda.delete(fromID, reviewID, itemType, successHandler, failureHandler);
    }
}

export default ReviewFunctions;
