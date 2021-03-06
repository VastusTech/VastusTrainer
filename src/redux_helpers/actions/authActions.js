import { Auth } from "aws-amplify";
import {setError, setIsLoading, setIsNotLoading} from "../../vastuscomponents/redux_actions/infoActions";
import {fetchUser, clearUser, setUser, forceSetUser} from "./userActions";
import QL from "../../vastuscomponents/api/GraphQL";
import TrainerFunctions from "../../vastuscomponents/database_functions/TrainerFunctions";
import {log} from "../../Constants";
// import {addHandlerToNotifications, removeAllHandlers} from "../../vastuscomponents/redux_actions/ablyActions";

export function updateAuth() {
    return (dispatch) => {
        // TODO This could totally be overkill lol
        Auth.currentCredentials();
        // Auth.currentSession();
        // Auth.currentUserCredentials();
        // Auth.currentUserInfo();
        // Auth.currentUserPoolUser();
        Auth.currentAuthenticatedUser().then((user) => {
            QL.getTrainerByUsername(user.username, ["id", "username"], (user) => {
                log&&console.log("REDUX: Successfully updated the authentication credentials");
                dispatch(setUser(user));
                dispatch(authLogIn());
                // dispatch(addHandlerToNotifications((message) => {
                //     console.log("Received ABLY notification!!!!!\n" + JSON.stringify(message));
                // }));
                dispatch(setIsNotLoading());
            }, (error) => {
                log&&console.log(JSON.stringify(error));
                log&&console.log(error.code);
                log&&console.log("REDUX: Could not fetch the client");
                dispatch(setError(error));
                dispatch(setIsNotLoading());
            });
        }).catch(() => {
            log&&console.log("REDUX: Not currently logged in. Not a problem, no worries.");
            dispatch(setIsNotLoading());
        });
    }
}
export function logIn(username, password) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        Auth.signIn(username, password).then(() => {
            QL.getTrainerByUsername(username, ["id", "username"], (user) => {
                log&&console.log("REDUX: Successfully logged in!");
                dispatch(authLogIn());
                if (getStore().user.id !== user.id) {
                    dispatch(forceSetUser(user));
                }
                else {
                    dispatch(setUser(user));
                }
                // dispatch(addHandlerToNotifications((message) => {
                //     console.log("Received ABLY notification!!!!!\n" + JSON.stringify(message));
                // }));
                dispatch(setIsNotLoading());
            }, (error) => {
                log&&console.log("REDUX: Could not fetch the client");
                dispatch(setError(error));
                dispatch(setIsNotLoading());
            });
        }).catch((error) => {
            if (error.code === "UserNotConfirmedException") {
                dispatch(authSignUp());
                dispatch(openSignUpModal());
                dispatch(setIsNotLoading());
            }
            else {
                log&&console.log("REDUX: Failed log in...");
                log&&console.log(error);
                dispatch(setError(error));
                dispatch(setIsNotLoading());
            }
        });
    };
}
export function logOut() {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        const userID = getStore().user.id;
        Auth.signOut({global: true}).then((data) => {
            log&&console.log("REDUX: Successfully logged out!");
            // dispatch(clearUser());
            dispatch(authLogOut());
            // dispatch(removeAllHandlers());
            dispatch(setIsNotLoading());
        }).catch((error) => {
            log&&console.log("REDUX: Failed log out...");
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    }
}
export function signUp(username, password, name, gender, birthday, email) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        const params = {
            username: username,
            password: password,
            attributes: {
                name: name,
                gender: gender,
                birthdate: birthday,
                email: email
            }
        };
        TrainerFunctions.createTrainerOptional("admin", name, gender, birthday, username, email, null, (trainerID) => {
            Auth.signUp(params).then((data) => {
                log&&console.log("REDUX: Successfully signed up!");
                dispatch(authSignUp());
                dispatch(setIsNotLoading());
            }).catch((error) => {
                log&&console.log("REDUX: Failed sign up...");
                dispatch(setError(error));
                dispatch(setIsNotLoading());
                // TODO DELETE CLIENT THAT WAS CREATED!!!!
                TrainerFunctions.delete("admin", trainerID);
            });
        }, (error) => {
            log&&console.log("REDUX: Creating new trainer failed...");
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    }
}
export function confirmSignUp(username, confirmationCode) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        Auth.confirmSignUp(username, confirmationCode).then((authUser) => {
            dispatch(closeSignUpModal());
            dispatch(authConfirmSignUp());
            dispatch(setIsNotLoading());
        }).catch((error) => {
            log&&console.log("REDUX: Failed confirming sign up...");
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    }
}
export function forgotPassword(username) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        Auth.forgotPassword(username).then(() => {
            log&&console.log("REDUX: Successfully forgot password!");
            dispatch(authForgotPassword());
            dispatch(setIsNotLoading());
        }).catch((error) => {
            log&&console.log("REDUX: Failed forgot password...");
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    };
}
export function confirmForgotPassword(username, confirmationCode, newPassword) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        Auth.forgotPasswordSubmit(username, confirmationCode, newPassword).then(() => {
            log&&console.log("REDUX: Successfully submitted forgot password!");
            dispatch(authConfirmForgotPassword());
            // dispatch(closeForgotPasswordModal());
            dispatch(setIsNotLoading());
        }).catch((error) => {
            log&&console.log("REDUX: Failed submitting forgot password...");
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    }
}

export function openSignUpModal() {
    return {
        type: 'OPEN_SIGN_UP_MODAL'
    };
}
export function closeSignUpModal() {
    return {
        type: 'CLOSE_SIGN_UP_MODAL'
    };
}
export function openForgotPasswordModal() {
    return {
        type: 'OPEN_FORGOT_PASSWORD_MODAL'
    };
}
export function closeForgotPasswordModal() {
    return {
        type: 'CLOSE_FORGOT_PASSWORD_MODAL'
    };
}

function authLogIn() {
    return {
        type: 'LOG_IN'
    };
}
function authLogOut() {
    return {
        type: 'LOG_OUT'
    };
}
function authSignUp() {
    return {
        type: 'SIGN_UP'
    };
}
function authConfirmSignUp() {
    return {
        type: 'CONFIRM_SIGN_UP'
    };
}
function authForgotPassword() {
    return {
        type: 'FORGOT_PASSWORD'
    };
}
function authConfirmForgotPassword() {
    return {
        type: 'CONFIRM_FORGOT_PASSWORD'
    };
}
