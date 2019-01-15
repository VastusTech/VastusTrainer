import {setIsLoading, setIsNotLoading} from "./infoActions";

const ADD_HANDLER = 'ADD_HANDLER';
const SET_HANDLER = 'SET_HANDLER';
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
export function setHandlerToBoard(board, handler) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        const channelName = board + "-Board";
        subscribeToChannelOnlyOnce(channelName, dispatch, getStore);
        dispatch(setHandler(channelName, handler));
        dispatch(setIsNotLoading());
    };
}
export function setHandlerToNotifications(handler) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        if (getStore().user.id) {
            const channelName = getStore().user.id + "-Notifications";
            subscribeToChannelOnlyOnce(channelName, dispatch, getStore);
            dispatch(setHandler(channelName, handler));
        }
        else {
            console.error("Can't set handler to notifications when the USER ID isn't set!");
        }
        dispatch(setIsNotLoading());
    };
}
export function removeAllHandlers() {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        const subscribedChannels = getStore().ably.subscribedChannels;
        for (const key in subscribedChannels) {
            if (subscribedChannels.hasOwnProperty(key)) {
                Ably.channels.get(key).unsubscribe();
            }
        }
        dispatch(clearChannels());
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
    channel.subscribe(getMessageHandler(channelName, getStore), (err) => {
        if (err) {
            alert("Failed to subscribe to the channel. Error = " + JSON.stringify(err));
        }
        else {
            // alert("SUCCESSFULLY SUBSCRIBED TO CHANNEL = " + channelName);
        }
    });
}
function getMessageHandler(channelName, getStore) {
    return (message) => {
        console.log("RECEIVED ABLY MESSAGE = " + JSON.stringify(message));
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
function setHandler(channel, handler) {
    return {
        type: SET_HANDLER,
        payload: {
            channel,
            handler
        }
    };
}
function clearChannels() {
    return { type: CLEAR_CHANNELS };
}

