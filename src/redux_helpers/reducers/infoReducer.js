const SET_ERROR = 'SET_ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';
const SET_IS_LOADING = 'SET_IS_LOADING';
const SET_IS_NOT_LOADING = 'SET_IS_NOT_LOADING';
const TOGGLE_IS_LOADING = 'TOGGLE_IS_LOADING';
//
// export const infoFunctions = {
//     SET_ERROR,
//     CLEAR_ERROR,
//     SET_IS_LOADING,
//     SET_IS_NOT_LOADING,
//     TOGGLE_IS_LOADING
// };

const initialState = {
    isLoading: false,
    error: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_ERROR:
            console.log("Error inside a redux action/reducer! (Leo wrote this) Error = " + JSON.stringify(action.payload));
            state = {
                ...state,
                error: action.payload
            };
            break;
        case CLEAR_ERROR:
            state = {
                ...state,
                error: null
            };
            break;
        case SET_IS_LOADING:
            state = {
                ...state,
                isLoading: true
            };
            break;
        case SET_IS_NOT_LOADING:
            state = {
                ...state,
                isLoading: false
            };
            break;
        case TOGGLE_IS_LOADING:
            state = {
                ...state,
                isLoading: !state.info.isLoading
            };
            break;
        default:
            state = {
                ...state
            };
            break;
    }
    // console.log("INFO: Did " + action.type + " and now state is = " + JSON.stringify(state));
    return state;
}

