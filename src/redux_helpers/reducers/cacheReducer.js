// import info, { infoFunctions, infoReducer } from './infoReducer';

// This is where we will store all the retrieved database items and use a LRU cache to rid them if necessary
const FETCH_CLIENT = 'FETCH_CLIENT';
const FETCH_TRAINER = 'FETCH_TRAINER';
const FETCH_GYM = 'FETCH_GYM';
const FETCH_WORKOUT = 'FETCH_WORKOUT';
const FETCH_REVIEW = 'FETCH_REVIEW';
const FETCH_EVENT = 'FETCH_EVENT';
const FETCH_CHALLENGE = 'FETCH_CHALLENGE';
const FETCH_INVITE = 'FETCH_INVITE';
const FETCH_POST = 'FETCH_POST';

const FETCH_CLIENT_QUERY = 'FETCH_CLIENT_QUERY';
const FETCH_TRAINER_QUERY = 'FETCH_TRAINER_QUERY';
const FETCH_GYM_QUERY = 'FETCH_GYM_QUERY';
const FETCH_WORKOUT_QUERY = 'FETCH_WORKOUT_QUERY';
const FETCH_REVIEW_QUERY = 'FETCH_REVIEW_QUERY';
const FETCH_EVENT_QUERY = 'FETCH_EVENT_QUERY';
const FETCH_CHALLENGE_QUERY = 'FETCH_CHALLENGE_QUERY';
const FETCH_INVITE_QUERY = 'FETCH_INVITE_QUERY';
const FETCH_POST_QUERY = 'FETCH_POST_QUERY';

const CLEAR_CLIENT_QUERY = 'CLEAR_CLIENT_QUERY';
const CLEAR_TRAINER_QUERY = 'CLEAR_TRAINER_QUERY';
const CLEAR_GYM_QUERY = 'CLEAR_GYM_QUERY';
const CLEAR_WORKOUT_QUERY = 'CLEAR_WORKOUT_QUERY';
const CLEAR_REVIEW_QUERY = 'CLEAR_REVIEW_QUERY';
const CLEAR_EVENT_QUERY = 'CLEAR_EVENT_QUERY';
const CLEAR_CHALLENGE_QUERY = 'CLEAR_CHALLENGE_QUERY';
const CLEAR_INVITE_QUERY = 'CLEAR_INVITE_QUERY';
const CLEAR_POST_QUERY = 'CLEAR_POST_QUERY';

// TODO Play around with these values maybe? How do we decide this?
const clientCacheSize = 100;
const trainerCacheSize = 100;
const gymCacheSize = 100;
const workoutCacheSize = 100;
const reviewCacheSize = 100;
const eventCacheSize = 2000;
const challengeCacheSize = 2000;
const inviteCacheSize = 100;
const postCacheSize = 2000;

// TODO The query cache sizes might be important if the user is searching for a lot
const clientQueryCacheSize = 0;
const trainerQueryCacheSize = 0;
const gymQueryCacheSize = 0;
const workoutQueryCacheSize = 0;
const reviewQueryCacheSize = 0;
const eventQueryCacheSize = 10;
const challengeQueryCacheSize = 0;
const inviteQueryCacheSize = 0;
const postQueryCacheSize = 0;

const initialState = {
    // ID --> DatabaseObject
    clients: {},
    trainers: {},
    gyms: {},
    workouts: {},
    reviews: {},
    events: {},
    challenges: {},
    invites: {},
    posts: {},

    // List of IDs in order of least recently used
    clientLRUHandler: [],
    trainerLRUHandler: [],
    gymLRUHandler: [],
    workoutLRUHandler: [],
    reviewLRUHandler: [],
    eventLRUHandler: [],
    challengeLRUHandler: [],
    inviteLRUHandler: [],
    postLRUHandler: [],

    // Cached queries.
    clientQueries: {},
    trainerQueries: {},
    gymQueries: {},
    workoutQueries: {},
    reviewQueries: {},
    eventQueries: {},
    challengeQueries: {},
    inviteQueries: {},
    postQueries: {},

    // TODO Include LRU Handlers for these as well!
    // TODO Actually use these
    clientQueryLRUHandler: [],
    trainerQueryLRUHandler: [],
    gymQueryLRUHandler: [],
    workoutQueryLRUHandler: [],
    reviewQueryLRUHandler: [],
    eventQueryLRUHandler: [],
    challengeQueryLRUHandler: [],
    inviteQueryLRUHandler: [],
    postQueryLRUHandler: [],
};

