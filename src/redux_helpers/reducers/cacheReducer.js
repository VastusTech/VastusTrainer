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
const FETCH_GROUP = 'FETCH_GROUP';
const FETCH_COMMENT = 'FETCH_COMMENT';
const FETCH_SPONSOR = 'FETCH_SPONSOR';

const REMOVE_CLIENT =    'REMOVE_CLIENT';
const REMOVE_TRAINER =   'REMOVE_TRAINER';
const REMOVE_GYM =       'REMOVE_GYM';
const REMOVE_WORKOUT =   'REMOVE_WORKOUT';
const REMOVE_REVIEW =    'REMOVE_REVIEW';
const REMOVE_EVENT =     'REMOVE_EVENT';
const REMOVE_CHALLENGE = 'REMOVE_CHALLENGE';
const REMOVE_INVITE =    'REMOVE_INVITE';
const REMOVE_POST =      'REMOVE_POST';
const REMOVE_GROUP =     'REMOVE_GROUP';
const REMOVE_COMMENT =   'REMOVE_COMMENT';
const REMOVE_SPONSOR =   'REMOVE_SPONSOR';

const FETCH_CLIENT_QUERY = 'FETCH_CLIENT_QUERY';
const FETCH_TRAINER_QUERY = 'FETCH_TRAINER_QUERY';
const FETCH_GYM_QUERY = 'FETCH_GYM_QUERY';
const FETCH_WORKOUT_QUERY = 'FETCH_WORKOUT_QUERY';
const FETCH_REVIEW_QUERY = 'FETCH_REVIEW_QUERY';
const FETCH_EVENT_QUERY = 'FETCH_EVENT_QUERY';
const FETCH_CHALLENGE_QUERY = 'FETCH_CHALLENGE_QUERY';
const FETCH_INVITE_QUERY = 'FETCH_INVITE_QUERY';
const FETCH_POST_QUERY = 'FETCH_POST_QUERY';
const FETCH_GROUP_QUERY = 'FETCH_GROUP_QUERY';
const FETCH_COMMENT_QUERY = 'FETCH_COMMENT_QUERY';
const FETCH_SPONSOR_QUERY = 'FETCH_SPONSOR_QUERY';

const CLEAR_NORMALIZED_CLIENT_QUERY =    'CLEAR_NORMALIZED_CLIENT_QUERY';
const CLEAR_NORMALIZED_TRAINER_QUERY =   'CLEAR_NORMALIZED_TRAINER_QUERY';
const CLEAR_NORMALIZED_GYM_QUERY =       'CLEAR_NORMALIZED_GYM_QUERY';
const CLEAR_NORMALIZED_WORKOUT_QUERY =   'CLEAR_NORMALIZED_WORKOUT_QUERY';
const CLEAR_NORMALIZED_REVIEW_QUERY =    'CLEAR_NORMALIZED_REVIEW_QUERY';
const CLEAR_NORMALIZED_EVENT_QUERY =     'CLEAR_NORMALIZED_EVENT_QUERY';
const CLEAR_NORMALIZED_CHALLENGE_QUERY = 'CLEAR_NORMALIZED_CHALLENGE_QUERY';
const CLEAR_NORMALIZED_INVITE_QUERY =    'CLEAR_NORMALIZED_INVITE_QUERY';
const CLEAR_NORMALIZED_POST_QUERY =      'CLEAR_NORMALIZED_POST_QUERY';
const CLEAR_NORMALIZED_GROUP_QUERY =     'CLEAR_NORMALIZED_GROUP_QUERY';
const CLEAR_NORMALIZED_COMMENT_QUERY =   'CLEAR_NORMALIZED_COMMENT_QUERY';
const CLEAR_NORMALIZED_SPONSOR_QUERY =   'CLEAR_NORMALIZED_SPONSOR_QUERY';

