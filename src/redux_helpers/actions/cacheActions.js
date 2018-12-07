import { setIsNotLoading, setError, setIsLoading } from "./infoActions";
import QL from "../../GraphQL";
import { Storage } from "aws-amplify";
import defaultProfilePicture from "../../img/roundProfile.png";

function addProfilePictureToData(data, imageKey, callback) {
    if (imageKey) {
        Storage.get(imageKey).then((url) => {
            callback({
                ...data,
                profilePicture: url
            });
        }).catch((error) => {
            alert("ERROR IN GETTING PROFILE IMAGE FOR USER");
            console.log("ERROR IN GETTING PROFILE IMAGE FOR USER");
            console.log(error);
            callback(data);
        });
    }
    else {
        callback({
            ...data,
            profilePicture: defaultProfilePicture
        });
    }
}
function fetch(id, variablesList, cacheSet, QLFunctionName, fetchDispatchType, dataHandler) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        const currentObject = getStore().cache[cacheSet][id];
        if (currentObject) {
            const objectKeyList = Object.keys(currentObject);
            variablesList = variablesList.filter((v) => { return !objectKeyList.includes(v) });
            // alert("Final filtered list is = " + JSON.stringify(variablesList));
        }
        overwriteFetch(id, variablesList, cacheSet, QLFunctionName, fetchDispatchType, dataHandler, dispatch, getStore);
    };
}
function forceFetch(id, variablesList, cacheSet, QLFunctionName, fetchDispatchType, dataHandler) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        overwriteFetch(id, variablesList, cacheSet, QLFunctionName, fetchDispatchType, dataHandler, dispatch, getStore);
    };
}
function overwriteFetch(id, variablesList, cacheSet, QLFunctionName, fetchDispatchType, dataHandler, dispatch, getStore) {
    const profilePictureIndex = variablesList.indexOf("profilePicture");
    if (profilePictureIndex !== -1) {
        // alert("The variable list is requesting the profilePicture to be uploaded as well.");
        variablesList.splice(profilePictureIndex, 1);
        // Add
        if (!variablesList.includes("profileImagePath")) {
            alert("lmao you forgot to include the profile image path, I'll include it tho, no worries");
            variablesList = [
                ...variablesList,
                "profileImagePath"
            ]
        }
    }
    if (variablesList.length > 0) {
        if (!variablesList.includes("id")) {
            variablesList = [...variablesList, "id"];
        }
        QL[QLFunctionName](id, variablesList, (data) => {
            // alert("Successfully retrieved the QL info");
            if (profilePictureIndex !== -1) {
                // alert("Adding profile image to the data");
                addProfilePictureToData(data, data.profileImagePath, (updatedData) => {
                    // alert("Dispatching the profile image + data");
                    dispatch({
                        type: fetchDispatchType,
                        payload: updatedData
                    });
                    dispatch(setIsNotLoading());
                    if (dataHandler) { dataHandler(getStore().cache[cacheSet][id]);}
                });
            }
            else {
                // alert("Just dispatching the normal data");
                dispatch({
                    type: fetchDispatchType,
                    payload: data
                });
                dispatch(setIsNotLoading());
                if (dataHandler) { dataHandler(getStore().cache[cacheSet][id]);}
            }
        }, (error) => {
            alert("Error in retrieval");
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    }
    else {
        dispatch({
            type: fetchDispatchType,
            payload: {id}
        });
        dispatch(setIsNotLoading());
        if (dataHandler) { dataHandler(getStore().cache[cacheSet][id]);}
    }
}
// TODO DON'T OPTIMIZE UNLESS THERE'S AN ACTUAL PROBLEM YOU GOBLIN
function batchFetch(ids, variablesList, cacheSet, QLFunctionName, fetchDispatchType) {
    // TODO Check to see if this has already been fulfilled
    // TODO Check to see if we have already called the same batch fetch query (add a set in the cache?)
    // TODO Maybe also try to remove variables based on that
}
function batchForceFetch(ids, variablesList, cacheSet, QLFunctionName, fetchDispatchType) {
    return (dispatch) => {
        dispatch(setIsLoading());
        batchOverwriteFetch(ids, variablesList, cacheSet, QLFunctionName, fetchDispatchType, dispatch);
    };
}
function batchOverwriteFetch(ids, variablesList, cacheSet, QLFunctionName, fetchDispatchType, dispatch) {
    const profilePictureIndex = variablesList.indexOf("profilePicture");
    if (profilePictureIndex !== -1) {
        // alert("The variable list is requesting the profilePicture to be uploaded as well.");
        variablesList.splice(profilePictureIndex, 1);
        // Add
        if (!variablesList.includes("profileImagePath")) {
            alert("lmao you forgot to include the profile image path, I'll include it tho, no worries");
            variablesList = [
                ...variablesList,
                "profileImagePath"
            ]
        }
    }
    QL[QLFunctionName](ids, variablesList, (data) => {
        if (data.hasOwnProperty("items") && data.items && data.items.length) {
            if (profilePictureIndex !== -1) {
                for (let i = 0; i < data.items.length; i++) {
                    const item = data.items[i];
                    addProfilePictureToData(item, item.profileImagePath, (updatedData) => {
                        dispatch({
                            type: fetchDispatchType,
                            payload: updatedData
                        });
                    });

                }
            }
            else {
                for (let i = 0; i < data.items.length; i++) {
                    dispatch({
                        type: fetchDispatchType,
                        payload: data.items[i]
                    });
                }
            }
            dispatch(setIsNotLoading());
        }
        if (data.hasOwnProperty("unprocessedItems") && data.unprocessedItems) {
            // TODO Load it in again until you get the whole thing? Might be dangerous with large lists though...
            alert("We have unprocessed items in the batch get!");
        }
    }, (error) => {
        dispatch(setError(error));
        dispatch(setIsNotLoading());
    })
}
export function fetchClient(id, variablesList, dataHandler) {
    return fetch(id, variablesList, "clients", "getClient", "FETCH_CLIENT", dataHandler);
}
export function fetchTrainer(id, variablesList, dataHandler) {
    return fetch(id, variablesList, "trainers", "getTrainer", "FETCH_TRAINER", dataHandler);
}
export function fetchGym(id, variablesList, dataHandler) {
    return fetch(id, variablesList, "gyms", "getGym", "FETCH_GYM", dataHandler);
}
export function fetchWorkout(id, variablesList, dataHandler) {
    return fetch(id, variablesList, "workouts", "getWorkout", "FETCH_WORKOUT", dataHandler);
}
export function fetchReview(id, variablesList, dataHandler) {
    return fetch(id, variablesList, "reviews", "getReview", "FETCH_REVIEW", dataHandler);
}
export function fetchEvent(id, variablesList, dataHandler) {
    return fetch(id, variablesList, "events", "getEvent", "FETCH_EVENT", dataHandler);
}
export function fetchInvite(id, variablesList, dataHandler) {
    return fetch(id, variablesList, "invites", "getInvite", "FETCH_INVITE", dataHandler);
}
export function forceFetchClient(id, variablesList, dataHandler) {
    return forceFetch(id, variablesList, "clients", "getClient", "FETCH_CLIENT", dataHandler);
}
export function forceFetchTrainer(id, variablesList, dataHandler) {
    return forceFetch(id, variablesList, "trainers", "getTrainer", "FETCH_TRAINER", dataHandler);
}
export function forceFetchGym(id, variablesList, dataHandler) {
    return forceFetch(id, variablesList, "gyms", "getGym", "FETCH_GYM", dataHandler);
}
export function forceFetchWorkout(id, variablesList, dataHandler) {
    return forceFetch(id, variablesList, "workouts", "getWorkout", "FETCH_WORKOUT", dataHandler);
}
export function forceFetchReview(id, variablesList, dataHandler) {
    return forceFetch(id, variablesList, "reviews", "getReview", "FETCH_REVIEW", dataHandler);
}
export function forceFetchEvent(id, variablesList, dataHandler) {
    return forceFetch(id, variablesList, "events", "getEvent", "FETCH_EVENT", dataHandler);
}
export function forceFetchInvite(id, variablesList, dataHandler) {
    return forceFetch(id, variablesList, "invites", "getInvite", "FETCH_INVITE", dataHandler);
}
export function fetchClients(ids, variablesList) {

}
// TODO Consider how this might scale? Another LRU Cache here?
export function putClientQuery(queryString, queryResult) {
    return (dispatch) => {
        dispatch(putQuery(queryString, queryResult, "FETCH_CLIENT_QUERY"));
        // dispatch(setIsLoading());
        // TODO Should we take the time to put all the query clients into the cache as well? Is our cache hurting our performance?
    };
}
export function putTrainerQuery(queryString, queryResult) {
    return {
        type: "FETCH_TRAINER_QUERY",
        payload: {
            queryString,
            queryResult
        }
    };
}
export function putGymQuery(queryString, queryResult) {
    return {
        type: "FETCH_GYM_QUERY",
        payload: {
            queryString,
            queryResult
        }
    };
}
export function putWorkoutQuery(queryString, queryResult) {
    return {
        type: "FETCH_WORKOUT_QUERY",
        payload: {
            queryString,
            queryResult
        }
    };
}
export function putReviewQuery(queryString, queryResult) {
    return {
        type: "FETCH_REVIEW_QUERY",
        payload: {
            queryString,
            queryResult
        }
    };
}
export function putEventQuery(queryString, queryResult) {
    return {
        type: "FETCH_EVENT_QUERY",
        payload: {
            queryString,
            queryResult
        }
    };
}
export function putInviteQuery(queryString, queryResult) {
    return {
        type: "FETCH_INVITE_QUERY",
        payload: {
            queryString,
            queryResult
        }
    };
}
function putQuery(queryString, queryResult, actionType) {
    return {
        type: actionType,
        payload: {
            queryString,
            queryResult
        }
    };
}
export function putClient(client) {
    return {
        type: "FETCH_CLIENT",
        payload: client
    };
}
export function putTrainer(trainer) {
    return {
        type: "FETCH_TRAINER",
        payload: trainer
    };
}
export function putGym(gym) {
    return {
        type: "FETCH_GYM",
        payload: gym
    };
}
export function putWorkout(workout) {
    return {
        type: "FETCH_WORKOUT",
        payload: workout
    };
}
export function putReview(review) {
    return {
        type: "FETCH_REVIEW",
        payload: review
    };
}
export function putEvent(event) {
    return {
        type: "FETCH_EVENT",
        payload: event
    };
}
export function putInvite(invite) {
    return {
        type: "FETCH_INVITE",
        payload: invite
    };
}
