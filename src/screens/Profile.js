import React, {  } from 'react'
import {Button, Card, Modal, Dimmer, Loader, List, Icon, Label, Divider } from 'semantic-ui-react'
import { Storage } from 'aws-amplify';
import BuddyListProp from "./BuddyList";
// import TrophyCaseProp from "./TrophyCase";
import { S3Image } from 'aws-amplify-react';
// import ChallengeManagerProp from "./ManageChallenges";
// import QL from '../GraphQL';
import Lambda from '../Lambda';
import ScheduledEventList from "./ScheduledEventList";
import CompletedEventList from "./CompletedEventList";
import OwnedEventList from "./OwnedEventList";
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import { connect } from "react-redux";
// import AWSSetup from "../AppConfig";
import {logOut} from "../redux_helpers/actions/authActions";

// AWSSetup();

// Storage.configure({level: 'public'});

window.LOG_LEVEL='DEBUG';

/**
* Profile
*
* This is the profile page which displays information about the current user.
 */
class Profile extends React.PureComponent {
    state = {
        isLoading: true,
        checked: false,
        sentRequest: false,
        buddyModalOpen: false,
        scheduledModalOpen: false,
        ownedModalOpen: false,
        error: null
    };

    toggle = () => this.setState({ checked: !this.state.checked });

    constructor(props) {
        // alert("constructor");
        // alert("constructor props: " + JSON.stringify(props));
        super(props);
        // this.setState({isLoading: true, checked: false, error: null});
        // ("Got into Profile constructor");
        this.setPicture = this.setPicture.bind(this);
        this.update = this.update.bind(this);
        this.profilePicture = this.profilePicture.bind(this);
        this.openBuddyModal = this.openBuddyModal.bind(this);
        this.closeBuddyModal = this.closeBuddyModal.bind(this);
        this.openScheduledModal = this.openScheduledModal.bind(this);
        this.closeScheduledModal = this.closeScheduledModal.bind(this);
        this.openOwnedModal = this.openOwnedModal.bind(this);
        this.closeOwnedModal = this.closeOwnedModal.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
    }

    resetState() {
        this.setState({
            isLoading: true,
            checked: false,
            sentRequest: false,
            buddyModalOpen: false,
            scheduledModalOpen: false,
            completedModalOpen: false,
            ownedModalOpen: false,
            error: null,
        });
    }

    componentDidMount() {
        // alert("componentDidMount");
        this.update();
    }

    componentWillReceiveProps(newProps, nextContext) {
        // alert("componentWillReceiveProps");
        // alert("receive props: " + JSON.stringify(newProps));
        if (newProps.user.profileImagePath) {
            this.setState({isLoading: true});
        }
        if (newProps.user && this.props.user && newProps.user.id !== this.props.user.id) {
            this.resetState();
        }
        this.update();
    }

    update() {
        const user = this.props.user;
        // alert("Updating. User = " + JSON.stringify(user) + ". State = " + JSON.stringify(this.state));
        if (!user.id) {
            // alert("ID is not set inside profile... This means a problem has occurred");
        }

        // if (user.id && user.name && user.username && user.birthday) {
            // if (this.state.isLoading) {
                // And start to get the profile image from S3
                // if (user.profileImagePath) {
                    // this.setState({profilePicture: user.profileImagePath, isLoading: false, ifS3: true});
                    // alert("Getting " + user.profileImagePath + " from S3?");
                    // Storage.get(user.profileImagePath).then((data) => {
                    //     // alert("Received properly and setting! Data = " + JSON.stringify(data));
                    //     this.setState({profilePicture: data, isLoading: false, ifS3: true});
                    // }).catch((error) => {
                    //     alert("Error getting profile image");
                    //     alert("Received an error, so not setting. Error = " + JSON.stringify(error));
                    //     this.setState({error: error, isLoading: true});
                    // });
                // }
                // else {
                //     // Default
                //     this.setState({isLoading: false, profilePicture: proPic, ifS3: false});
                // }
            // }
        // }
        if (!this.props.info.isLoading && !this.state.sentRequest && !(user.id && user.name && user.username && user.birthday && user.profilePicture)) {
            this.state.sentRequest = true;
            this.props.fetchUserAttributes(["name", "username", "birthday", "profileImagePath", "challengesWon", "profilePicture", "friends"]);
        }
        else {
            this.setState({isLoading: false});
        }
    }

    setPicture(event) {
        //alert(JSON.stringify(this.props));
        if (this.props.user.id) {
            const path = "/ClientFiles/" + this.props.user.id + "/profileImage";
            //alert("Calling storage put");
            //alert("File = " + JSON.stringify(event.target.files[0]));
            Storage.put(path, event.target.files[0], { contentType: "image/*" }).then((result) => {
                // Now we update the database object to reflect this
                //alert(JSON.stringify(result));
                //alert("Successfully put the image, now putting the data into the database!");
                Lambda.editClientAttribute(this.props.user.id, this.props.user.id, "profileImagePath", path,
                    (data) => {
                        //alert("successfully editted client");
                        //alert(JSON.stringify(data));
                        this.props.forceFetchUserAttributes(["profileImagePath", "profilePicture"]);
                        this.setState({isLoading: true});
                    }, (error) => {
                        alert("Failed edit client attribute");
                        alert(JSON.stringify(error));
                    });
                this.setState({isLoading: true});
            }).catch((error) => {
                alert("failed storage put");
                alert(error);
            });
        }
    }

