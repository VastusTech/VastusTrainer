import React, {Component, Fragment} from 'react'
import {Dimmer, Loader, Grid, Message, Icon, Label} from 'semantic-ui-react'
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import {connect} from 'react-redux';
import {fetchChallenge, fetchEvent, fetchGroup, fetchInvite} from "../redux_helpers/actions/cacheActions";

/*
* NotificationCard Feed
*
* This is a feed which contains all of the buddy (friend) requests that have been sent to the current user.
 */
class NotificationBellProp extends Component {
    state = {
        error: null,
        isLoading: true,
        sentRequest: false,
        numNotifications: 0
    };

    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        this.update(this.props);
    }

    componentWillReceiveProps(newProps, nextContext) {
        this.update(newProps);
    }

    update(props) {
        const user = props.user;
        //console.log("Updating Scheduled Events");
        if (!user.id) {
            console.error("Pretty bad error");
            this.setState({isLoading: true});
        }

         const fetchAndAddReceivedInvites = (itemType, id) => {
            let fetchFunction;
            if (itemType === "Event") { fetchFunction = props.fetchEvent; }
            if (itemType === "Challenge") { fetchFunction = props.fetchChallenge; }
            if (itemType === "Group") { fetchFunction = props.fetchGroup; }
            fetchFunction(id, ["receivedInvites"], (data) => {
                if (data.hasOwnProperty("receivedInvites") && data.receivedInvites) {
                    this.state.numNotifications += data.receivedInvites.length;
                }
            });
        };

        if (!this.state.sentRequest) {
            this.state.sentRequest = true;
            this.setState({isLoading: true});
            props.fetchUserAttributes(["receivedInvites", "ownedEvents", "ownedChallenges", "ownedGroups"], (data) => {
                if (data) {
                    if (data.hasOwnProperty("receivedInvites") && data.receivedInvites) {
                        this.state.numNotifications += data.receivedInvites.length;
                    }
                    if (data.hasOwnProperty("ownedEvents") && data.ownedEvents) {
                        for (let i = 0; i < data.ownedEvents.length; i++) {
                            fetchAndAddReceivedInvites("Event", data.ownedEvents[i]);
                        }
                    }
                    if (data.hasOwnProperty("ownedChallenges") && data.ownedChallenges) {
                        for (let i = 0; i < data.ownedChallenges.length; i++) {
                            fetchAndAddReceivedInvites("Challenge", data.ownedChallenges[i]);
                        }
                    }
                    if (data.hasOwnProperty("ownedGroups") && data.ownedGroups) {
                        for (let i = 0; i < data.ownedGroups.length; i++) {
                            fetchAndAddReceivedInvites("Group", data.ownedGroups[i]);
                        }
                    }
                }
                else {
                    this.setState({isLoading: false});
                }
            });
        }
    };

    //The buddy requests consists of a profile picture with the name of the user who has sent you a request.
    //To the right of the request is two buttons, one to accept and one to deny the current request.
    render() {
        if (this.state.numNotifications > 0) {
            //alert(JSON.stringify(this.props.user.receivedInvites));
            return (
                <div>
                    <Icon name='bell' size='large'/>
                    {this.state.numNotifications}
                </div>
            );
        }
        else {
            return (
                <Icon name='bell outline' size='large'/>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (attributesList, dataHandler) => {
            dispatch(fetchUserAttributes(attributesList, dataHandler));
        },
        forceFetchUserAttributes: (attributeList) => {
            dispatch(forceFetchUserAttributes(attributeList));
        },
        fetchEvent: (id, variablesList, dataHandler) => {
            dispatch(fetchEvent(id, variablesList, dataHandler));
        },
        fetchChallenge: (id, variablesList, dataHandler) => {
            dispatch(fetchChallenge(id, variablesList, dataHandler));
        },
        fetchGroup: (id, variablesList, dataHandler) => {
            dispatch(fetchGroup(id, variablesList, dataHandler));
        },
        fetchInvite: (id, variablesList, dataHandler) => {
            dispatch(fetchInvite(id, variablesList, dataHandler));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationBellProp);
