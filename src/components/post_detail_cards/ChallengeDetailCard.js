import React, { Component } from 'react';
import {Card, Modal, Button, Header, List, Divider, Grid, Message, Dimmer, Loader} from 'semantic-ui-react';
// import EventMemberList from "../screens/EventMemberList";
import { connect } from 'react-redux';
// import QL from '../GraphQL';
import { fetchClient, forceFetchPost, fetchPost, fetchChallenge, forceFetchChallenge } from "../../redux_helpers/actions/cacheActions";
// import CompleteChallengeModal from "../screens/CompleteChallengeModal";
import { convertFromISO } from "../../logic/TimeHelper";
import { forceFetchUserAttributes } from "../../redux_helpers/actions/userActions";
import PostFunctions from "../../databaseFunctions/PostFunctions.js";
import {Player} from "video-react";
import ChallengeCard from "../ChallengeCard";
import { Storage } from "aws-amplify";
import ClientModal from "../ClientModal";
// import CommentScreen from "../screens/CommentScreen";
// import VideoUploadScreen from "../screens/VideoUploadScreen";

// function convertTime(time) {
//     if (parseInt(time, 10) > 12) {
//         return "0" + (parseInt(time, 10) - 12) + time.substr(2, 3) + "pm";
//     }
//     else if (parseInt(time, 10) === 12) {
//         return time + "pm";
//     }
//     else if (parseInt(time, 10) === 0) {
//         return "0" + (parseInt(time, 10) + 12) + time.substr(2, 3) + "am"
//     }
//     else {
//         return time + "am"
//     }
// }
//
// function convertDate(date) {
//     let dateString = String(date);
//     let year = dateString.substr(0, 4);
//     let month = dateString.substr(5, 2);
//     let day = dateString.substr(8, 2);
//
//     return month + "/" + day + "/" + year;
// }

/*
* Event Description Modal
*
* This is the event description which displays more in depth information about a challenge, and allows the user
* to join the challenge.
 */
class ChallengeDetailCard extends Component {
    state = {
        // isLoading: false,
        postID: null,
        // event: null,
        // ownerName: null,
        // members: {},
        clientModalOpen: false
        // completeModalOpen: false,
        // isLeaveLoading: false,
        // isDeleteLoading: false,
        // isJoinLoading: false,
        // joinRequestSent: false,
        // canCallChecks: true,
    };

    constructor(props) {
        super(props);
        // this.handleJoinChallengeButton = this.handleJoinChallengeButton.bind(this);
        // this.handleLeaveChallengeButton = this.handleLeaveChallengeButton.bind(this);
        this.handleDeletePostButton = this.handleDeletePostButton.bind(this);
        // this.handleLeave = this.handleLeave.bind(this);
        // this.handleJoin = this.handleJoin.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.isOwned = this.isOwned.bind(this);
    }