export default (state = initialState, action) => {
    // if (infoFunctions[action.type]) {
    //     return infoReducer(state, action);
    // }
    switch (action.type) {
        case FETCH_CLIENT:
            // TODO Also make sure that the item to get also has all the attributes we desire?
            state = addObjectToCache(state, "clients", clientCacheSize, "clientLRUHandler", action.payload);
            break;
        case FETCH_TRAINER:
            state = addObjectToCache(state, "trainers", trainerCacheSize, "trainerLRUHandler", action.payload);
            break;
        case FETCH_GYM:
            state = addObjectToCache(state, "gyms", gymCacheSize, "gymLRUHandler", action.payload);
            break;
        case FETCH_WORKOUT:
            state = addObjectToCache(state, "workouts", workoutCacheSize, "workoutLRUHandler", action.payload);
            break;
        case FETCH_REVIEW:
            state = addObjectToCache(state, "reviews", reviewCacheSize, "reviewLRUHandler", action.payload);
            break;
        case FETCH_EVENT:
            state = addObjectToCache(state, "events", eventCacheSize, "eventLRUHandler", action.payload);
            break;
        case FETCH_CHALLENGE:
            state = addObjectToCache(state, "challenges", challengeCacheSize, "challengeLRUHandler", action.payload);
            break;
        case FETCH_INVITE:
            state = addObjectToCache(state, "invites", inviteCacheSize, "inviteLRUHandler", action.payload);
            break;
        case FETCH_POST:
            state = addObjectToCache(state, "posts", postCacheSize, "postLRUHandler", action.payload);
            break;
            // TODO Connect these to LRU Handlers... important especially as we scale
        case FETCH_CLIENT_QUERY:
            // state = addObjectToCache(state, "clientQueries", clientQueryCacheSize, "clientQueryLRUHandler", action.payload);
            state = {
                ...state,
                clientQueries: {
                    ...state.clientQueries,
                    [action.payload.queryString]: action.payload.queryResult
                }
            };
            break;
        case FETCH_TRAINER_QUERY:
            state = {
                ...state,
                trainerQueries: {
                    ...state.trainerQueries,
                    [action.payload.queryString]: action.payload.queryResult
                }
            };
            break;
        case FETCH_GYM_QUERY:
            state = {
                ...state,
                gymQueries: {
                    ...state.gymQueries,
                    [action.payload.queryString]: action.payload.queryResult
                }
            };
            break;
        case FETCH_WORKOUT_QUERY:
            state = {
                ...state,
                workoutQueries: {
                    ...state.workoutQueries,
                    [action.payload.queryString]: action.payload.queryResult
                }
            };
            break;
        case FETCH_REVIEW_QUERY:
            state = {
                ...state,
                reviewQueries: {
                    ...state.reviewQueries,
                    [action.payload.queryString]: action.payload.queryResult
                }
            };
            break;
        case FETCH_EVENT_QUERY:
            state = {
                ...state,
                eventQueries: {
                    ...state.eventQueries,
                    [action.payload.queryString]: action.payload.queryResult
                }
            };
            break;
        case FETCH_CHALLENGE_QUERY:
            state = {
                ...state,
                challengeQueries: {
                    ...state.challengeQueries,
                    [action.payload.queryString]: action.payload.queryResult
                }
            };
            break;
        case FETCH_INVITE_QUERY:
            state = {
                ...state,
                inviteQueries: {
                    ...state.inviteQueries,
                    [action.payload.queryString]: action.payload.queryResult
                }
            };
            break;
        case FETCH_POST_QUERY:
            state = {
                ...state,
                postQueries: {
                    ...state.postQueries,
                    [action.payload.queryString]: action.payload.queryResult
                }
            };
            break;
        case CLEAR_CLIENT_QUERY:
            state = {
                ...state,
                clientQueries: {}
            };
            break;
        case CLEAR_TRAINER_QUERY:
            state = {
                ...state,
                trainerQueries: {}
            };
            break;
        case CLEAR_GYM_QUERY:
            state = {
                ...state,
                gymQueries: {}
            };
            break;
        case CLEAR_WORKOUT_QUERY:
            state = {
                ...state,
                workoutQueries: {}
            };
            break;
        case CLEAR_EVENT_QUERY:
            state = {
                ...state,
                eventQueries: {}
            };
            break;
        case CLEAR_CHALLENGE_QUERY:
            state = {
                ...state,
                eventQueries: {}
            };
            break;
        case CLEAR_INVITE_QUERY:
            state = {
                ...state,
                inviteQueries: {}
            };
            break;
        case CLEAR_REVIEW_QUERY:
            state = {
                ...state,
                reviewQueries: {}
            };
            break;
        case CLEAR_POST_QUERY:
            state = {
                ...state,
                postQueries: {}
            };
            break;
        default:
            state = {
                ...state
            };
            break;
    }
    return state;
};

function addObjectToCache(state, cacheName, maxCacheSize, LRUHandlerName, object) {
    // TODO Check to see that this is all well-formed?
    if (!object.id) {
        console.log("Adding object to cache does not include the id!!!");
    }
    if (!state[cacheName][object.id]) {
        state = {
            ...state
        };
        const cache = { ...state[cacheName] };
        const LRUHandler = [ ...state[LRUHandlerName] ];
        LRUHandler.unshift(object.id);
        cache[object.id] = object.data;
        // TODO If the ID is not already in the cache
        if (LRUHandler.length >= maxCacheSize) {
            // Then we have to pop something out
            delete cache[LRUHandler.pop()];
        }
        state[cacheName] = cache;
        state[LRUHandlerName] = LRUHandler;
        return state;
    }
    else {
        // TODO Update the object
        return updateReadObject(state, cacheName, LRUHandlerName, object);
    }
}

function updateReadObject(state, cacheName, LRUHandlerName, object) {
    state = {
        ...state
    };
    let LRUHandler = [...state[LRUHandlerName]];
    let index = LRUHandler.indexOf(object.id);
    if (index > -1) {
        LRUHandler.splice(index, 1);
    }
    LRUHandler.unshift(object.id);
    state[LRUHandlerName] = LRUHandler;
    // Then we update the object with the additional fields that it may have (if this came from the other function)
    state[cacheName][object.id] = {
        ...state[cacheName][object.id],
        ...object.data
    };
    return state;
}
