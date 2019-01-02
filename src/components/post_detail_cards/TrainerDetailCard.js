
// TODO These detail cards are going to be embedded into the PostCard component when it is applicable. Reference
// TODO Facebook's little cards within posts when you share something for what I am imagining.

// TODO This will be for a post that is sharing a Trainer with your friends!

// TODO These detail cards are going to be embedded into the PostCard component when it is applicable. Reference
// TODO Facebook's little cards within posts when you share something for what I am imagining.

// TODO This will be for a post that is sharing a Client's profile!

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
import ClientCard from "../ClientCard";
import {Player} from "video-react";
import ChallengeCard from "../ChallengeCard";
import { Storage } from "aws-amplify";
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
class TrainerDetailCard extends Component {
    state = {
        // isLoading: false,
        postID: null,
        // event: null,
        // ownerName: null,
        // members: {},
        trainerModalOpen: false,
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
        //this.getDisplayMedia = this.getDisplayMedia.bind(this);
    }

    componentDidMount() {
        // this.isJoined();
        //console.log("Mount Owned: " + this.state.isOwned);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.postID && !this.state.postID) {
            this.state.postID = newProps.postID;
        }
        const by = this.getPostAttribute("by");
        if (!this.props.open && newProps.open && newProps.postID && by) {
            this.props.fetchTrainer(by, ["id", "name", "gender", "birthday", "profileImagePath", "profilePicture", "profileImagePaths"]);
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
        const owner = this.getPostAttribute("about");
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
            this.setState({isDeleteLoading: false, event: null});
        }, (error) => {
            // console.log(JSON.stringify(error));
            this.setState({isDeleteLoading: false, error: error});
        })
    }

    getTrainerAttribute(attribute) {
        if (this.getPostAttribute("about")) {
            console.log(this.getPostAttribute("about"));
            let trainer = this.props.cache.trainers[this.getPostAttribute("about")];
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

    profilePicture() {
        if (this.getTrainerAttribute("profileImagePaths") !== [] || this.getClientAttribute("profileImagePaths") !== null) {
            /*if(!this.state.urlsSet) {
                console.log(JSON.stringify("Paths being passed in: " + this.props.user.profileImagePaths));
                this.setURLS(this.getClientAttribute("profileImagePaths"));
                console.log("Setting URLS: " + this.state.galleryURLS);
                this.setState({urlsSet: true});
            }*/
            //alert(this.getClientAttribute("profilePicture"));
            return(
                <div avatar align="center" className="ui u-avatar" style={{backgroundImage: `url(${this.getClientAttribute("profilePicture")})`}}></div>
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

    openClientModal() { this.setState({clientModalOpen: true}); }
    closeClientModal() { this.setState({clientModalOpen: false}); }

    // openCompleteModal() { this.setState({completeModalOpen: true}); }
    // closeCompleteModal() { this.setState({completeModalOpen: false}); }

    forceUpdate = (postID) => {
        this.props.forceFetchPost(postID, ["time_created", "by", "description", "about", "access", "postType", "picturePaths", "videoPaths"]);
    };

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
            //console.log("Render Owned: " + this.state.isOwned);
            this.setState({canCallChecks: false});
            //console.log("Members: " + this.getChallengeAttribute("members") + "Joined?:  " + this.state.isJoined);
        }

        //console.log("Challenge Info: " + JSON.stringify(this.state.event));
        return(
            <Card>
                <Card.Header>
                    <ClientCard clientID={this.getPostAttribute("about")}/>
                </Card.Header>
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
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TrainerDetailCard);