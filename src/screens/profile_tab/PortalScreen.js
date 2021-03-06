import React, {  } from 'react'
// import { Player } from 'video-react';
import {Button, Card, Modal, Dimmer, Loader, List, Icon, Label, Divider } from 'semantic-ui-react'
import { Storage } from 'aws-amplify';
import ChallengeList from "../../vastuscomponents/components/lists/ChallengeList";
import {fetchUserAttributes, forceFetchUserAttributes} from "../../redux_helpers/actions/userActions";
import { connect } from "react-redux";
import ClientFunctions from "../../vastuscomponents/database_functions/ClientFunctions";
import {calculateAge} from "../../vastuscomponents/logic/TimeHelper";
import TrainerPostFeed from "./TrainerPostFeed";

// window.LOG_LEVEL='DEBUG';

type Props = {
    open: boolean,
    onClose: any
};

/**
 * Profile
 *
 * This is the profile page which displays information about the current user.
 */
class PortalScreen extends React.PureComponent<Props> {
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
        // console.log("constructor");
        // console.log("constructor props: " + JSON.stringify(props));
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
        // console.log("componentDidMount");
        this.update();
    }

    componentWillReceiveProps(newProps, nextContext) {
        // console.log("componentWillReceiveProps");
        // console.log("receive props: " + JSON.stringify(newProps));
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
        // console.log("Updating. User = " + JSON.stringify(user) + ". State = " + JSON.stringify(this.state));
        if (!user.id) {
            // console.log("ID is not set inside profile... This means a problem has occurred");
        }

        if (!this.props.info.isLoading && !this.state.sentRequest && !(user.id && user.name && user.username && user.birthday && user.profilePicture)) {
            this.state.sentRequest = true;
            this.props.fetchUserAttributes(["name", "username", "birthday", "profileImagePath", "challengesWon", "profilePicture", "friends", "challenges", "ownedChallenges", "completedChallenges"]);
        }
        else {
            this.setState({isLoading: false});
        }
    }

    getTrainerAttribute(attribute) {
        if (this.props.user && this.props.user.id) {
            let trainer = this.props.user;
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
        return null;
    }

    setPicture(event) {
        //console.log(JSON.stringify(this.props));
        if (this.props.user.id) {
            const path = "/ClientFiles/" + this.props.user.id + "/profileImage";
            //console.log("Calling storage put");
            //console.log("File = " + JSON.stringify(event.target.files[0]));
            Storage.put(path, event.target.files[0], { contentType: "video/*;image/*" }).then((result) => {
                // Now we update the database object to reflect this
                //console.log("resulttt:" + JSON.stringify(result));
                //console.log("Successfully put the image, now putting the data into the database!");
                ClientFunctions.updateProfileImagePath(this.props.user.id, this.props.user.id, path,
                    (data) => {
                        //console.log("successfully editted client");
                        //console.log(JSON.stringify(data));
                        this.props.forceFetchUserAttributes(["profileImagePath", "profilePicture"]);
                        this.setState({isLoading: true});
                    }, (error) => {
                        console.log("Failed edit client attribute");
                        console.log(JSON.stringify(error));
                    });
                this.setState({isLoading: true});
            }).catch((error) => {
                console.log("failed storage put");
                console.log(error);
            });
        }
    }

    profilePicture() {
        if (this.props.user.profilePicture) {
            // if (this.state.ifS3) {
            //     // <S3Image size='medium' imgKey={this.state.profilePicture} circular/>
            //     return(
            //         <Item.Image size='medium' src={this.state.profilePicture} circular/>
            //     );
            // }
            /*return(
                <div className="u-avatar u-avatar--large u-margin-x--auto u-margin-top--neg4" style={{backgroundImage: `url(${this.props.user.profilePicture})`}}>
                    <Label as="label" htmlFor="proPicUpload" circular className="u-bg--primaryGradient">
                        <Icon name="upload" className='u-margin-right--0' size="large" inverted />
                    </Label>
                    <input type="file" accept="video/*;capture=camcorder" id="proPicUpload" hidden={true} onChange={this.setPicture}/>
                </div>
            );*/
            //console.log("PROPICIMAGE!!!!: " + this.props.user.profilePicture);
            return (
                <div>
                    <div className="u-avatar u-avatar--large u-margin-x--auto u-margin-top--neg4" style={{backgroundImage: `url(${this.getTrainerAttribute("profilePicture")})`}}>
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

    handleLogOut() {
        // console.log("logging out");
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
        //console.log(JSON.stringify(this.state));
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

        // function numChallengesWon(challengesWon) {
        //     if (challengesWon && challengesWon.length) {
        //         return challengesWon.length;
        //     }
        //     return 0;
        // }

        if (this.state.isLoading) {
            return(
                <Dimmer>
                    <Loader/>
                </Dimmer>
            )
        }

        //This displays some basic user information, a profile picture, buttons to modify some user related attributes,
        //and a switch to set the privacy for the user.
        /*
        For a trainer's portal, we want to display their name / basic info, then links to their challenges/events stuff,
        then finally a feed of their posts.
         */
        return(
            <Modal open={this.props.open} onClose={this.props.onClose.bind(this)}>
                <Card color='purple' fluid raised className="u-margin-top--2">
                    <Card.Content textAlign="center">
                        {this.profilePicture()}
                        <Card.Header as="h2" style={{"margin": "12px 0 0"}}>{this.props.user.name}</Card.Header>
                        <Card.Meta>Age: {calculateAge(this.getTrainerAttribute("birthday"))}</Card.Meta>
                        <Card.Meta>Event Wins: {this.getTrainerAttribute("challengesWonLength")}</Card.Meta>
                        <List id = "profile buttons">
                            <List.Item>
                                <Button primary fluid size="large" onClick={this.openBuddyModal.bind(this)}><Icon name="users" /> Buddy List</Button>
                                <Modal basic size='mini' open={this.state.buddyModalOpen} onClose={this.closeBuddyModal.bind(this)} closeIcon>
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
                                        <ChallengeList challengeIDs={this.props.user.ownedChallenges}/>
                                    </Modal.Content>
                                </Modal>
                            </List.Item>
                            <List.Item>
                                <Button primary fluid size="large" onClick={this.openScheduledModal.bind(this)}><Icon name="checked calendar" /> Scheduled Challenges</Button>
                                <Modal basic size='mini' open={this.state.scheduledModalOpen} onClose={this.closeScheduledModal.bind(this)} closeIcon>
                                    <Modal.Content>
                                        <ChallengeList challengeIDs={this.props.user.challenges}/>
                                    </Modal.Content>
                                </Modal>
                            </List.Item>
                            <List.Item>
                                <Button fluid size="large" onClick={this.openCompletedModal.bind(this)}><Icon name="bookmark outline" />Completed Challenges</Button>
                                <Modal basic size='mini' open={this.state.completedModalOpen} onClose={this.closeCompletedModal.bind(this)} closeIcon>
                                    <Modal.Content>
                                        <ChallengeList challengeIDs={this.props.user.completedChallenges}/>
                                    </Modal.Content>
                                </Modal>
                            </List.Item>
                            <Divider />
                            <List.Item>
                                <Button fluid inverted size="large" onClick={this.handleLogOut.bind(this)} width={5}>Log Out</Button>
                            </List.Item>
                        </List>
                        <TrainerPostFeed trainerID={this.props.user.id}/>
                    </Card.Content>
                </Card>
            </Modal>
        );
    }
}

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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PortalScreen);
