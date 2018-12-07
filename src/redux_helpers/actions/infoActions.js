const SET_ERROR = 'SET_ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';
const SET_IS_LOADING = 'SET_IS_LOADING';
const SET_IS_NOT_LOADING = 'SET_IS_NOT_LOADING';
const TOGGLE_IS_LOADING = 'TOGGLE_IS_LOADING';

export function setError(error) {
    return {
        type: SET_ERROR,
        payload: error
    };
}

export function clearError() {
    return {
        type: CLEAR_ERROR
    }
}

export function setIsLoading() {
    return {
        type: SET_IS_LOADING
    }
}

export function setIsNotLoading() {
    return {
        type: SET_IS_NOT_LOADING
    }
}

export function toggleIsLoading() {
    return {
        type: TOGGLE_IS_LOADING
    }
}