    componentDidMount() {
        // this.isJoined();
        this.isOwned();
        //console.log("Mount Owned: " + this.state.isOwned);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.postID && !this.state.postID) {
            this.state.postID = newProps.postID;
        }
        const by = this.getPostAttribute("by");
        if (!this.props.open && newProps.open && newProps.postID && by) {
            this.props.fetchClient(by, ["id", "name", "gender", "birthday", "profileImagePath", "profileImagePaths"]);
            this.props.fetchChallenge(this.getPostAttribute("about"), ["id", "title", "time", "time_created", "owner", "members", "capacity", "difficulty"]);
        }
    }

    getPostAttribute(attribute) {
        if (this.state.postID) {
            let post = this.props.cache.posts[this.state.postID];
            if (post) {
                if (attribute.substr(attribute.length - 6) === "Length") {
                    attribute = attribute.substr(0, attribute.length - 6);
                    if (post[attribute] && post[attribute].length) {
                        return post[attribute].length;
                    }
                    else {
                        return 0;
                    }
                }
                return post[attribute];
            }
        }
        else {
            return null;
        }
    }

    getOwnerName() {
        const owner = this.getPostAttribute("by");
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

    handleDeletePostButton() {
        //console.log("Handling deleting the event");
        this.setState({isLoading: true});
        PostFunctions.delete(this.props.user.id, this.getPostAttribute("id"), (data) => {
            this.forceUpdate(data.id);
            // console.log(JSON.stringify(data));
            this.setState({isDeleteLoading: false, event: null, isOwned: false});
        }, (error) => {
            // console.log(JSON.stringify(error));
            this.setState({isDeleteLoading: false, error: error});
        })
    }

    getClientAttribute(attribute) {
        if (this.getPostAttribute("by")) {
            //console.log(this.getPostAttribute("by"));
            let client = this.props.cache.clients[this.getPostAttribute("by")];
            if (client) {
                //console.log("Found Client in Challenge");
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

    profilePicture() {
        if (this.getClientAttribute("profileImagePaths") !== [] || this.getClientAttribute("profileImagePaths") !== null) {
            /*if(!this.state.urlsSet) {
                console.log(JSON.stringify("Paths being passed in: " + this.props.user.profileImagePaths));
                this.setURLS(this.getClientAttribute("profileImagePaths"));
                console.log("Setting URLS: " + this.state.galleryURLS);
                this.setState({urlsSet: true});
            }*/
            //console.log(this.getClientAttribute("profilePicture"));
            return(
                <div avatar align="center" className="ui u-avatar tiny" style={{backgroundImage: `url(${this.getClientAttribute("profilePicture")})`, width: '50px', height: '50px'}}></div>
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

    // handleLeaveChallengeButton() {
    //     //console.log("Handling leaving the event");
    //     this.setState({isLoading: true});
    //     Lambda.removeClientFromEvent(this.props.user.id, this.props.user.id, this.getChallengeAttribute("id"), (data) => {
    //         this.forceUpdate(data.id);
    //         //console.log(JSON.stringify(data));
    //         this.setState({isLeaveLoading: false, isJoined: false});
    //     }, (error) => {
    //         //console.log(JSON.stringify(error));
    //         this.setState({isLeaveLoading: false, error: error});
    //     })
    // }

    // handleJoinChallengeButton() {
    //     //console.log("Handling joining the event");
    //     this.setState({isLoading: true});
    //     Lambda.clientJoinEvent(this.props.user.id, this.props.user.id, this.getChallengeAttribute("id"),
    //         (data) => {
    //             this.forceUpdate(data.id);
    //             //console.log(JSON.stringify(data));
    //             this.setState({isJoinLoading: false, isJoined: true});
    //         }, (error) => {
    //             this.setState({isJoinLoading: false, error: error});
    //         })
    // }

    // isJoined() {
    //     const members = this.getChallengeAttribute("members");
    //     if (members) {
    //         const isMembers = members.includes(this.props.user.id);
    //         //console.log("Is Members?: " + isMembers);
    //         this.setState({isJoined: isMembers});
    //         //console.log("am I in members?: " + members.includes(this.props.user.id));
    //     }
    //     else {
    //         this.setState({isJoined: false});
    //     }
    // }

    isOwned() {
        this.setState({isOwned: this.props.user.id === this.getPostAttribute("by")});
    }

    // handleLeave() {
    //     this.setState({isLeaveLoading: true});
    //     this.handleLeaveChallengeButton();
    // }
    // handleJoin() {
    //     this.setState({isJoinLoading: true});
    //     this.handleJoinChallengeButton();
    // }
    handleDelete() {
        this.setState({isDeleteLoading: true});
        this.handleDeleteEventButton();
    }

    // isCompleted() {
    //     return this.getChallengeAttribute("ifCompleted");
    // }

    openClientModal = () => {
        if (!this.state.clientModalOpen) {
            this.setState({clientModalOpen: true})
            this.props.fetchClient(this.getPostAttribute("by"), ["id", "name", "gender", "birthday", "profileImagePath", "profileImagePaths"]);
        };
    }
    closeClientModal = () => {
        console.log("Closing client modal");
        this.setState({clientModalOpen: false})
    };

    // openCompleteModal() { this.setState({completeModalOpen: true}); }
    // closeCompleteModal() { this.setState({completeModalOpen: false}); }

    forceUpdate = (postID) => {
        this.props.forceFetchPost(postID, ["time_created", "by", "description", "about", "access", "postType", "picturePaths", "videoPaths"]);
        this.props.forceFetchChallenge(this.getPostAttribute("about"), ["tags", "time_created"])
    };

    displayError() {
        if(this.state.error === "Error while trying to update an item in the database safely. Error: The item failed the checkHandler: That challenge is already filled up!") {
            return (<Message negative>
                <Message.Header>Sorry!</Message.Header>
                <p>That challenge is already filled up!</p>
            </Message>);
        }

    }

    getDisplayMedia() {
        // TODO How to properly display videos and pictures?
        const pictures = this.getPostAttribute("picturePaths");
        const videos = this.getPostAttribute("videoPaths");
        if (videos && videos.length > 0) {
            if (!this.state.videoURL) {
                const video = videos[0];
                Storage.get(video).then((url) => {
                    this.setState({videoURL: url});
                }).catch((error) => {
                    console.error(error);
                });
            }
            else {
                return (
                    <Player inline={true}>
                        <source src={this.state.videoURL} type="video/mp4"/>
                    </Player>
                );
            }
        }
    }

    clientOrTrainerModal() {
        return (<ClientModal
            clientID={this.getPostAttribute("by")}
            open={this.state.clientModalOpen}
            onOpen={this.openClientModal.bind(this)}
            onClose={this.closeClientModal.bind(this)}
        />);
    }

    render() {
        // function convertFromISO(dateTime) {
        //     let dateTimeString = String(dateTime);
        //     let dateTimes = String(dateTimeString).split("_");
        //     let fromDateString = dateTimes[0];
        //     let toDateString = dateTimes[1];
        //     let fromDate = new Date(fromDateString);
        //     let toDate = new Date(toDateString);
        //
        //     // Display time logic came from stack over flow
        //     // https://stackoverflow.com/a/18537115
        //     const fromHourInt = fromDate.getHours() > 12 ? fromDate.getHours() - 12 : fromDate.getHours();
        //     const toHourInt = toDate.getHours() > 12 ? toDate.getHours() - 12 : toDate.getHours();
        //     const fromminutes = fromDate.getMinutes().toString().length === 1 ? '0'+ fromDate.getMinutes() : fromDate.getMinutes(),
        //         fromhours = fromHourInt.toString().length === 1 ? '0'+ fromHourInt : fromHourInt,
        //         fromampm = fromDate.getHours() >= 12 ? 'PM' : 'AM',
        //         tominutes = toDate.getMinutes().toString().length === 1 ? '0'+ toDate.getMinutes() : toDate.getMinutes(),
        //         tohours = toHourInt.toString().length === 1 ? '0'+ toHourInt : toHourInt,
        //         toampm = toDate.getHours() >= 12 ? 'PM' : 'AM',
        //         months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        //         days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        //     return days[fromDate.getDay()]+', '+months[fromDate.getMonth()]+' '+fromDate.getDate()+', '+fromDate.getFullYear()+' '+fromhours+':'+fromminutes+fromampm + ' - '+tohours+':'+tominutes+toampm;
        // }

        if (!this.getPostAttribute("id")) {
            return(
                null
            );
        }
        if(this.state.canCallChecks) {
            this.isOwned();
            //console.log("Render Owned: " + this.state.isOwned);
            this.setState({canCallChecks: false});
            //console.log("Members: " + this.getChallengeAttribute("members") + "Joined?:  " + this.state.isJoined);
        }

        //This modal displays the challenge information and at the bottom contains a button which allows the user
        //to join a challenge.
        function createCorrectButton(isOwned, deleteHandler, isDeleteLoading) {
            //console.log("Owned: " + isOwned + " Joined: " + isJoined);
            // console.log(ifCompleted);
            if(isOwned) {
                // TODO This should also link the choose winner button
                return(
                    <div>
                        <Button loading={isDeleteLoading} fluid negative size="large" disabled={isDeleteLoading} onClick={deleteHandler}>Delete</Button>
                    </div>
                );
            }
            else {
                //console.log(isJoinLoading);
                return null;
            }
        }

        //console.log("Challenge Info: " + JSON.stringify(this.state.event));
        return(
            <Card fluid>
                {/*this.getPostAttribute("by")*/}
                {/*<Card.Header>
                    <Button className="u-button--flat" onClick={ () => {this.openClientModal()}}>
                        <Grid style={{marginLeft: '10px', marginTop: '10px'}}>
                            <Grid.Column width={6}>
                                {this.profilePicture()}
                            </Grid.Column>
                            <Grid.Column width={5} floated='center' style={{marginTop: '15px'}}>
                                {this.getOwnerName()}
                            </Grid.Column>
                        </Grid>
                        <ClientModal open={this.state.clientModalOpen} onClose={this.closeClientModal} clientID={this.getPostAttribute("by")}/>
                    </Button>
                </Card.Header>*/}
                {/*console.log(this.getPostAttribute("by"))*/}
                <ChallengeCard challengeID={this.getPostAttribute("about")}/>
            </Card>
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
        fetchChallenge: (id, variablesList) => {
            dispatch(fetchChallenge(id, variablesList));
        },
        forceFetchChallenge: (id, variablesList) => {
            dispatch(forceFetchChallenge(id, variablesList));
        },
        forceFetchUserAttributes: (attributeList) => {
            dispatch(forceFetchUserAttributes(attributeList));
        },
        fetchPost: (id, variablesList) => {
            dispatch(fetchPost(id, variablesList));
        },
        forceFetchPost: (id, variablesList) => {
            dispatch(forceFetchPost(id, variablesList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeDetailCard);