    profilePicture() {
        console.log(this.state.profilePicture);
        if (this.props.user.profilePicture) {
            // if (this.state.ifS3) {
            //     // <S3Image size='medium' imgKey={this.state.profilePicture} circular/>
            //     return(
            //         <Item.Image size='medium' src={this.state.profilePicture} circular/>
            //     );
            // }
            return(
                <div className="u-avatar" style={{backgroundImage: `url(${this.props.user.profilePicture})`}}>
                    <Label as="label" htmlFor="proPicUpload" circular className="u-bg--primaryGradient">
                        <Icon name="upload" className='u-margin-right--0' size="large" inverted />
                    </Label>
                    <input type="file" accept="image/*" id="proPicUpload" hidden={true} onChange={this.setPicture}/>
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

    handleLogOut() {
        // alert("logging out");
        this.props.logOut();
        // this.setState({isLoading: true});
        // Auth.signOut({global: true}).then((data) => {
        //     console.log("Successfully signed out!");
        //     console.log(data);
        //     this.setState({isLoading: false, username: null});
        //     this.props.signOut();
        // }).catch((error) => {
        //     console.log("Sign out has failed :(");
        //     console.log(error);
        //     this.setState({error: error, isLoading: false});
        // });
    }

    openBuddyModal = () => { this.setState({buddyModalOpen: true}); };
    closeBuddyModal = () => { this.setState({buddyModalOpen: false}); };
    openScheduledModal = () => { this.setState({scheduledModalOpen: true}); };
    closeScheduledModal = () => { this.setState({scheduledModalOpen: false}); };
    openCompletedModal = () => { this.setState({completedModalOpen: true}); };
    closeCompletedModal = () => { this.setState({completedModalOpen: false}); };
    openOwnedModal = () => { this.setState({ownedModalOpen: true}); };
    closeOwnedModal = () => { this.setState({ownedModalOpen: false}); };


    render() {
        //alert(JSON.stringify(this.state));
        /**
         * This creates an error message from the given error string
         * @param error A string containing the error message that was invoked
         * @returns {*} Returns a Semantic-ui script for displaying the error
         */
        // function errorMessage(error) {
        //     if (error) {
        //         return (
        //             <Message color='red'>
        //                 <h1>Error!</h1>
        //                 <p>{error}</p>
        //             </Message>
        //         );
        //     }
        // }

        /**
         *
         * @param profilePicture Displays the
         * @returns {*}
         */

        function numChallengesWon(challengesWon) {
            if (challengesWon && challengesWon.length) {
                return challengesWon.length;
            }
            return 0;
        }

        if (this.state.isLoading) {
            return(
                <Dimmer>
                    <Loader/>
                </Dimmer>
            )
        }

        //This displays some basic user information, a profile picture, buttons to modify some user related attributes,
        //and a switch to set the privacy for the user.
        return(
            <Card fluid raised>
                <Card.Content textAlign="center">
                    {this.profilePicture()}
                    <Card.Header as="h2" style={{"margin": "12px 0 0"}}>{this.props.user.name}</Card.Header>
                    <Card.Meta>Event Wins: {numChallengesWon(this.props.user.challengesWon)}</Card.Meta>
                    <List id = "profile buttons">
                        <List.Item>
                            <Button primary fluid size="large" onClick={this.openBuddyModal.bind(this)}><Icon name="users" /> Buddy List</Button>
                            <Modal size='mini' open={this.state.buddyModalOpen} onClose={this.closeBuddyModal.bind(this)} closeIcon>
                                <Modal.Content image>
                                    <BuddyListProp/>
                                </Modal.Content>
                            </Modal>
                        </List.Item>
                        <Divider />
                        <List.Item>
                            <Button primary fluid size="large" onClick={this.openOwnedModal.bind(this)}><Icon name="trophy" /> Created Challenges</Button>
                            <Modal basic size='mini' open={this.state.ownedModalOpen} onClose={this.closeOwnedModal.bind(this)} closeIcon>
                                <Modal.Content>
                                    <OwnedEventList/>
                                </Modal.Content>
                            </Modal>
                        </List.Item>
                        <List.Item>
                            <Button primary fluid size="large" onClick={this.openScheduledModal.bind(this)}><Icon name="checked calendar" /> Scheduled Challenges</Button>
                            <Modal basic size='mini' open={this.state.scheduledModalOpen} onClose={this.closeScheduledModal.bind(this)} closeIcon>
                                <Modal.Content>
                                    <ScheduledEventList/>
                                </Modal.Content>
                            </Modal>
                        </List.Item>
                        <List.Item>
                            <Button fluid size="large" onClick={this.openCompletedModal.bind(this)}><Icon name="bookmark outline" />Completed Challenges</Button>
                            <Modal basic size='mini' open={this.state.completedModalOpen} onClose={this.closeCompletedModal.bind(this)} closeIcon>
                                <Modal.Content>
                                    <CompletedEventList/>
                                </Modal.Content>
                            </Modal>
                        </List.Item>
                        <Divider />
                        <List.Item>
                            <Button fluid inverted size="large" onClick={this.handleLogOut.bind(this)} width={5}>Log Out</Button>
                        </List.Item>
                    </List>       
                </Card.Content>          
            </Card>
        );
    }
}

// {/*<div className="Privacy Switch">*/}
//     {/*<Checkbox toggle onClick={this.handleAccessSwitch} onChange={this.toggle} checked={this.state.checked}/>*/}
//     {/*<div>{this.state.userInfo.access}</div>*/}
// {/*</div>*/}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (attributesList) => {
            dispatch(fetchUserAttributes(attributesList));
        },
        forceFetchUserAttributes: (variablesList) => {
            dispatch(forceFetchUserAttributes(variablesList));
        },
        logOut: () => {
            dispatch(logOut());
        }
        // fetchUser: (username) => {
        //     dispatch(fetchUser(username));
        // }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);