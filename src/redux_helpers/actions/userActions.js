// import QL from '../../GraphQL';
// import { Storage } from "aws-amplify";
import {setError, clearError, setIsLoading, setIsNotLoading} from '../../vastuscomponents/redux_actions/infoActions';
import { fetchTrainer, forceFetchTrainer } from "../../vastuscomponents/redux_actions/cacheActions";
// import defaultProfilePicture from "../../img/roundProfile.png";

// TODO Cache the user into the clients so that we actually are getting from there
export function setUser(user) {
    return {
        type: "SET_USER",
        payload: user
    };
}
export function forceSetUser(user) {
    return {
        type: "FORCE_SET_USER",
        payload: user
    };
}

export function forceFetchUserAttributes(variablesList, dataHandler) {
    return (dispatch, getStore) => {
        // Just overwrite all the user attributes because we want to process them again
        const userID = getStore().user.id;
        if (userID) {
            forceFetchTrainer(userID, variablesList, (client) => {
                dispatch(setUser(client));
                dispatch(setIsNotLoading());
                if (dataHandler) { dataHandler(getStore().user);}
            })(dispatch, getStore);
        }
    }
}

/**
 * This function will only get the user attributes if they haven't been got before.
 * This assumes that you don't care about refreshing these attributes often. Will use the cache.
 * @param id
 * @param variablesList
 * @param dataHandler
 * @returns {Function}
 */
export function fetchUserAttributes(variablesList, dataHandler) {
    return (dispatch, getStore) => {
        const userID = getStore().user.id;
        if (userID) {
            fetchTrainer(userID, variablesList, (client) => {
                dispatch(setUser(client));
                dispatch(setIsNotLoading());
                if (dataHandler) { dataHandler(getStore().user);}
            })(dispatch, getStore);
        }
    }
}

export function clearUser() {
    return {
        type: 'CLEAR_USER'
    }
}