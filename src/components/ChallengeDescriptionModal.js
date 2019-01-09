import React, { Component, Fragment } from 'react';
import {Icon, Modal, Button, Header, List, Divider, Grid, Message, Image, Tab, Dimmer, Label, Loader, Segment } from 'semantic-ui-react';
import ClientModal from "./ClientModal";
// import Lambda from '../Lambda';
// import EventMemberList from "../screens/EventMemberList";
import { connect } from 'react-redux';
// import QL from '../GraphQL';
import { convertFromISO } from "../logic/TimeHelper";
import {fetchClient, forceFetchChallenge, fetchChallenge, clearChallengeQuery} from "../redux_helpers/actions/cacheActions";
import CompleteChallengeModal from "../screens/CompleteChallengeModal";
import {forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import VideoUploadScreen from "../screens/VideoUploadScreen";
import CommentScreen from "../screens/CommentScreen";
import ChallengeMemberList from "../screens/ChallengeMemberList";
import UserFunctions from "../databaseFunctions/UserFunctions";
import InviteFunctions from "../databaseFunctions/InviteFunctions";
import ChallengeFunctions from "../databaseFunctions/ChallengeFunctions";
import CreateSubmissionModal from "../screens/CreateSubmissionModal";
import SubmissionsScreen from "../screens/SubmissionsScreen";

type Props = {
    open: boolean,
    onClose: any,
    challengeID: string
}

/*
* Event Description Modal
*
* This is the event description which displays more in depth information about a challenge, and allows the user
* to join the challenge.
 */
class ChallengeDescriptionModal extends Component<Props> {
    state = {
        isLoading: false,
        isOwned: false,
        isJoined: false,
        isCompleted: false,
        isRequesting: false,
        isRestricted: false,
        challengeID: null,
        // event: null,
        // ownerName: null,
        // members: {},
        clientModalOpen: false,
        completeModalOpen: false,
        submitModalOpen: false,
        isLeaveLoading: false,
        isDeleteLoading: false,
        isJoinLoading: false,
        isRequestLoading: false,
        joinRequestSent: false,
        canCallChecks: true,
    };

    resetState(challengeID) {
        this.setState({
            isLoading: false,
            isOwned: false,
            isJoined: false,
            isCompleted: false,
            isRequesting: false,
            isRestricted: false,
            challengeID: challengeID,
            // event: null,
            // ownerName: null,
            // members: {},
            clientModalOpen: false,
            completeModalOpen: false,
            submitModalOpen: false,
            isLeaveLoading: false,
            isDeleteLoading: false,
            isJoinLoading: false,
            isRequestLoading: false,
            joinRequestSent: false,
            canCallChecks: true,
        });
    }

    constructor(props) {
        super(props);
        this.handleJoinChallengeButton = this.handleJoinChallengeButton.bind(this);
        this.handleRequestChallengeButton = this.handleRequestChallengeButton.bind(this);
        this.handleLeaveChallengeButton = this.handleLeaveChallengeButton.bind(this);
        this.handleDeleteChallengeButton = this.handleDeleteChallengeButton.bind(this);
        this.isOwned = this.isOwned.bind(this);
        this.isJoined = this.isJoined.bind(this);
        this.isRequesting = this.isRequesting.bind(this);
        this.isRestricted = this.isRestricted.bind(this);
        this.isCompleted = this.isCompleted.bind(this);
        this.closeClientModal = this.closeClientModal.bind(this);
        this.openClientModal = this.openClientModal.bind(this);
        this.closeCompleteModal = this.closeCompleteModal.bind(this);
        this.openCompleteModal = this.openCompleteModal.bind(this);
        this.openSubmitModal = this.openSubmitModal.bind(this);
        this.closeSubmitModal = this.closeSubmitModal.bind(this);
    }

    componentDidMount() {
        this.isJoined();
        this.isOwned();
        this.isCompleted();
        this.isRequesting();
        this.isRestricted();
        //alert("Mount Owned: " + this.state.isOwned);
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.challengeID !== this.state.challengeID) {
            // alert("resetting state to " + newProps.challengeID);
            this.resetState(newProps.challengeID);
        }

        const members = this.getChallengeAttribute("members");
        if (!this.props.open && newProps.open && newProps.eventID && members && members.length > 0) {
            for (let i = 0; i < members.length; i++) {
                this.props.fetchClient(members[i], ["id", "name", "gender", "birthday", "profileImagePath", "profilePicture"], () => {
                    this.setState({});
                });
            }
        }
    }

    displayTagIcons(tags) {
        if(tags) {
            if (tags.length === 1) {
                return (
                    <Image avatar src={require('../img/' + tags[0] + '_icon.png')}/>
                );
            }
            else if (tags.length === 2) {
                return (
                    <div>
                        <Image avatar src={require('../img/' + tags[0] + '_icon.png')}/>
                        <Image avatar src={require('../img/' + tags[1] + '_icon.png')}/>
                    </div>
                );
            }
            else if (tags.length === 3) {
                return(
                    <div>
                        <Image avatar src={require('../img/' + tags[0] + '_icon.png')}/>
                        <Image avatar src={require('../img/' + tags[1] + '_icon.png')}/>
                        <Image avatar src={require('../img/' + tags[2] + '_icon.png')}/>
                    </div>
                );
            }
            else if (tags.length === 4) {
                return(
                    <div>
                        <Image avatar src={require('../img/' + tags[0] + '_icon.png')}/>
                        <Image avatar src={require('../img/' + tags[1] + '_icon.png')}/>
                        <Image avatar src={require('../img/' + tags[2] + '_icon.png')}/>
                        <Image avatar src={require('../img/' + tags[3] + '_icon.png')}/>
                    </div>
                );
            }
        }
        else {
            return (
                // "There ain't no tags round these parts partner " + tags
                null
            );
        }
    }

    getChallengeAttribute(attribute) {
        if (this.state.challengeID) {
            let challenge = this.props.cache.challenges[this.state.challengeID];
            if (challenge) {
                if (attribute.substr(attribute.length - 6) === "Length") {
                    attribute = attribute.substr(0, attribute.length - 6);
                    if (challenge[attribute] && challenge[attribute].length) {
                        return challenge[attribute].length;
                    }
                    else {
                        return 0;
                    }
                }
                return challenge[attribute];
            }
        }
        else {
            return null;
        }
    }

    getOwnerName() {
        const owner = this.getChallengeAttribute("owner");
        if (owner) {
            if (this.props.cache.clients[owner]) {
                return this.props.cache.clients[owner].name
            }
            // else if (!this.props.info.isLoading) {
            //     this.props.fetchClient(owner, ["name"]);
            // }
        }
        return null;
    }

    handleDeleteChallengeButton() {
        //alert("Handling deleting the event");
        this.setState({isDeleteLoading: true, isLoading: true});
        ChallengeFunctions.delete(this.props.user.id, this.getChallengeAttribute("id"), (data) => {
            this.forceUpdate(data.id);
            // alert(JSON.stringify(data));
            this.setState({isLoading: false, isDeleteLoading: false, event: null, isOwned: false, isJoined: false});
            this.props.onClose();
        }, (error) => {
            // alert(JSON.stringify(error));
            this.setState({isLoading: false, isDeleteLoading: false, error: error});
        })
    }

    handleLeaveChallengeButton() {
        //alert("Handling leaving the event");
        this.setState({isLeaveLoading: true, isLoading: true});
        UserFunctions.removeChallenge(this.props.user.id, this.props.user.id, this.getChallengeAttribute("id"), (data) => {
            this.forceUpdate(data.id);
            //alert(JSON.stringify(data));
            this.setState({isLoading: false, isLeaveLoading: false, isJoined: false});
        }, (error) => {
            //alert(JSON.stringify(error));
            this.setState({isLoading: false, isLeaveLoading: false, error: error});
        })
    }

    handleJoinChallengeButton() {
        //alert("Handling joining the event");
        this.setState({isJoinLoading: true, isLoading: true});
        UserFunctions.addChallenge(this.props.user.id, this.props.user.id, this.getChallengeAttribute("id"),
            () => {
                this.forceUpdate();
                //alert(JSON.stringify(data));
                this.setState({isLoading: false, isJoinLoading: false, isJoined: true});
            }, (error) => {
                this.setState({isLoading: false, isJoinLoading: false, error: error});
            })
    }

    handleRequestChallengeButton() {
        this.setState({isRequestLoading: true, isLoading: true});
        InviteFunctions.createChallengeRequest(this.props.user.id, this.props.user.id, this.getChallengeAttribute("id"),
            () => {
                this.forceUpdate();
                this.setState({isLoading: false, isRequestLoading: false, isRequesting: true});
            }, (error) => {
                this.setState({isLoading: false, isRequestLoading: false, error: error})
            });
    }

    isJoined() {
        const members = this.getChallengeAttribute("members");
        if (members) {
            const isMembers = members.includes(this.props.user.id);
            //alert("Is Members?: " + isMembers);
            this.setState({isJoined: isMembers});
            //alert("am I in members?: " + members.includes(this.props.user.id));
        }
        else {
            this.setState({isJoined: false});
        }
    }

    isRequesting() {
        const memberRequests = this.getChallengeAttribute("memberRequests");
        if (memberRequests) {
            this.setState({isRequesting: memberRequests.includes(this.props.user.id)});
        }
    }

    isRestricted() {
        this.setState({isRestricted: this.getChallengeAttribute("restriction") === "invite"});
    }

    isOwned() {
        this.setState({isOwned: this.props.user.id === this.getChallengeAttribute("owner")});
    }

    isCompleted() {
        this.setState({ifCompleted: this.getChallengeAttribute("ifCompleted") === "true"});
    }

    openClientModal() { this.setState({clientModalOpen: true}); }
    closeClientModal() { this.setState({clientModalOpen: false}); }

    openCompleteModal() { this.setState({completeModalOpen: true}); }
    closeCompleteModal() { this.setState({completeModalOpen: false}); }

    openSubmitModal() { this.setState({submitModalOpen: true}); }
    closeSubmitModal() { this.setState({submitModalOpen: false}); }

    forceUpdate() {
        forceFetchChallenge(this.getChallengeAttribute("id"), ["owner",
            "time", "capacity", "title", "description", "difficulty", "memberIDs", "memberRequests", "access", "restriction", "prize"]);
    };

    displayError() {
        if (this.state.error === "Error while trying to update an item in the database safely. Error: The item failed the checkHandler: That challenge is already filled up!") {
            return (<Message negative>
                <Message.Header>Sorry!</Message.Header>
                <p>That challenge is already filled up!</p>
            </Message>);
        }

    }

    //This modal displays the challenge information and at the bottom contains a button which allows the user
    //to join a challenge.
    createCorrectButton() {
        const panes = [
            { menuItem: 'Submissions', render: () => (
                <Tab.Pane basic className='u-border--0 u-padding--0 u-margin-top--3'>
                    <SubmissionsScreen challengeID={this.state.challengeID}/>
                </Tab.Pane>
            )},
            { menuItem: 'Challenge Chat', render: () => (
                <Tab.Pane basic className='u-border--0 u-padding--0 u-margin-top--3'>
                    <CommentScreen curUser={this.props.user.username} curUserID={this.props.user.id} challengeChannel={this.state.challengeID}/>
                </Tab.Pane> 
            )},
        ];

        //alert("Owned: " + isOwned + " Joined: " + isJoined);
        // alert(ifCompleted);
        if (this.state.isCompleted) {
            return(
                <Button disabled fluid inverted size="large">This Event is completed</Button>
            );
        }
        else if (this.state.isOwned) {
            // TODO This should also link the choose winner button
            return (
                <Fragment>
                    <Button primary fluid className='u-margin-bottom--1' onClick={this.openSubmitModal}>Submit Your Entry</Button>
                    <Button loading={this.state.isDeleteLoading} fluid negative size="large" disabled={this.state.isDeleteLoading} onClick={this.handleDeleteChallengeButton}>Delete</Button>
                    <Button primary fluid size="large" onClick={this.openCompleteModal}>Select Winner</Button>
                    <Divider className='u-margin-top--4' />
                    <Tab menu={{ widths: 2, inverted: true }} panes={panes} className='u-challenge u-margin-top--2' />
                </Fragment>
            )
        }
        else if (this.state.isJoined) {
            return (
                <Fragment>
                    <Button primary fluid className='u-margin-bottom--1' onClick={this.openSubmitModal}>Submit Your Entry</Button>
                    <Button loading={this.state.isLeaveLoading} fluid inverted size="large" disabled={this.state.isLeaveLoading} onClick={this.handleLeaveChallengeButton}>Leave</Button>
                    <Divider className='u-margin-top--4' />
                    <Tab menu={{ widths: 2, inverted: true }} panes={panes} className='u-challenge u-margin-top--2' />
                </Fragment>
            )
        }
        else if (this.state.isRestricted) {
            if (this.state.isRequesting) {
                return (
                    <div>
                        <Button inverted fluid size="large" disabled={true}>Request Sent!</Button>
                    </div>
                )
            }
            else {
                return (<div><Button loading={this.state.isRequestLoading} fluid size="large" disabled={this.state.isRequestLoading}
                                onClick={this.handleRequestChallengeButton}>Send Join Request</Button></div>)
            }
        }
        else {
            //alert(isJoinLoading);
            return (<Button loading={this.state.isJoinLoading} fluid size="large" disabled={this.state.isJoinLoading}
                            onClick={this.handleJoinChallengeButton}>Join</Button>)
        }
    }

    createChallengeChatButton() {
        
        return null;
    }
    
   profilePicture() {
        if (this.props.user.profilePicture) {
            
            return (
                <div>
                    <div className="u-avatar u-avatar--large u-margin-x--auto u-margin-top--neg4" style={{backgroundImage: `url(${this.props.user.profilePicture})`}}>
                        <Label as="label" htmlFor="proPicUpload" circular className="u-bg--primaryGradient">
                            <Icon name="upload" className='u-margin-right--0' size="large" inverted />
                        </Label>
                        <input type="file" accept="image/*" id="proPicUpload" hidden={true} onChange={this.setPicture}/>
                    </div>
                </div>
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

    render() {
        if (!this.getChallengeAttribute("id")) {
            return(
                <Modal open={this.props.open} onClose={this.props.onClose.bind(this)}>
                    <Message icon>
                        <Icon name='spinner' size="small" loading />
                        <Message.Content>
                            <Message.Header>
                                Loading...
                            </Message.Header>
                        </Message.Content>
                    </Message>
                </Modal>
            );
        }

        if (this.state.canCallChecks) {
            this.isJoined();
            this.isOwned();
            this.isRequesting();
            this.isCompleted();
            this.isRestricted();
            //alert("Render Owned: " + this.state.isOwned);
            this.setState({canCallChecks: false});
            //alert("Members: " + this.getChallengeAttribute("members") + "Joined?:  " + this.state.isJoined);
        }
	
		 
        //alert("Challenge Info: " + JSON.stringify(this.state.event));
        return(
        	
            <Modal open={this.props.open} onClose={this.props.onClose.bind(this)}>
                <Modal.Header align='center'><div>
                {this.getChallengeAttribute("title")}</div>
                    <div>{this.displayTagIcons(this.getChallengeAttribute("tags"))}</div>
                    <div>
                        {this.props.daysLeft} days left
                    </div>
                    </Modal.Header>
                <Modal.Content align='center'>
                    <Grid>
                        <Grid.Column floated='left' width={6}>
                            <Grid.Row>
                                    <Icon.Group size='large'>
                                        <Icon name='bullseye' />
                                    </Icon.Group> {this.getChallengeAttribute("goal")}
                            </Grid.Row>
                            <Grid.Row>
                                <Icon name='user'/><Button className="u-button--flat"  onClick={this.openClientModal}>{this.getOwnerName()}</Button>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column floated='right' width={6}>
                            <Grid.Row>
                                <div>
                                    <Icon.Group size='large'>
                                        <Icon name='trophy' />
                                    </Icon.Group> {this.getChallengeAttribute("prize")}
                                </div>
                            </Grid.Row>
                            <Grid.Row>
                                <Icon name='users' /><Modal trigger={<Button primary className="u-button--flat u-padding-left--1">Members</Button>} closeIcon>
                                    <Modal.Content>
                                        <ChallengeMemberList challengeID={this.state.challengeID} />
                                    </Modal.Content>
                                </Modal>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid>
                    <Modal.Description>
                        <ClientModal open={this.state.clientModalOpen} onClose={this.closeClientModal} clientID={this.getChallengeAttribute("owner")}/>
                        <CompleteChallengeModal open={this.state.completeModalOpen} onClose={this.closeCompleteModal} challengeID={this.getChallengeAttribute("id")}/>
                        <CreateSubmissionModal open={this.state.submitModalOpen} onClose={this.closeSubmitModal} challengeID={this.getChallengeAttribute("id")}/>
                        {this.createCorrectButton()}
                    </Modal.Description>
                    <div>{this.displayError()}</div>
                    {/*
                        <Modal trigger={<Button primary id="ui center aligned"><Icon name="comment outline"/></Button>}>
                            <Grid>
                                <div id="ui center align">

                                </div>
                            </Grid>
                        </Modal>
                        */}
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
        forceFetchUserAttributes: (attributeList) => {
            dispatch(forceFetchUserAttributes(attributeList));
        },
        fetchChallenge: (id, variablesList) => {
            dispatch(fetchChallenge(id, variablesList));
        },
        forceFetchChallenge: (id, variablesList) => {
            dispatch(forceFetchChallenge(id, variablesList));
        },
        clearChallengeQuery: () => {
            dispatch(clearChallengeQuery());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeDescriptionModal);
