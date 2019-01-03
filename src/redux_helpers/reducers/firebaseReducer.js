const SET_TOKEN = 'SET_TOKEN';
const CLEAR_TOKEN = 'CLEAR_TOKEN';

const initialState = {
    token: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_TOKEN:
            state = {
                ...state,
                token: action.payload
            };
            break;
        case CLEAR_TOKEN:
            state = {
                ...state,
                token: null
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
