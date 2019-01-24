import QL from "../../api/GraphQL";
import S3 from "../../api/S3Storage";
import {setError, setIsLoading, setIsNotLoading} from "./infoActions";
import {consoleError} from "../../logic/DebuggingHelper";

const notFoundPicture = require('../../img/not_found.png');
const defaultProfilePicture = require("../../img/roundProfile.png");

const ADD_MESSAGE = 'ADD_MESSAGE';
const ADD_QUERY = 'ADD_QUERY';
const CLEAR_BOARD = 'CLEAR_BOARD';

export function queryNextMessagesFromBoard(board, limit, dataHandler, failureHandler) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        let ifFirst = getStore().message.boardIfFirsts[board];
        if (ifFirst !== false) { ifFirst = true; }
        let nextToken = getStore().message.boardNextTokens[board];
        // console.log("IF FIRST = " + ifFirst + ", NEXT TOKEN = " + nextToken);
        if (ifFirst || nextToken) {
            // Then you do the query
            QL.queryMessages(QL.constructMessageQuery(board, ["from", "name", "profileImagePath", "message", "type", "board", "id", "time_created"], null, limit, nextToken), (data) => {
                if (data) {
                    // console.log(JSON.stringify(data));
                    if (!data.items) { data.items = []; }
                    addURLToMessages(data.items, "message", "messageURL", notFoundPicture, (message) => {return message.type}, (messages) => {
                        addURLToMessages(messages, "profileImagePath", "profilePicture", defaultProfilePicture, (message) => {return message.profileImagePath}, (messages) => {
                            dispatch(addQueryToBoard(board, messages, data.nextToken));
                            if (dataHandler) {
                                dataHandler(messages);
                            }
                            dispatch(setIsNotLoading());
                        });
                    });
                }
                else {
                    const error = new Error("query messages came back with null?");
                    consoleError(JSON.stringify(error));
                    dispatch(setError(error));
                    dispatch(setIsNotLoading());
                    if (failureHandler) { failureHandler(error); }
                }
            }, (error) => {
                consoleError("ERROR INSIDE GET NEXT MESSAGES");
                consoleError(JSON.stringify(error));
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

/**
 * This function takes in a list of messages and fetches all of their image attributes from AWS S3.
 *
 * @param messages The list of messages to fetch the image attribute of.
 * @param messagePathField The field in the Message object that contains the S3 path for the image.
 * @param messageURLField The field in the Message object to put the URL in.
 * @param defaultURL The default URL to put into the URL field (if fails or not applicable).
 * @param fetchChecker The checker that takes in a Message object and returns a boolean for if the message
 * should be fetched
 * @param dataHandler The handler at the end of the function that returns the newly fetched messages array.
 */
function addURLToMessages(messages, messagePathField, messageURLField, defaultURL, fetchChecker, dataHandler) {
    const messagesLength = messages.length;
    let messagesReturned = 0;
    for (let i = 0; i < messagesLength; i++) {
        const message = messages[i];
        if (fetchChecker(message)) {
            S3.get(message[messagePathField], (url) => {
                message[messageURLField] = url;
                messagesReturned++;
                if (messagesReturned >= messagesLength) {
                    dataHandler(messages);
                }
            }, (error) => {
                consoleError("FAILED TO RECEIVE URL FOR MEDIA IN MESSAGE! ERROR = " + JSON.stringify(error));
                messagesReturned++;
                message[messageURLField] = defaultURL;
                if (messagesReturned >= messagesLength) {
                    dataHandler(messages);
                }
            });
        }
        else {
            messagesReturned++;
            message[messageURLField] = defaultURL;
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
                consoleError("Error getting media for message from notification! Error = " + JSON.stringify(error));
                dispatch(addMessageToBoard(board, message));
                if (failureHandler) { failureHandler(error); }
                dispatch(setError(error));
                dispatch(setIsNotLoading());
            });
        }
        else {
            dispatch(addMessageToBoard(board, message));
            if (dataHandler) { dataHandler(message); }
            dispatch(setIsNotLoading());
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