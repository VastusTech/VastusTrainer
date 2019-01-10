import { setError, setIsLoading } from "./infoActions";
import QL from "../../GraphQL";
import {getCache, getPutItemFunction, getPutQueryFunction, getQueryCache, getFetchQueryType, getFetchQueryFunction} from "./cacheActions";

const ENABLE_TYPE = 'ENABLE_TYPE';
const DISABLE_TYPE = 'DISABLE_TYPE';
const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
const SET_TYPE_FILTER = 'SET_TYPE_FILTER';
const SET_TYPE_NEXT_TOKEN = 'SET_TYPE_NEXT_TOKEN';
const ADD_TYPE_RESULTS = 'ADD_TYPE_RESULTS';
const RESET_TYPE_QUERY = 'RESET_TYPE_QUERY';
const RESET_QUERY = 'RESET_QUERY';
const ENABLE_SEARCH_BAR = 'ENABLE_SEARCH_BAR';
const DISABLE_SEARCH_BAR = 'DISABLE_SEARCH_BAR';

export function newSearch(queryString, dataHandler) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        // Use the current store settings to actually do the search
        dispatch(setSearchQuery(queryString));
        if (queryString && queryString.length > 0) {
            dispatch(resetQuery());
            performAllQueries(queryString, dispatch, getStore, dataHandler);
        }
        else {
            console.log("I refuse to search for an empty string");
            dataHandler([]);
        }
    };
}
export function loadMoreResults(searchQuery, dataHandler) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        if (getStore().search.searchQuery === searchQuery) {
            performAllQueries(searchQuery, dispatch, getStore, dataHandler);
        }
    };
}
export function performAllQueries(searchQuery, dispatch, getStore, dataHandler) {
    if (searchQuery && searchQuery.length > 0) {
        let numResults = 0;
        let results = [];
        for (const type in getStore().search.typeQueries) {
            if (getStore().search.typeQueries.hasOwnProperty(type)) {
                const numTypesEnabled = getStore().search.numTypesEnabled;
                // const typeQuery = getStore().search.typeQueries[type];
                // if (typeQuery.enabled && (typeQuery.nextToken || typeQuery.ifFirst)) {
                performQuery(type, dispatch, getStore, (data) => {
                    if (data.hasOwnProperty("items") && data.hasOwnProperty("nextToken")) {
                        dispatch(addTypeResults(type, data.items));
                        dispatch(setTypeNextToken(type, data.nextToken));
                        results.push(...data.items);
                    }
                    else {
                        console.error("Received a weird value from query in the newSearch search redux function. Value = " + JSON.stringify(data));
                    }
                    numResults++;
                    if (numTypesEnabled <= numResults) {
                        dataHandler(results);
                    }
                }, () => {
                    numResults++;
                    if (numTypesEnabled <= numResults) {
                        dataHandler(results);
                    }
                })
            }
        }
    }
    else {
        // TODO What to do if we trying to do this? Set is not loading?
    }
}
function performQuery(itemType, dispatch, getStore, successHandler, failureHandler) {
    const searchQuery = getStore().search.searchQuery;
    const typeQuery = getStore().search.typeQueries[itemType];
    if (typeQuery.enabled) {
        const variableList = typeQuery.variableList;
        const filterJSON = typeQuery.filterJSON;
        const filterParameters = {
            ...typeQuery.filterParameters,
            searchQuery,
        };
        const limit = typeQuery.limit;
        const nextToken = typeQuery.nextToken;
        const ifFirst = typeQuery.ifFirst;
        console.log("nextToken = " + nextToken);
        if (nextToken || ifFirst) {
            const putItemFunction = getPutItemFunction(itemType);
            const fetchQueryFunction = getFetchQueryFunction(itemType);
            // alert(JSON.stringify(getFetchQueryFunction));
            // if (!fetchQueryFunction) { alert("problem"); }
            // else { alert(JSON.stringify(fetchQueryFunction)); }
            fetchQueryFunction(variableList, QL.generateFilter(filterJSON, filterParameters), limit, nextToken, (data) => {
                // alert("Ay lmao it came back");
                if (data) {
                    dispatch(setTypeNextToken(itemType, data.nextToken));
                    successHandler(data);
                    if (data && data.items) {
                        for (let i = 0; i < data.items.length; i++) {
                            dispatch(putItemFunction(data.items[i]));
                        }
                    }
                }
                else {
                    console.error("Query function returned null?");
                }
            }, (error) => {
                if (failureHandler) { failureHandler(error); }
            })(dispatch, getStore);
        }
        else {
            successHandler({items: [], nextToken: null});
        }
    }
}
export function enableType(type) {
    return {
        type: ENABLE_TYPE,
        payload: type
    };
}
export function disableType(type) {
    return {
        type: DISABLE_TYPE,
        payload: type
    };
}
export function setSearchQuery(searchQuery) {
    return {
        type: SET_SEARCH_QUERY,
        payload: searchQuery
    }
}
export function addTypeResults(type, results) {
    return {
        type: ADD_TYPE_RESULTS,
        payload: {
            type,
            results
        }
    };
}
export function setTypeFilter(type, filterJSON, filterParameters) {
    return {
        type: SET_TYPE_FILTER,
        payload: {
            type,
            filterJSON,
            filterParameters
        }
    };
}
export function setTypeNextToken(type, nextToken) {
    return {
        type: SET_TYPE_NEXT_TOKEN,
        payload: {
            type,
            nextToken
        }
    }
}
export function resetTypeQuery(type) {
    return {
        type: RESET_TYPE_QUERY,
        payload: type
    };
}
export function resetQuery() {
    return {
        type: RESET_QUERY
    };
}
export function enableSearchBar() {
    return {
        type: ENABLE_SEARCH_BAR
    }
}
export function disableSearchBar() {
    return {
        type: DISABLE_SEARCH_BAR
    }
}
