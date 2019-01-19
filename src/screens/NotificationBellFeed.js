import React, {Component, Fragment} from 'react'
import _ from 'lodash'
import {Dimmer, Loader, Grid, Message} from 'semantic-ui-react'
// import { Operation } from "aws-amplify";
import NotificationCard from "../components/NotificationCard";
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import {connect} from 'react-redux';
import {
    fetchInvite,
    fetchEvent,
    fetchChallenge,
    fetchGroup,
    fetchClient,
    fetchTrainer
} from "../redux_helpers/actions/cacheActions";
import {getItemTypeFromID} from "../logic/ItemType";

/*
* NotificationCard Feed
*
* This is a feed which contains all of the buddy (friend) requests that have been sent to the current user.
 */
class NotificationFeed extends React.PureComponent {
    state = {
        error: null,
        isLoading: true,
        sentRequest: false,
        notifications: []
    };

    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
        this.forceUpdate = this.forceUpdate.bind(this);
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

        const fetchAboutAndFromInfo = (invite) => {
            if (invite && invite.from && invite.to && invite.inviteType && invite.about) {
                // Fetch from user information
                const fromItemType = getItemTypeFromID(invite.from);
                if (fromItemType === "Client") {
                    props.fetchClient(invite.from, ["id", "name", "friends", "challengesWon", "scheduledEvents", "profileImagePath", "profilePicture"]);
                } else if (fromItemType === "Trainer") {
                    props.fetchTrainer(invite.from, ["id", "name", "gender", "birthday", "profileImagePath", "profilePicture", "profileImagePaths"]);
                } else if (fromItemType === "Gym") {
                    // TODO FETCH THIS?
                    alert("not implemented!");
                } else {
                    console.error("ITEM TYPE NOT RECOGNIZED FOR INVITE?");
                }

                const toItemType = getItemTypeFromID(invite.to);
                if (toItemType === "Client") {
                    props.fetchClient(invite.to, ["id", "name", "friends", "challengesWon", "scheduledEvents", "profileImagePath", "profilePicture"]);
                } else if (toItemType === "Trainer") {
                    props.fetchTrainer(invite.to, ["id", "name", "gender", "birthday", "profileImagePath", "profilePicture", "profileImagePaths"]);
                } else if (toItemType === "Gym") {
                    // TODO FETCH THIS?
                    alert("not implemented!");
                } else if (toItemType === "Event") {
                    props.fetchEvent(invite.to, ["id", "title", "time", "time_created", "owner", "members", "capacity", "difficulty"]);
                } else if (toItemType === "Challenge") {
                    props.fetchChallenge(invite.to, ["id", "title", "time", "time_created", "owner", "members", "capacity", "difficulty"]);
                } else if (toItemType === "Group") {
                    // TODO FETCH THIS?
                    alert("not implemented!");
                } else {
                    console.error("ITEM TYPE NOT RECOGNIZED FOR INVITE?");
                }
                // Fetch about item information
                const aboutItemType = getItemTypeFromID(invite.about);
                if (aboutItemType === "Client") {
                    props.fetchClient(invite.about, ["id", "name", "friends", "challengesWon", "scheduledEvents", "profileImagePath", "profilePicture"]);
                } else if (aboutItemType === "Trainer") {
                    props.fetchTrainer(invite.about, ["id", "name", "gender", "birthday", "profileImagePath", "profilePicture", "profileImagePaths"]);
                } else if (aboutItemType === "Gym") {
                    // TODO FETCH THIS?
                    alert("not implemented!");
                } else if (aboutItemType === "Event") {
                    props.fetchEvent(invite.about, ["id", "title", "time", "time_created", "owner", "members", "capacity", "difficulty", "restriction"]);
                } else if (aboutItemType === "Challenge") {
                    props.fetchChallenge(invite.about, ["id", "title", "endTime", "time_created", "owner", "members", "capacity", "difficulty", "restriction"]);
                } else if (aboutItemType === "Group") {
                    // TODO FETCH THIS?
                    alert("not implemented!");
                } else {
                    console.error("ITEM TYPE NOT RECOGNIZED FOR INVITE?");
                }
            }
            else {
                // TODO FIll in the invite with bum info?
            }
        };

        const fetchAndAddInvite = (inviteID) => {
            props.fetchInvite(inviteID, ["time_created", "from", "to", "inviteType", "about", "description"], (data) => {
                this.state.notifications.push(data.id);
                fetchAboutAndFromInfo(data);
                this.setState({isLoading: false});
            });
        };

        const fetchAndAddReceivedInvites = (itemType, id) => {
            let fetchFunction;
            if (itemType === "Event") { fetchFunction = props.fetchEvent; }
            if (itemType === "Challenge") { fetchFunction = props.fetchChallenge; }
            if (itemType === "Group") { fetchFunction = props.fetchGroup; }
            fetchFunction(id, ["receivedInvites"], (data) => {
                if (data.hasOwnProperty("receivedInvites") && data.receivedInvites) {
                    for (let i = 0; i < data.receivedInvites.length; i++) {
                        fetchAndAddInvite(data.receivedInvites[i]);
                    }
                }
            });
        };

        if (!this.state.sentRequest) {
            this.state.sentRequest = true;
            props.fetchUserAttributes(["receivedInvites", "ownedEvents", "ownedChallenges", "ownedGroups"], (data) => {
                if (data) {
                    if (data.hasOwnProperty("receivedInvites") && data.receivedInvites) {
                        for (let i = 0; i < data.receivedInvites.length; i++) {
                            fetchAndAddInvite(data.receivedInvites[i]);
                        }
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

    forceUpdate = () => {
        // this.state.sentRequest = false;
        // this.update(this.props);
        // this.props.forceFetchUserAttributes(["receivedInvites"]);
    };

    //The buddy requests consists of a profile picture with the name of the user who has sent you a request.
    //To the right of the request is two buttons, one to accept and one to deny the current request.
    render() {
        function inviteRows(invites, feedUpdate) {
            return _.times(invites.length, i => (
                <NotificationCard inviteID={invites[i]} feedUpdate={() => {}/*feedUpdate*/}/>
            ));
        }

        if (this.props.info.isLoading) {
            return(
                <Dimmer>
                    <Loader/>
                </Dimmer>
            );
        }
        if (this.state.notifications && this.state.notifications.length && this.state.notifications.length > 0) {
            return(
                <Fragment>
                    {inviteRows(this.state.notifications, this.forceUpdate.bind(this))}
                </Fragment>
            );
        }
        else {
            return(
                <Message>No notifications!</Message>
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
        fetchInvite: (id, variablesList, dataHandler) => {
            dispatch(fetchInvite(id, variablesList, dataHandler));
        },
        fetchClient: (id, variablesList) => {
            dispatch(fetchClient(id, variablesList));
        },
        fetchTrainer: (id, variablesList) => {
            dispatch(fetchTrainer(id, variablesList));
        },
        fetchEvent: (id, variablesList, dataHandler) => {
            dispatch(fetchEvent(id, variablesList, dataHandler));
        },
        fetchChallenge: (id, variablesList, dataHandler) => {
            dispatch(fetchChallenge(id, variablesList, dataHandler));
        },
        fetchGroup: (id, variablesList, dataHandler) => {
            dispatch(fetchGroup(id, variablesList, dataHandler));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationFeed);