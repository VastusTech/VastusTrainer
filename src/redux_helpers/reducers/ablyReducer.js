const ADD_HANDLER = 'ADD_HANDLER';
const CLEAR_CHANNELS = 'CLEAR_CHANNELS';

const initialState = {
    subscribedChannels: {},
    notificationHandlers: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_HANDLER:
            state = {
                ...state,
            };
            if (!state.notificationHandlers[action.payload.channel]) {
                state.subscribedChannels[action.payload.channel] = action.payload.channel;
                state.notificationHandlers[action.payload.channel] = [];
            }
            state.notificationHandlers[action.payload.channel].push(action.payload.handler);
            break;
        case CLEAR_CHANNELS:
            state = {
                ...state,
                subscribedChannels: [],
                notificationHandlers: {}
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
