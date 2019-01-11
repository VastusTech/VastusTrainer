import {setIsLoading, setIsNotLoading} from "./infoActions";

const ADD_HANDLER = 'ADD_HANDLER';
const CLEAR_CHANNELS = 'CLEAR_CHANNELS';

export function addHandlerToBoard(board, handler) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        const channelName = board + "-Board";
        subscribeToChannelOnlyOnce(channelName, dispatch, getStore);
        dispatch(addHandler(channelName, handler));
        dispatch(setIsNotLoading());
    };
}
export function addHandlerToNotifications(handler) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        if (getStore().user.id) {
            const channelName = getStore().user.id + "-Notifications";
            subscribeToChannelOnlyOnce(channelName, dispatch, getStore);
            dispatch(addHandler(channelName, handler));
        }
        else {
            console.error("Can't set handler to notifications when the USER ID isn't set!");
        }
        dispatch(setIsNotLoading());
    };
}
function subscribeToChannelOnlyOnce(channelName, dispatch, getStore) {
    if (!getStore().ably.subscribedChannels[channelName]) {
        subscribeToChannel(channelName, dispatch, getStore);
    }
}
function subscribeToChannel(channelName, dispatch, getStore) {
    /*global Ably*/
    const channel = Ably.channels.get(channelName);
    channel.subscribe(getMessageHandler(channelName, getStore));
    channel.attach();
    channel.once("attached", () => {
        alert("SUCCESSFULLY SUBSCRIBED TO CHANNEL = " + channelName);
    });
}
function getMessageHandler(channelName, getStore) {
    return (message) => {
        const handlers = getStore().ably.notificationHandlers[channelName];
        if (handlers && handlers.length > 0) {
            for (let i = 0; i < handlers.length; i++) {
                handlers[i](message);
            }
        }
    }
}
function addHandler(channel, handler) {
    return {
        type: ADD_HANDLER,
        payload: {
            channel,
            handler
        }
    };
}
function clearChannel() {
    return { type: CLEAR_CHANNELS };
}

