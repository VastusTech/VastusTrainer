import React, { Component, Fragment } from 'react';
import ReactSwipe from 'react-swipe';
import {Modal, Button, List, Dimmer, Loader, Message, Icon, Image, Label, Grid} from 'semantic-ui-react';
import Lambda from "../Lambda";
import { connect } from "react-redux";
import ScheduledEventsList from "../screens/ScheduledEventList";
// import InviteToScheduledEventsModalProp from "../screens/InviteToScheduledEventsModal";
import InviteToChallengeModalProp from "../screens/InviteToChallengeModal";
import _ from "lodash";
import {fetchClient} from "../redux_helpers/actions/cacheActions";
import {forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import InviteFunctions from "../databaseFunctions/InviteFunctions";
import UserFunctions from "../databaseFunctions/UserFunctions";
import { Storage } from 'aws-amplify';
import PostFunctions from "../databaseFunctions/PostFunctions";

type Props = {
    open: boolean,
    onClose: any,
    clientID: string
}

/*
* Client Modal
*
* This is the generic profile view for any user that the current logged in user clicks on.
 */
class ClientModal extends Component<Props> {
    state = {
        error: null,
        isLoading: true,
        clientID: null,
        sentRequest: false,
        inviteModalOpen: false,
        isRemoveFriendLoading: false,
        isAddFriendLoading: false,
        requestSent: false,
        galleryURLS: [],
        urlsSet: false
    };

    constructor(props) {
        super(props);
        this.resetState = this.resetState.bind(this);
        this.getClientAttribute = this.getClientAttribute.bind(this);
        this.setURLS = this.setURLS.bind(this);
        this.profilePicture = this.profilePicture.bind(this);
        this.getCorrectFriendActionButton = this.getCorrectFriendActionButton.bind(this);
        this.imageGallery = this.imageGallery.bind(this);
        this.swipeGallery = this.swipeGallery.bind(this);
    }

    resetState(clientID) {
        this.setState({
            error: null,
            isLoading: true,
            clientID,
            sentRequest: false,
            inviteModalOpen: false,
            isRemoveFriendLoading: false,
            isAddFriendLoading: false,
            requestSent: false
        });
    }

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
        //alert(JSON.stringify(this.props));
        //alert("Fetching client on mount");
        this.props.fetchClient(this.props.clientID, ["id", "username", "gender", "birthday", "name", "friends", "challengesWon", "scheduledEvents", "profileImagePath", "profileImagePaths", "profilePicture", "friendRequests"]);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.clientID) {
            if (this.state.clientID !== newProps.clientID) {
                // console.log("Setting new state to " + newProps.clientID);
                //alert("Fetching client will receive");
                this.resetState(newProps.clientID);
                this.props.fetchClient(newProps.clientID, ["id", "username", "gender", "birthday", "name", "friends", "challengesWon", "scheduledEvents", "profileImagePath", "profileImagePaths", "profilePicture", "friendRequests"]);
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
        // console.log("Adding this friend!");
        if (this.props.user.id && this.getClientAttribute("id")) {
            InviteFunctions.createFriendRequest(this.props.user.id, this.props.user.id, this.getClientAttribute("id"),
                (data) => {
                    this.setState({isAddFriendLoading: false, requestSent: true});
                    //console.log("Successfully added " + this.getClientAttribute("name") + " as a friend!");
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
        // console.log("Removing this friend!");
        if (this.props.user.id && this.getClientAttribute("id")) {
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

    setURLS(paths) {
        if(this.getClientAttribute("profileImagePaths")) {
            //console.log("Gallery URLS: " + JSON.stringify(this.state.galleryURLS) + " and paths " + JSON.stringify(paths));
        }
        if(paths) {
            for (let i = 0; i < paths.length; i++) {
                if (this.state.galleryURLS) {
                    //console.log("I get in here!");
                    Storage.get(paths[i]).then((url) => {
                        let tempGal = this.state.galleryURLS;
                        tempGal[i] = url;
                        this.setState({galleryURLS: tempGal});
                        console.log(JSON.stringify("setURL view: " + this.state.galleryURLS));
                    }).catch((error) => {
                        console.error("ERROR IN GETTING VIDEO FOR COMMENT");
                        console.error(error);
                    });
                }
            }
        }
    }

    imageGallery = () => {
        if(this.getClientAttribute("profileImagePaths")) {
            if(!this.state.urlsSet) {
                console.log(JSON.stringify("Paths being passed in: " + this.props.user.profileImagePaths));
                this.setURLS(this.getClientAttribute("profileImagePaths"));
                console.log("Setting URLS: " + this.state.galleryURLS);
                this.setState({urlsSet: true});
            }
            //console.log(JSON.stringify(this.state.galleryURLS));
            return _.times(this.state.galleryURLS.length, i => (
                <div>
                    <Image src={this.state.galleryURLS[i]} align='center' style={{height: '300px',
                        width: '300px', display: 'block',
                        margin: 'auto'}}>
                        {/*this.state.galleryURLS[i] + " Num: " + i*/}
                        {/*this.setGalleryNum(i)*/}
                    </Image>
                </div>
            ));
        }
        else {
            return(<div align="center">
                No Images in Gallery
            </div>);
        }
    }

    profilePicture() {
        if (this.getClientAttribute("profileImagePaths") !== [] || this.getClientAttribute("profileImagePaths") !== null) {
            /*if(!this.state.urlsSet) {
                console.log(JSON.stringify("Paths being passed in: " + this.props.user.profileImagePaths));
                this.setURLS(this.getClientAttribute("profileImagePaths"));
                console.log("Setting URLS: " + this.state.galleryURLS);
                this.setState({urlsSet: true});
            }*/
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

    swipeGallery() {
        let reactSwipeEl;
        return (
            <div>
                <Grid centered>
                    <Grid.Column width={1} style={{marginRight: "10px"}} onClick={() => reactSwipeEl.prev()}>
                        <Icon size='large' name="caret left" style={{marginTop: "150px"}}/>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <ReactSwipe
                            className="carousel"
                            swipeOptions={{ continuous: false }}
                            ref={el => (reactSwipeEl = el)}
                        >
                            {this.imageGallery()}
                        </ReactSwipe>
                    </Grid.Column>
                    <Grid.Column width={1} style={{marginRight: "10px", marginLeft: "-10px"}} onClick={() => reactSwipeEl.next()}>
                        <Icon size='large' name="caret right" style={{marginTop: "150px"}}/>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
    getCorrectFriendActionButton() {
        // console.log("getting correct friend action button for " + this.getClientAttribute("id"));
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

    createSuccessLabel() {
        if(this.state.showSuccessLabel && this.state.showModal) {
            this.setState({showSuccessLabel: false});
        }
        else if(this.state.showSuccessLabel) {
            return (<Message positive>
                <Message.Header>Success!</Message.Header>
                <p>
                    You just shared this User!
                </p>
            </Message>);
        }
        else {
            return null;
        }
    }

    errorMessage(error) {
        if (error) {
            return (
                <Message color='red'>
                    <h1>Error!</h1>
                    <p>{error}</p>
                </Message>
            );
        }
    }

    shareClient() {
        this.setState({shareLoading: true});
        //alert(this.props.user.id + " and " + this.getClientAttribute("description") + " and " + this.getClientAttribute("access"));
        PostFunctions.createShareItemPost(this.props.user.id, this.props.user.id, "", "public", "Client", this.getClientAttribute("id"), null, null, (returnValue) => {
            alert("Successfully Created Post!");
            alert(JSON.stringify(returnValue));
            this.setState({shareLoading: false});
            this.setState({showSuccessLabel: true});
        }, (error) => {
            console.error(error);
            this.setState({error: "Could not share page at this time"});
            this.setState({shareLoading: false});
        });
    }

    handleInviteModalOpen = () => {this.setState({inviteModalOpen: true})};
    handleInviteModalClose = () => {this.setState({inviteModalOpen: false})};

    render() {
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

        /*if (this.props.info.isLoading) {
            return(
                <Modal open={this.props.open} onClose={this.props.onClose.bind(this)}>
                    <Modal.Header>Loading...</Modal.Header>
                </Modal>
            );
        }*/
        function button_rows(events) {
            //if(events != null)
            //console.log(JSON.stringify(events[0]));
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
                <Icon className='close' onClick={() => this.props.onClose()}/>
                {loadingProp(this.props.info.isLoading)}
                {this.errorMessage(this.state.error)}
                <Modal.Header>{this.getClientAttribute("name")}</Modal.Header>
                <Modal.Content image>
                    {this.profilePicture()}
                    <Modal.Description>
                        {/*<Button primary floated='right' loading={this.state.shareLoading} disabled={this.state.shareLoading} onClick={() => this.shareClient()}>Share Page</Button>*/}
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
                                </List.Content>
                            </List.Item>
                        </List>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Content fluid>
                    {this.swipeGallery()}
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={this.handleInviteModalOpen.bind(this)}>Invite to Challenge</Button>
                    <InviteToChallengeModalProp
                        open={this.state.inviteModalOpen}
                        onOpen={this.handleInviteModalOpen.bind(this)}
                        onClose={this.handleInviteModalClose.bind(this)}
                        friendID={this.getClientAttribute("id")}
                    />
                    {this.getCorrectFriendActionButton()}
                </Modal.Actions>
                <Modal.Content>
                    {this.createSuccessLabel()}
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
