import firebase from "firebase";
import FirebaseTokenHandler from "../../FirebaseTokenHandler";
import {setError, setIsLoading, setIsNotLoading} from "./infoActions";

const SET_TOKEN = 'SET_TOKEN';
const CLEAR_TOKEN = 'CLEAR_TOKEN';

// TODO This should be a function that takes in a payload object
export function setOnMessage(messageHandler) {
    return (dispatch, getStore) => {
        const messaging = firebase.messaging();
        messaging.onMessage(messageHandler);
    };
}
export function firebaseSignIn(userID) {
    return (dispatch, getStore) => {
        const messaging = firebase.messaging();
        dispatch(setIsLoading());
        messaging.requestPermission().then(() => {
            console.log("Received permission for Firebase!");
            messaging.getToken().then((token) => {
                dispatch(setToken(token));
                console.log("Received the token from Firebase! Token = " + token);
                FirebaseTokenHandler.addTokenToUser(userID, token, "never", () => {
                    console.log("Successfully added the token to the database!");
                    dispatch(setIsNotLoading());
                }, (error) => {
                    console.error("Failed to send the token to the database... Error: " + JSON.stringify(error));
                    dispatch(setError(error));
                    dispatch(setIsNotLoading());
                });
            }).catch((error) => {
                console.error("Error retrieving token from Firebase... Error: " + JSON.stringify(error));
                dispatch(setError(error));
                dispatch(setIsNotLoading());
            });
        }).catch((error) => {
            console.error("Error retrieving permission for Firebase... Error: " + JSON.stringify(error));
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    };
}
export function firebaseSignOut(userID) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        const token = getStore().firebase.token;
        if (getStore().firebase.token) {
            const messaging = firebase.messaging();
            messaging.deleteToken(token).then(() => {
                dispatch(clearToken());
                FirebaseTokenHandler.clearTokensFromUser(userID, () => {
                    console.log("Successful firebase sign out!");
                    dispatch(setIsNotLoading());
                }, (error) => {
                    console.error("Failed firebase sign out... Error: " + JSON.stringify(error));
                    dispatch(setError(error));
                    dispatch(setIsNotLoading());
                });
            }).catch((error) => {
                console.error("Failed deleting firebase token!");
                dispatch(setError(error));
                dispatch(setIsNotLoading());
            })
        }
        else {
            console.log("Trying to sign out, but the firebase token is not set...?");
        }
    }
}
function setToken(token) {
    return {
        type: SET_TOKEN,
        payload: token
    }
}
function clearToken() {
    return {
        type: CLEAR_TOKEN
    };
}
