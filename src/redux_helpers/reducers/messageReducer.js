const ADD_MESSAGE = 'ADD_MESSAGE';
const ADD_QUERY = 'ADD_QUERY';
const CLEAR_BOARD = 'CLEAR_BOARD';

// How to make sure that this doesn't get out of control?
const initialState = {
    boards: {},
    boardNextTokens: {},
    boardIfFirsts: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_MESSAGE:
            state = {
                ...state,
            };
            if (!state.boards[action.payload.board]) {
                state.boards[action.payload.board] = [];
            }
            // TODO Insert sort it into here?
            state.boards[action.payload.board].unshift(action.payload.message);
            break;
        case ADD_QUERY:
            state = {
                ...state
            };
            if (!state.boards[action.payload.board]) {
                state.boards[action.payload.board] = [];
            }
            state.boards[action.payload.board] = [...state.boards[action.payload.board], ...action.payload.items];
            state.boardNextTokens[action.payload.board] = action.payload.nextToken;
            state.boardIfFirsts[action.payload.board] = false;
            break;
        case CLEAR_BOARD:
            state = {
                ...state,
                boards: {
                    ...state.boards,
                    [action.payload]: null
                },
                boardNextTokens: {
                    ...state.boardNextTokens,
                    [action.payload]: null
                },
                boardIfFirsts: {
                    ...state.boardIfFirsts,
                    [action.payload]: null
                }
            };
            break;
        default:
            state = {
                ...state
            };
            break;
    }
    return state;
}
