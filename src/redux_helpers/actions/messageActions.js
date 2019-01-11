import QL from "../../GraphQL";
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
        if (ifFirst || nextToken) {
            // Then you do the query
            QL.queryMessages(QL.constructMessageQuery(board, ["from", "message", "type", "board", "id", "time_created"], null, limit), (data) => {
                if (data) {
                    if (!data.items) { data.items = []; }
                    dispatch(addQueryToBoard(board, data.items, data.nextToken));
                    dataHandler(data.items);
                    dispatch(setIsNotLoading());
                }
                else {
                    const error = new Error("query messages came back with null?");
                    console.error(JSON.stringify(error));
                    dispatch(setError(error));
                    dispatch(setIsNotLoading());
                    failureHandler(error);
                }
            }, (error) => {
                console.error("ERROR INSIDE GET NEXT MESSAGES");
                console.error(JSON.stringify(error));
                dispatch(setError(error));
                dispatch(setIsNotLoading());
                failureHandler(error);
            });
        }
        else {
            dataHandler(null);
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