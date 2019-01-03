import Lambda from "./Lambda";

class FirebaseTokenHandler {
    static addTokenToUser(id, token, expires, successHandler, failureHandler) {
        Lambda.invokeFirebaseLambda({
            type: "addToken",
            id,
            token,
            expires,
        }, successHandler, failureHandler);
    }
    static clearTokensFromUser(id, successHandler, failureHandler) {
        Lambda.invokeFirebaseLambda({
            type: "clearTokens",
            id
        }, successHandler, failureHandler);
    }
}

export default FirebaseTokenHandler;
