import { setIsNotLoading, setError, setIsLoading } from "./infoActions";
import QL from "../../GraphQL";
import { Storage } from "aws-amplify";
import defaultProfilePicture from "../../img/roundProfile.png";
import {switchReturnItemType} from "../../logic/ItemType";

function addProfilePictureToData(data, callback) {
    if (data && data.hasOwnProperty("profileImagePath")) {
        const imageKey = data.profileImagePath;
        if (imageKey) {
            Storage.get(imageKey).then((url) => {
                addProfilePicturesToData({
                    ...data,
                    profilePicture: url
                }, callback);
            }).catch((error) => {
                console.error("ERROR IN GETTING PROFILE IMAGE FOR USER");
                console.log("ERROR IN GETTING PROFILE IMAGE FOR USER");
                console.log(error);
                addProfilePicturesToData(data, callback);
            });
        }
        else {
            addProfilePicturesToData({
                ...data,
                profilePicture: defaultProfilePicture
            }, callback);
        }
    }
    else {
        addProfilePicturesToData({
            ...data,
            profilePicture: defaultProfilePicture
        }, callback);
    }
}
function addProfilePicturesToData(data, callback) {
    if (data && data.hasOwnProperty("profileImagePaths")) {
        const imagesKey = data.profileImagePaths;
        if (imagesKey) {
            const profilePictures = [];
            const len = imagesKey.length;
            for (let i = 0; i < len; i++) {
                const imageKey = imagesKey[i];
                Storage.get(imageKey).then((url) => {
                    // Successful
                    profilePictures.push(url);
                    if (profilePictures.length >= len) {
                        callback({
                            ...data,
                            profilePictures
                        });
                    }
                }).catch((error) => {
                    // Not successful
                    console.error("ERROR IN GETTING PROFILE IMAGE FOR USER");
                    console.error(error);
                    profilePictures.push(defaultProfilePicture);
                    if (profilePictures.length >= len) {
                        callback({
                            ...data,
                            profilePictures
                        });
                    }
                });
            }
        }
        else {
            callback({
                ...data,
                profilePictures: [defaultProfilePicture]
            });
        }
    }
    else {
        callback({
            ...data,
            profilePictures: [defaultProfilePicture]
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
            // console.log("Final filtered list is = " + JSON.stringify(variablesList));
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
    const profilePicturesIndex = variablesList.indexOf("profilePictures");
    if (profilePictureIndex !== -1) {
        // console.log("The variable list is requesting the profilePicture to be uploaded as well.");
        variablesList.splice(profilePictureIndex, 1);
        // Add
        if (!variablesList.includes("profileImagePath")) {
            console.error("lmao you forgot to include the profile image path, I'll include it tho, no worries");
            variablesList = [
                ...variablesList,
                "profileImagePath"
            ]
        }
    }
    if (profilePicturesIndex !== -1) {
        // console.log("The variable list is requesting the profilePicture to be uploaded as well.");
        variablesList.splice(profilePicturesIndex, 1);
        // Add
        if (!variablesList.includes("profileImagePaths")) {
            console.error("lmao you forgot to include the profile image path, I'll include it tho, no worries");
            variablesList = [
                ...variablesList,
                "profileImagePaths"
            ]
        }
    }
    if (variablesList.length > 0) {
        if (!variablesList.includes("id")) {
            variablesList = [...variablesList, "id"];
        }
        if (!variablesList.includes("item_type")) {
            variablesList = [...variablesList, "item_type"];
        }
        QL[QLFunctionName](id, variablesList, (data) => {
            // console.log("Successfully retrieved the QL info");
            if (profilePictureIndex !== -1) {
                // console.log("Adding profile image to the data");
                addProfilePictureToData(data, (updatedData) => {
                    // console.log("Dispatching the profile image + data");
                    dispatch({
                        type: fetchDispatchType,
                        payload: {
                            id,
                            data: updatedData
                        }
                    });
                    dispatch(setIsNotLoading());
                    if (dataHandler) { dataHandler(getStore().cache[cacheSet][id]);}
                });
            }
            else {
                // console.log("Just dispatching the normal data");
                dispatch({
                    type: fetchDispatchType,
                    payload: {
                        id,
                        data
                    }
                });
                dispatch(setIsNotLoading());
                if (dataHandler) { dataHandler(getStore().cache[cacheSet][id]);}
            }
        }, (error) => {
            console.error("Error in retrieval");
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    }
    else {
        dispatch({
            type: fetchDispatchType,
            payload: {
                id,
                data: null
            }
        });
        dispatch(setIsNotLoading());
        if (dataHandler) { dataHandler(getStore().cache[cacheSet][id]);}
    }
}
// TODO THIS'LL BEE SUPER COOL TO DO IN THE FUTURE
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
        // console.log("The variable list is requesting the profilePicture to be uploaded as well.");
        variablesList.splice(profilePictureIndex, 1);
        // Add
        if (!variablesList.includes("profileImagePath")) {
            console.error("lmao you forgot to include the profile image path, I'll include it tho, no worries");
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
                    addProfilePictureToData(item, (updatedData) => {
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
            console.error("We have unprocessed items in the batch get!");
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
export function fetchChallenge(id, variablesList, dataHandler) {
    return fetch(id, variablesList, "challenges", "getChallenge", "FETCH_CHALLENGE", dataHandler);
}
export function fetchInvite(id, variablesList, dataHandler) {
    return fetch(id, variablesList, "invites", "getInvite", "FETCH_INVITE", dataHandler);
}
export function fetchPost(id, variablesList, dataHandler) {
    return fetch(id, variablesList, "posts", "getPost", "FETCH_POST", dataHandler);
}
export function fetchGroup(id, variablesList, dataHandler) {
    return fetch(id, variablesList, "groups", "getGroup", "FETCH_GROUP", dataHandler);
}
export function fetchComment(id, variablesList, dataHandler) {
    return fetch(id, variablesList, "comments", "getComment", "FETCH_COMMENT", dataHandler);
}
export function fetchSponsor(id, variablesList, dataHandler) {
    return fetch(id, variablesList, "sponsors", "getSponsor", "FETCH_SPONSOR", dataHandler);
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
export function forceFetchChallenge(id, variablesList, dataHandler) {
    return forceFetch(id, variablesList, "challenges", "getChallenge", "FETCH_CHALLENGE", dataHandler);
}
export function forceFetchInvite(id, variablesList, dataHandler) {
    return forceFetch(id, variablesList, "invites", "getInvite", "FETCH_INVITE", dataHandler);
}
export function forceFetchPost(id, variablesList, dataHandler) {
    return forceFetch(id, variablesList, "posts", "getPost", "FETCH_POST", dataHandler);
}
export function forceFetchGroup(id, variablesList, dataHandler) {
    return forceFetch(id, variablesList, "groups", "getGroup", "FETCH_GROUP", dataHandler);
}
export function forceFetchComment(id, variablesList, dataHandler) {
    return forceFetch(id, variablesList, "comments", "getComment", "FETCH_COMMENT", dataHandler);
}
export function forceFetchSponsor(id, variablesList, dataHandler) {
    return forceFetch(id, variablesList, "sponsors", "getSponsor", "FETCH_SPONSOR", dataHandler);
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
export function putChallengeQuery(queryString, queryResult) {
    return {
        type: "FETCH_CHALLENGE_QUERY",
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
export function putPostQuery(queryString, queryResult) {
    return {
        type: "FETCH_POST_QUERY",
        payload: {
            queryString,
            queryResult
        }
    };
}
export function putGroupQuery(queryString, queryResult) {
    return {
        type: "FETCH_GROUP_QUERY",
        payload: {
            queryString,
            queryResult
        }
    };
}
export function putCommentQuery(queryString, queryResult) {
    return {
        type: "FETCH_COMMENT_QUERY",
        payload: {
            queryString,
            queryResult
        }
    };
}
export function putSponsorQuery(queryString, queryResult) {
    return {
        type: "FETCH_SPONSOR_QUERY",
        payload: {
            queryString,
            queryResult
        }
    };
}
export function clearClientQuery() {
    return {
        type: "CLEAR_CLIENT_QUERY",
    };
}
export function clearTrainerQuery() {
    return {
        type: "CLEAR_TRAINER_QUERY",
    };
}
export function clearGymQuery() {
    return {
        type: "CLEAR_GYM_QUERY",
    };
}
export function clearWorkoutQuery() {
    return {
        type: "CLEAR_WORKOUT_QUERY",
    };
}
export function clearReviewQuery() {
    return {
        type: "CLEAR_REVIEW_QUERY",
    };
}
export function clearEventQuery() {
    return {
        type: "CLEAR_EVENT_QUERY",
    };
}
export function clearChallengeQuery() {
    return {
        type: "CLEAR_CHALLENGE_QUERY",
    };
}
export function clearInviteQuery() {
    return {
        type: "CLEAR_INVITE_QUERY",
    };
}
export function clearPostQuery() {
    return {
        type: "CLEAR_POST_QUERY",
    };
}
export function clearGroupQuery() {
    return {
        type: "CLEAR_GROUP_QUERY",
    };
}
export function clearCommentQuery() {
    return {
        type: "CLEAR_COMMENT_QUERY",
    };
}
export function clearSponsorQuery() {
    return {
        type: "CLEAR_SPONSOR_QUERY",
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
    if (client && client.id) {
        return {
            type: "FETCH_CLIENT",
            payload: {
                id: client.id,
                data: client
            }
        };
    }
    return null;
}
export function putTrainer(trainer) {
    if (trainer && trainer.id) {
        return {
            type: "FETCH_TRAINER",
            payload: {
                id: trainer.id,
                data: trainer
            }
        };
    }
    return null;
}
export function putGym(gym) {
    if (gym && gym.id) {
        return {
            type: "FETCH_GYM",
            payload: {
                id: gym.id,
                data: gym
            }
        };
    }
    return null;
}
export function putWorkout(workout) {
    if (workout && workout.id) {
        return {
            type: "FETCH_WORKOUT",
            payload: {
                id: workout.id,
                data: workout
            }
        };
    }
    return null;
}
export function putReview(review) {
    if (review && review.id) {
        return {
            type: "FETCH_REVIEW",
            payload: {
                id: review.id,
                data: review
            }
        };
    }
    return null;
}
export function putEvent(event) {
    if (event && event.id) {
        return {
            type: "FETCH_EVENT",
            payload: {
                id: event.id,
                data: event
            }
        };
    }
    return null;
}
export function putChallenge(challenge) {
    if (challenge && challenge.id) {
        return {
            type: "FETCH_CHALLENGE",
            payload: {
                id: challenge.id,
                data: challenge
            }
        };
    }
    return null;
}
export function putInvite(invite) {
    if (invite && invite.id) {
        return {
            type: "FETCH_INVITE",
            payload: {
                id: invite.id,
                data: invite
            }
        };
    }
    return null;
}
export function putPost(post) {
    if (post && post.id) {
        return {
            type: "FETCH_POST",
            payload: {
                id: post.id,
                data: post
            }
        };
    }
    return null;
}
export function putGroup(group) {
    if (group && group.id) {
        return {
            type: "FETCH_GROUP",
            payload: {
                id: group.id,
                data: group
            }
        };
    }
    return null;
}
export function putComment(comment) {
    if (comment && comment.id) {
        return {
            type: "FETCH_COMMENT",
            payload: {
                id: comment.id,
                data: comment
            }
        };
    }
    return null;
}
export function putSponsor(sponsor) {
    if (sponsor && sponsor.id) {
        return {
            type: "FETCH_SPONSOR",
            payload: {
                id: sponsor.id,
                data: sponsor
            }
        };
    }
    return null;
}
export function getCache(itemType, getStore) {
    const cache = getStore().cache;
    return switchReturnItemType(itemType, cache.clients, cache.trainers, cache.gyms, cache.workouts, cache.reviews,
        cache.events, cache.challenges, cache.invites, cache.posts, cache.groups, cache.comments, cache.sponsors, "Retrieve cache not implemented");
}
export function getQueryCache(itemType, getStore) {
    const cache = getStore().cache;
    return switchReturnItemType(itemType, cache.clientQueries, cache.trainerQueries, cache.gymQueries, cache.workoutQueries,
        cache.reviewQueries, cache.eventQueries, cache.challengeQueries, cache.inviteQueries, cache.postQueries, cache.groupQueries, cache.commentQueries, cache.sponsorQueries,
        "Retrieve query cache not implemented");
}
export function getPutItemFunction(itemType) {
    return switchReturnItemType(itemType, putClient, putTrainer, putGym, putWorkout, putReview, putEvent, putChallenge,
        putPost, putGroup, putComment, putSponsor, "Retrieve put item function item type not implemented");
}
export function getPutQueryFunction(itemType) {
    return switchReturnItemType(itemType, putClientQuery, putTrainerQuery, putGymQuery, putWorkoutQuery, putReviewQuery,
        putEventQuery, putChallengeQuery, putInviteQuery, putPostQuery, putGroupQuery, putCommentQuery, putSponsorQuery, "Retrieve Put Query Function not implemented");
}
export function getClearQueryFunction(itemType) {
    return switchReturnItemType(itemType, clearClientQuery, clearTrainerQuery, clearGymQuery, clearWorkoutQuery, clearReviewQuery,
        clearEventQuery, clearChallengeQuery, clearInviteQuery, clearPostQuery, clearGroupQuery, clearCommentQuery, clearSponsorQuery, "Retrieve Clear Query Function not implemented");
}