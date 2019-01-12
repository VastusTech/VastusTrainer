import QL from "../../GraphQL";
import S3 from "../../S3Storage";
import {setError, setIsLoading, setIsNotLoading} from "./infoActions";

const ADD_MESSAGE = 'ADD_MESSAGE';
const ADD_QUERY = 'ADD_QUERY';
const CLEAR_BOARD = 'CLEAR_BOARD';

export function queryNextMessagesFromBoard(board, limit, dataHandler, failureHandler) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        let ifFirst = getStore().message.boardIfFirsts[board];
        if (!ifFirst) { ifFirst = true; }
        let nextToken = getStore().message.boardNextTokens[board];
        if (ifFirst || !nextToken) {
            // Then you do the query
            QL.queryMessages(QL.constructMessageQuery(board, ["from", "name", "message", "type", "board", "id", "time_created"], null, limit), (data) => {
                if (data) {
                    if (!data.items) { data.items = []; }
                    addURLToMessages(data.items, (messages) => {
                        dispatch(addQueryToBoard(board, messages, data.nextToken));
                        if (dataHandler) { dataHandler(messages); }
                        dispatch(setIsNotLoading());
                    });
                }
                else {
                    const error = new Error("query messages came back with null?");
                    console.error(JSON.stringify(error));
                    dispatch(setError(error));
                    dispatch(setIsNotLoading());
                    if (failureHandler) { failureHandler(error); }
                }
            }, (error) => {
                console.error("ERROR INSIDE GET NEXT MESSAGES");
                console.error(JSON.stringify(error));
                dispatch(setError(error));
                dispatch(setIsNotLoading());
                if (failureHandler) { failureHandler(error); }
            });
        }
        else {
            if (dataHandler) { dataHandler(null); }
        }
    };
}
function addURLToMessages(messages, dataHandler) {
    const messagesLength = messages.length;
    let messagesReturned = 0;
    for (let i = 0; i < messagesLength; i++) {
        const message = messages[i];
        if (message.type) {
            S3.get(message.message, (url) => {
                message.message = url;
                messagesReturned++;
                if (messagesReturned >= messagesLength) {
                    dataHandler(messages);
                }
            }, (error) => {
                console.error("FAILED TO RECEIVE URL FOR MEDIA IN MESSAGE! ERROR = " + JSON.stringify(error));
                messagesReturned++;
                message.message = "";
                if (messagesReturned >= messagesLength) {
                    dataHandler(messages);
                }
            });
        }
        else {
            messagesReturned++;
            if (messagesReturned >= messagesLength) {
                dataHandler(messages);
            }
        }
    }
    if (messagesLength === 0) {
        dataHandler(messages);
    }
}
export function addMessageFromNotification(board, message, dataHandler, failureHandler) {
    return (dispatch) => {
        dispatch(setIsLoading());
        if (message.type) {
            S3.get(message.message, (url) => {
                message.message = url;
                dispatch(addMessageToBoard(board, message));
                if (dataHandler) { dataHandler(message); }
                dispatch(setIsNotLoading());
            }, (error) => {
                message.message = "";
                console.error("Error getting media for message from notification! Error = " + JSON.stringify(error));
                dispatch(addMessageToBoard(board, message));
                if (failureHandler) { failureHandler(error); }
                dispatch(setError(error));
                dispatch(setIsNotLoading());
            });
        }
    };
}
export function addMessageToBoard(board, message) {
    return {
        type: ADD_MESSAGE,
            payload: {
            board,
                message
        }
    };
}
function addQueryToBoard(board, items, nextToken) {
    return {
        type: ADD_QUERY,
        payload: {
            board,
            nextToken,
            items,
        }
    };
}
export function clearBoard(board) {
    return {
        type: CLEAR_BOARD,
        payload: board
    }
}