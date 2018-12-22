import React, { Component, Fragment } from 'react';
import { Modal, Button, List, Dimmer, Loader, Message, Grid, Image } from 'semantic-ui-react';
import { connect } from "react-redux";
import InviteToChallengeModalProp from "../screens/InviteToChallengeModal";
import _ from "lodash";
import {fetchTrainer} from "../redux_helpers/actions/cacheActions";
import {forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import InviteFunctions from "../databaseFunctions/InviteFunctions";
import UserFunctions from "../databaseFunctions/UserFunctions";

type Props = {
    open: boolean,
    onClose: any,
    trainerID: string
}

/*
* Trainer Modal
*
* This is the generic profile view for any user that the current logged in user clicks on.
 */
class TrainerPortalModal extends Component<Props> {
    state = {
        error: null,
        isLoading: true,
        trainerID: null,
        sentRequest: false,
        inviteModalOpen: false,
        isRemoveFriendLoading: false,
        isAddFriendLoading: false,
        requestSent: false
    };

    resetState(trainerID) {
        this.setState({
            error: null,
            isLoading: true,
            trainerID,
            sentRequest: false,
            inviteModalOpen: false,
            isRemoveFriendLoading: false,
            isAddFriendLoading: false,
            requestSent: false
        });
    }

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.trainerID) {
            if (this.state.trainerID !== newProps.trainerID) {
                // alert("Setting new state to " + newProps.clientID);
                this.resetState(newProps.trainerID);
                this.props.fetchTrainer(newProps.trainerID, ["id", "username", "gender", "birthday", "name", "friends", "challengesWon", "scheduledEvents", "profileImagePath", "profilePicture", "friendRequests"]);
                this.state.trainerID = newProps.trainerID;
                //this.setState({clientID: newProps.clientID});
                // this.state.sentRequest = true;
            }
        }
    }

    getTrainerAttribute(attribute) {
        if (this.state.trainerID) {
            let trainer = this.props.cache.trainers[this.state.trainerID];
            if (trainer) {
                if (attribute.substr(attribute.length - 6) === "Length") {
                    attribute = attribute.substr(0, attribute.length - 6);
                    if (trainer[attribute] && trainer[attribute].length) {
                        return trainer[attribute].length;
                    }
                    else {
                        return 0;
                    }
                }
                return trainer[attribute];
            }
        }
        else {
            return null;
        }
    }

    handleAddFriendButton() {
        this.setState({isAddFriendLoading: true});
        // alert("Adding this friend!");
        if (this.props.user.id && this.getTrainerAttribute("id")) {
            InviteFunctions.createFriendRequest(this.props.user.id, this.props.user.id, this.getClientAttribute("id"),
                (data) => {
                    this.setState({isAddFriendLoading: false, requestSent: true});
                    //alert("Successfully added " + this.getClientAttribute("name") + " as a friend!");
                    this.props.forceFetchUserAttributes(["friends"]);
                }, (error) => {
                    this.setState({isAddFriendLoading: false});
                    console.log(JSON.stringify(error));
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
        if (this.props.user.id && this.getTrainerAttribute("id")) {
            this.setState({isRemoveFriendLoading: true});
            UserFunctions.removeFriend(this.props.user.id, this.props.user.id, this.getClientAttribute("id"),
                (data) => {
                    this.setState({isRemoveFriendLoading: false});
                    console.log("Successfully removed " + this.getClientAttribute("name") + " from friends list");
                    this.props.forceFetchUserAttributes(["friends"]);
                }, (error) => {
                    this.setState({isRemoveFriendLoading: false});
                    console.log(JSON.stringify(error));
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
        if (this.getTrainerAttribute("profilePicture")) {
            return(
                <div className="u-avatar u-avatar--small u-margin-bottom--1" style={{backgroundImage: `url(${this.getClientAttribute("profilePicture")})`}}></div>
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
        if (this.getTrainerAttribute("id")) {
            if (this.props.user.friends && this.props.user.friends.length) {
                if (this.props.user.friends.includes(this.getTrainerAttribute("id"))) {
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
            const friendRequests = this.getTrainerAttribute("friendRequests");
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
            return null;
            // if (error) {
            //     return (
            //         <Message color='red'>
            //             <h1>Error!</h1>
            //             <p>{error.errorMessage}</p>
            //         </Message>
            //     );
            // }
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
                <Modal.Header>{this.getTrainerAttribute("name")}</Modal.Header>
                <Modal.Content image>
                    {this.profilePicture()}
                    <Modal.Description>
                        <List relaxed>

                            {/* Bio */}
                            <List.Item>
                                <List.Icon name='user' />
                                <List.Content>
                                    {"Username: " + this.getTrainerAttribute("username")}
                                </List.Content>
                            </List.Item>

                            {/* Friends */}
                            <List.Item>
                                <List.Icon name='users' />
                                <List.Content>
                                    {this.getTrainerAttribute("friendsLength") + " friends"}
                                </List.Content>
                            </List.Item>
                            {/* Event Wins */}
                            <List.Item>
                                <List.Icon name='trophy' />
                                <List.Content>
                                    {this.getTrainerAttribute("challengesWonLength") + " challenges won"}
                                </List.Content>
                            </List.Item>
                        </List>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={this.handleInviteModalOpen.bind(this)}>Invite to Challenge</Button>
                    <InviteToChallengeModalProp
                        open={this.state.inviteModalOpen}
                        onOpen={this.handleInviteModalOpen.bind(this)}
                        onClose={this.handleInviteModalClose.bind(this)}
                        friendID={this.getTrainerAttribute("id")}
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
        fetchTrainer: (id, variablesList, dataHandler) => {
            dispatch(fetchTrainer(id, variablesList, dataHandler));
        },
        forceFetchUserAttributes: (variablesList) => {
            dispatch(forceFetchUserAttributes(variablesList));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TrainerPortalModal);