const CLEAR_CLIENT_QUERY = 'CLEAR_CLIENT_QUERY';
const CLEAR_TRAINER_QUERY = 'CLEAR_TRAINER_QUERY';
const CLEAR_GYM_QUERY = 'CLEAR_GYM_QUERY';
const CLEAR_WORKOUT_QUERY = 'CLEAR_WORKOUT_QUERY';
const CLEAR_REVIEW_QUERY = 'CLEAR_REVIEW_QUERY';
const CLEAR_EVENT_QUERY = 'CLEAR_EVENT_QUERY';
const CLEAR_CHALLENGE_QUERY = 'CLEAR_CHALLENGE_QUERY';
const CLEAR_INVITE_QUERY = 'CLEAR_INVITE_QUERY';
const CLEAR_POST_QUERY = 'CLEAR_POST_QUERY';
const CLEAR_GROUP_QUERY = 'CLEAR_GROUP_QUERY';
const CLEAR_COMMENT_QUERY = 'CLEAR_COMMENT_QUERY';
const CLEAR_SPONSOR_QUERY = 'CLEAR_SPONSOR_QUERY';

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
const groupCacheSize = 100;
const commentCacheSize = 1000;
const sponsorCacheSize = 100;

// TODO The query cache sizes might be important if the user is searching for a lot
const clientQueryCacheSize = 5;
const trainerQueryCacheSize = 5;
const gymQueryCacheSize = 5;
const workoutQueryCacheSize = 5;
const reviewQueryCacheSize = 5;
const eventQueryCacheSize = 10;
const challengeQueryCacheSize = 5;
const inviteQueryCacheSize = 5;
const postQueryCacheSize = 5;
const groupQueryCacheSize = 5;
const commentQueryCacheSize = 5;
const sponsorQueryCacheSize = 5;

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
    groups: {},
    comments: {},
    sponsors: {},

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
    groupLRUHandler: [],
    commentLRUHandler: [],
    sponsorLRUHandler: [],

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
    groupQueries: {},
    commentQueries: {},
    sponsorQueries: {},

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
    groupQueryLRUHandler: [],
    commentQueryLRUHandler: [],
    sponsorQueryLRUHandler: [],
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
        case FETCH_GROUP:
            state = addObjectToCache(state, "groups", groupCacheSize, "groupLRUHandler", action.payload);
            break;
        case FETCH_COMMENT:
            state = addObjectToCache(state, "comments", commentCacheSize, "commentLRUHandler", action.payload);
            break;
        case FETCH_SPONSOR:
            state = addObjectToCache(state, "sponsors", sponsorCacheSize, "sponsorLRUHandler", action.payload);
            break;
        case REMOVE_CLIENT:
            state = removeItem(state, "clients", action.payload);
            break;
        case REMOVE_TRAINER:
            state = removeItem(state, "trainers", action.payload);
            break;
        case REMOVE_GYM:
            state = removeItem(state, "gyms", action.payload);
            break;
        case REMOVE_WORKOUT:
            state = removeItem(state, "workouts", action.payload);
            break;
        case REMOVE_REVIEW:
            state = removeItem(state, "reviews", action.payload);
            break;
        case REMOVE_EVENT:
            state = removeItem(state, "events", action.payload);
            break;
        case REMOVE_CHALLENGE:
            state = removeItem(state, "challenges", action.payload);
            break;
        case REMOVE_INVITE:
            state = removeItem(state, "invites", action.payload);
            break;
        case REMOVE_POST:
            state = removeItem(state, "posts", action.payload);
            break;
        case REMOVE_GROUP:
            state = removeItem(state, "groups", action.payload);
            break;
        case REMOVE_COMMENT:
            state = removeItem(state, "comments", action.payload);
            break;
        case REMOVE_SPONSOR:
            state = removeItem(state, "sponsors", action.payload);
            break;
            // Connected these to LRU Handlers... important especially as we scale
        case FETCH_CLIENT_QUERY:
            state = addQueryToCache(state, "clientQueries", clientQueryCacheSize, "clientQueryLRUHandler", action.payload.normalizedQueryString, action.payload.nextToken, action.payload.queryResult);
            break;
        case FETCH_TRAINER_QUERY:
            state = addQueryToCache(state, "trainerQueries", trainerQueryCacheSize, "trainerQueryLRUHandler", action.payload.normalizedQueryString, action.payload.nextToken, action.payload.queryResult);
            break;
        case FETCH_GYM_QUERY:
            state = addQueryToCache(state, "gymQueries", gymQueryCacheSize, "gymQueryLRUHandler", action.payload.normalizedQueryString, action.payload.nextToken, action.payload.queryResult);
            break;
        case FETCH_WORKOUT_QUERY:
            state = addQueryToCache(state, "workoutQueries", workoutQueryCacheSize, "workoutQueryLRUHandler", action.payload.normalizedQueryString, action.payload.nextToken, action.payload.queryResult);
            break;
        case FETCH_REVIEW_QUERY:
            state = addQueryToCache(state, "reviewQueries", reviewQueryCacheSize, "reviewQueryLRUHandler", action.payload.normalizedQueryString, action.payload.nextToken, action.payload.queryResult);
            break;
        case FETCH_EVENT_QUERY:
            state = addQueryToCache(state, "eventQueries", eventQueryCacheSize, "eventQueryLRUHandler", action.payload.normalizedQueryString, action.payload.nextToken, action.payload.queryResult);
            break;
        case FETCH_CHALLENGE_QUERY:
            state = addQueryToCache(state, "challengeQueries", challengeQueryCacheSize, "challengeQueryLRUHandler", action.payload.normalizedQueryString, action.payload.nextToken, action.payload.queryResult);
            break;
        case FETCH_INVITE_QUERY:
            state = addQueryToCache(state, "inviteQueries", inviteQueryCacheSize, "inviteQueryLRUHandler", action.payload.normalizedQueryString, action.payload.nextToken, action.payload.queryResult);
            break;
        case FETCH_POST_QUERY:
            state = addQueryToCache(state, "postQueries", postQueryCacheSize, "postQueryLRUHandler", action.payload.normalizedQueryString, action.payload.nextToken, action.payload.queryResult);
            break;
        case FETCH_GROUP_QUERY:
            state = addQueryToCache(state, "groupQueries", groupQueryCacheSize, "groupQueryLRUHandler", action.payload.normalizedQueryString, action.payload.nextToken, action.payload.queryResult);
            break;
        case FETCH_COMMENT_QUERY:
            state = addQueryToCache(state, "commentQueries", commentQueryCacheSize, "commentQueryLRUHandler", action.payload.normalizedQueryString, action.payload.nextToken, action.payload.queryResult);
            break;
        case FETCH_SPONSOR_QUERY:
            state = addQueryToCache(state, "sponsorQueries", sponsorQueryCacheSize, "sponsorQueryLRUHandler", action.payload.normalizedQueryString, action.payload.nextToken, action.payload.queryResult);
            break;
        case CLEAR_NORMALIZED_CLIENT_QUERY:
            state = clearNormalizedCache(state, "clientQueries", action.payload);
            break;
        case CLEAR_NORMALIZED_TRAINER_QUERY:
            state = clearNormalizedCache(state, "trainerQueries", action.payload);
            break;
        case CLEAR_NORMALIZED_GYM_QUERY:
            state = clearNormalizedCache(state, "gymQueries", action.payload);
            break;
        case CLEAR_NORMALIZED_WORKOUT_QUERY:
            state = clearNormalizedCache(state, "workoutQueries", action.payload);
            break;
        case CLEAR_NORMALIZED_REVIEW_QUERY:
            state = clearNormalizedCache(state, "reviewQueries", action.payload);
            break;
        case CLEAR_NORMALIZED_EVENT_QUERY:
            state = clearNormalizedCache(state, "eventQueries", action.payload);
            break;
        case CLEAR_NORMALIZED_CHALLENGE_QUERY:
            state = clearNormalizedCache(state, "challengeQueries", action.payload);
            break;
        case CLEAR_NORMALIZED_INVITE_QUERY:
            state = clearNormalizedCache(state, "inviteQueries", action.payload);
            break;
        case CLEAR_NORMALIZED_POST_QUERY:
            state = clearNormalizedCache(state, "postQueries", action.payload);
            break;
        case CLEAR_NORMALIZED_GROUP_QUERY:
            state = clearNormalizedCache(state, "groupQueries", action.payload);
            break;
        case CLEAR_NORMALIZED_COMMENT_QUERY:
            state = clearNormalizedCache(state, "commentQueries", action.payload);
            break;
        case CLEAR_NORMALIZED_SPONSOR_QUERY:
            state = clearNormalizedCache(state, "sponsorQueries", action.payload);
            break;
        case CLEAR_CLIENT_QUERY:
            state = clearCache(state, "clientQueries");
            break;
        case CLEAR_TRAINER_QUERY:
            state = clearCache(state, "trainerQueries");
            break;
        case CLEAR_GYM_QUERY:
            state = clearCache(state, "gymQueries");
            break;
        case CLEAR_WORKOUT_QUERY:
            state = clearCache(state, "workoutQueries");
            break;
        case CLEAR_REVIEW_QUERY:
            state = clearCache(state, "reviewQueries");
            break;
        case CLEAR_EVENT_QUERY:
            state = clearCache(state, "eventQueries");
            break;
        case CLEAR_CHALLENGE_QUERY:
            state = clearCache(state, "challengeQueries");
            break;
        case CLEAR_INVITE_QUERY:
            state = clearCache(state, "inviteQueries");
            break;
        case CLEAR_POST_QUERY:
            state = clearCache(state, "postQueries");
            break;
        case CLEAR_GROUP_QUERY:
            state = clearCache(state, "groupQueries");
            break;
        case CLEAR_COMMENT_QUERY:
            state = clearCache(state, "commentQueries");
            break;
        case CLEAR_SPONSOR_QUERY:
            state = clearCache(state, "sponsorQueries");
            break;
        default:
            state = {
                ...state
            };
            break;
    }
    return state;
};

function addQueryToCache(state, cacheName, maxCacheSize, LRUHandlerName, normalizedQueryString, nextToken, queryResult) {
    state = {
        ...state
    };
    if (!state[cacheName][normalizedQueryString]) {
        state[cacheName][normalizedQueryString] = {};
    }
    if (!state[cacheName][normalizedQueryString][nextToken]) {
        // It's not in the cache yet
        const cache = state[cacheName][normalizedQueryString];
        const LRUHandler = state[LRUHandlerName];
        LRUHandler.unshift({normalizedQueryString, nextToken});
        cache[nextToken] = queryResult;
        if (LRUHandler.length >= maxCacheSize) {
            // Then we have to pop something out
            const entry = LRUHandler.pop();
            delete state[cacheName][entry.normalizedQueryString][entry.nextToken];
        }
        return state;
    }
    else {
        // Update the object
        let LRUHandler = state[LRUHandlerName];
        let addingEntry = {normalizedQueryString, nextToken};
        let index = -1;
        for (let i = 0; i < LRUHandler.length; i++) {
            const entry = LRUHandler[i];
            if (entry.normalizedQueryString === normalizedQueryString && entry.nextToken === nextToken) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            LRUHandler.splice(index, 1);
        }
        LRUHandler.unshift(addingEntry);
        // Then we update the object with the additional fields that it may have (if this came from the other function)
        state[cacheName][normalizedQueryString][nextToken] = queryResult;
        return state;
    }
}
function addObjectToCache(state, cacheName, maxCacheSize, LRUHandlerName, object) {
    // TODO Check to see that this is all well-formed?
    if (!object.id) {
        console.error("Adding object to cache does not include the id!!!");
    }
    state = {
        ...state
    };
    if (!state[cacheName][object.id]) {
        const cache = state[cacheName];
        const LRUHandler = state[LRUHandlerName];
        LRUHandler.unshift(object.id);
        cache[object.id] = object.data;
        if (LRUHandler.length >= maxCacheSize) {
            // Then we have to pop something out
            delete cache[LRUHandler.pop()];
        }
        return state;
    }
    else {
        // Update the object
        let LRUHandler = state[LRUHandlerName];
        let index = LRUHandler.indexOf(object.id);
        if (index > -1) {
            LRUHandler.splice(index, 1);
        }
        LRUHandler.unshift(object.id);
        // Then we update the object with the additional fields that it may have (if this came from the other function)
        state[cacheName][object.id] = {
            ...state[cacheName][object.id],
            ...object.data
        };
        return state;
    }
}
function removeItem(state, cacheName, id) {
    return {
        ...state,
        [cacheName]: {
            ...state[cacheName],
            [id]: null
        }
    };
}
function clearCache(state, cacheName) {
    return {
        ...state,
        [cacheName]: {}
    }
}
function clearNormalizedCache(state, cacheName, normalizedQuery) {
    return {
        ...state,
        [cacheName]: {
            ...state[cacheName],
            [normalizedQuery]: {}
        }
    }
}
