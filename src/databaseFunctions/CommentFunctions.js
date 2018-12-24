import Lambda from "../Lambda";

const itemType = "Comment";

class CommentFunctions {
    // TODO THESE ARE THE HIGH-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    // Create Functions ============================================================
    static createComment(fromID, byID, onID, comment, successHandler, failureHandler) {
        this.create(fromID, byID, onID, comment, successHandler, failureHandler);
    }

    // Update Functions ============================================================
    static updateComment(fromID, commentID, comment, successHandler, failureHandler) {
        this.updateSet(fromID, commentID, "comment", comment, successHandler, failureHandler);
    }


    // TODO THESE ARE THE LOW-LEVEL DATABASE ACTION FUNCTIONS
    // =============================================================================
    static create(fromID, by, on, comment, successHandler, failureHandler) {
        Lambda.create(fromID, itemType, {
            by,
            on,
            comment,
        }, successHandler, failureHandler)
    }
    static updateAdd(fromID, commentID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateAddToAttribute(fromID, commentID, itemType, attributeName, attributeValue, successHandler, failureHandler);
    }
    static updateRemove(fromID, commentID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateRemoveFromAttribute(fromID, commentID, itemType, attributeName, attributeValue, successHandler, failureHandler);
    }
    static updateSet(fromID, commentID, attributeName, attributeValue, successHandler, failureHandler) {
        Lambda.updateSetAttribute(fromID, commentID, itemType, attributeName, attributeValue, successHandler, failureHandler);
    }
    static delete(fromID, commentID, successHandler, failureHandler) {
        Lambda.delete(fromID, commentID, itemType, successHandler, failureHandler);
    }
}

export default CommentFunctions;
