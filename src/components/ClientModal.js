import React, { Component, Fragment } from 'react';
import { Modal, Button, List, Dimmer, Loader, Message, Grid, Image } from 'semantic-ui-react';
import Lambda from "../Lambda";
import { connect } from "react-redux";
import ScheduledEventsList from "../screens/ScheduledEventList";
import InviteToScheduledEventsModalProp from "../screens/InviteToScheduledEventsModal";
import _ from "lodash";
import {fetchClient} from "../redux_helpers/actions/cacheActions";
import {forceFetchUserAttributes} from "../redux_helpers/actions/userActions";

/*
* Client Modal
*
* This is the generic profile view for any user that the current logged in user clicks on.
 */
class ClientModal extends Component {
    state = {
        error: null,
        isLoading: true,
        clientID: null,
        sentRequest: false,
        inviteModalOpen: false,
        isRemoveFriendLoading: false,
        isAddFriendLoading: false,
        requestSent: false
    };

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.clientID) {
            if (this.state.clientID !== newProps.clientID) {
                // alert("Setting new state to " + newProps.clientID);
                this.props.fetchClient(newProps.clientID, ["id", "username", "gender", "birthday", "name", "friends", "challengesWon", "scheduledEvents", "profileImagePath", "profilePicture", "friendRequests"]);
                this.state.clientID = newProps.clientID;
                //this.setState({clientID: newProps.clientID});
                // this.state.sentRequest = true;
            }
        }
    }

    getClientAttribute(attribute) {
        if (this.state.clientID) {
            let client = this.props.cache.clients[this.state.clientID];
            if (client) {
                if (attribute.substr(attribute.length - 6) === "Length") {
                    attribute = attribute.substr(0, attribute.length - 6);
                    if (client[attribute] && client[attribute].length) {
                        return client[attribute].length;
                    }
                    else {
                        return 0;
                    }
                }
                return client[attribute];
            }
        }
        else {
            return null;
        }
    }

    handleAddFriendButton() {
        this.setState({isAddFriendLoading: true});
        // alert("Adding this friend!");
        if (this.props.user.id && this.getClientAttribute("id")) {
            Lambda.sendFriendRequest(this.props.user.id, this.props.user.id, this.getClientAttribute("id"),
                (data) => {
                    this.setState({isAddFriendLoading: false, requestSent: true});
                    //alert("Successfully added " + this.getClientAttribute("name") + " as a friend!");
                    this.props.forceFetchUserAttributes(["friends"]);
                }, (error) => {
                    this.setState({isAddFriendLoading: false});
                    alert(JSON.stringify(error));
                    this.setState({error: "*" + error});
                });
        }
    }

    /*
    handleAddFriendButton() {
        this.setState({isAddFriendLoading: true});
        this.handleAddFriend();
    }*/

    handleRemoveFriendButton() {
        // alert("Removing this friend!");
        if (this.props.user.id && this.getClientAttribute("id")) {
            this.setState({isRemoveFriendLoading: true});
            Lambda.clientRemoveFriend(this.props.user.id, this.props.user.id, this.getClientAttribute("id"),
                (data) => {
                    this.setState({isRemoveFriendLoading: false});
                    alert("Successfully removed " + this.getClientAttribute("name") + " from friends list");
                    this.props.forceFetchUserAttributes(["friends"]);
                }, (error) => {
                    this.setState({isRemoveFriendLoading: false});
                    alert(JSON.stringify(error));
                    this.setState({error: "*" + error});
                });
        }
    }
    /*
    handleRemoveFriendButton() {
        this.setState({isRemoveFriendLoading: true});
        this.handleRemoveFriend();
    }*/

    profilePicture() {
        if (this.getClientAttribute("profilePicture")) {
            return(
                <Image wrapped size="small" circular src={this.getClientAttribute("profilePicture")} />
            );
        }
        else {
            return(
                <Dimmer inverted>
                    <Loader />
                </Dimmer>
            );
        }
    }

    getCorrectFriendActionButton() {
        // alert("getting correct friend action button for " + this.getClientAttribute("id"));
        if (this.getClientAttribute("id")) {
            if (this.props.user.friends && this.props.user.friends.length) {
                if (this.props.user.friends.includes(this.getClientAttribute("id"))) {
                    // Then they're already your friend
                    return (
                        <Button inverted
                                loading={this.state.isRemoveFriendLoading}
                                type='button'
                                onClick={this.handleRemoveFriendButton.bind(this)}>
                            Remove Buddy
                        </Button>
                    );
                }
            }
            const friendRequests = this.getClientAttribute("friendRequests");
            if (friendRequests && friendRequests.length && friendRequests.includes(this.props.user.id) ||
            this.state.requestSent) {
                // Then you already sent a friend request
                return (
                    <Button inverted disabled
                            type='button'>
                        Sent Request!
                    </Button>
                );
            }
        }
        return(
            <Button inverted
                    loading={this.state.isAddFriendLoading}
                    type='button'
                    onClick={this.handleAddFriendButton.bind(this)}>
                Add Buddy
            </Button>
        );
    }

    handleInviteModalOpen = () => {this.setState({inviteModalOpen: true})};
    handleInviteModalClose = () => {this.setState({inviteModalOpen: false})};

    render() {
        function errorMessage(error) {
            if (error) {
                return (
                    <Message color='red'>
                        <h1>Error!</h1>
                        <p>{errorMessage(error)}</p>
                    </Message>
                );
            }
        }
        function loadingProp(isLoading) {
            if (isLoading) {
                return (
                    <Dimmer active inverted>
                        <Loader/>
                    </Dimmer>
                );
            }
            return null;
        }

        if (this.props.info.isLoading) {
            return(
                <Modal open={this.props.open} onClose={this.props.onClose.bind(this)}>
                    <Modal.Header>Loading...</Modal.Header>
                </Modal>
            );
        }
        function button_rows(events) {
            //if(events != null)
            //alert(JSON.stringify(events[0]));
            return _.times(events.length, i => (
                <Fragment key={i}>
                    <Button primary>Invite to Challenge</Button>
                </Fragment>
            ));
        }
        // <Item.Image size='medium' src={proPic} circular/> TODO

        //This render function displays the user's information in a small profile page, and at the
        //bottom there is an add buddy function, which sends out a buddy request (friend request).
        return(
            <Modal open={this.props.open} onClose={this.props.onClose.bind(this)}>
                {loadingProp(this.props.info.isLoading)}
                {errorMessage(this.props.info.error)}
                <Modal.Header>{this.getClientAttribute("name")}</Modal.Header>
                <Modal.Content image>
                    {this.profilePicture()}
                    <Modal.Description>
                        <List relaxed>

                            {/* Bio */}
                            <List.Item>
                                <List.Icon name='user' />
                                <List.Content>
                                    {"Username: " + this.getClientAttribute("username")}
                                </List.Content>
                            </List.Item>

                            {/* Friends */}
                            <List.Item>
                                <List.Icon name='users' />
                                <List.Content>
                                    {this.getClientAttribute("friendsLength") + " friends"}
                                </List.Content>
                            </List.Item>
                            {/* Event Wins */}
                            <List.Item>
                                <List.Icon name='trophy' />
                                <List.Content>
{this.getClientAttribute("challengesWonLength") + " challenges won"}

                                    {this.getClientAttribute("challengesWonLength")}

                                </List.Content>
                            </List.Item>
                        </List>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={this.handleInviteModalOpen.bind(this)}>Invite to Challenge</Button>
                    <InviteToScheduledEventsModalProp
                        open={this.state.inviteModalOpen}
                        onOpen={this.handleInviteModalOpen.bind(this)}
                        onClose={this.handleInviteModalClose.bind(this)}
                        friendID={this.getClientAttribute("id")}
                    />
                    {this.getCorrectFriendActionButton()}
                </Modal.Actions>
                <Modal.Content>
                    <div>{this.state.error}</div>
                </Modal.Content>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchClient: (id, variablesList) => {
            dispatch(fetchClient(id, variablesList));
        },
        forceFetchUserAttributes: (variablesList) => {
            dispatch(forceFetchUserAttributes(variablesList));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientModal);