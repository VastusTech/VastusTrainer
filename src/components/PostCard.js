import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import PostDescriptionModal from './PostDescriptionModal';
import {Player} from "video-react";
import { connect } from 'react-redux';
import { fetchPost, fetchChallenge} from "../redux_helpers/actions/cacheActions";
import ItemType from "../logic/ItemType";
import { Storage } from "aws-amplify";
import SubmissionDetailCard from "./post_detail_cards/SubmissionDetailCard";
import ChallengeDetailCard from "./post_detail_cards/ChallengeDetailCard";
import PostDetailCard from "./post_detail_cards/PostDetailCard";
import ClientDetailCard from "./post_detail_cards/ClientDetailCard";
import TrainerDetailCard from "./post_detail_cards/TrainerDetailCard";
import {convertFromISO} from "../logic/TimeHelper";

type Props = {
    postID: string
};

/*
* Post Card
*
* This is the generic view for how a post shows up in any feeds or lists.
* It is used as a modal trigger in the feed.
 */
class PostCard extends Component {
    state = {
        error: null,
        // isLoading: true,
        postID: null,
        videoURL: null,
        // event: null,
        // members: {},
        // owner: null,
        // ifOwned: false,
        // ifJoined: false,
        // capacity: null,
        postModalOpen: false,
        postMessage: "",
        postMessageSet: false
    };

    constructor(props) {
        super(props);
        this.openPostModal = this.openPostModal.bind(this);
        this.closePostModal = this.closePostModal.bind(this);
        this.getDisplayMedia = this.getDisplayMedia.bind(this);
        this.getPostAttribute = this.getPostAttribute.bind(this);
        this.getCorrectDetailCard = this.getCorrectDetailCard.bind(this);
        this.getOwnerName = this.getOwnerName.bind(this);
    }

    // componentDidMount() {
    // if (this.props.event) {
    //     let ifOwned = false;
    //     let ifJoined = false;
    //     //console.log("Membahs: " + this.props.event.members);
    //     //console.log(this.props.owner + "vs. " + this.props.event.owner);
    //     if (this.props.user.id === this.props.event.owner) {
    //         //console.log("Same owner and cur user for: " + this.props.event.id);
    //         ifOwned = true;
    //     }
    //     if (this.props.event.members && this.props.event.members.includes(this.props.user.id)) {
    //         ifJoined = false;
    //     }
    //
    //     this.setState({isLoading: false, event: this.props.event, members: this.props.event.members, ifOwned, ifJoined});
    // }
    // }
    componentDidMount() {
        this.componentWillReceiveProps(this.props);
        console.log("Post Card Prop: " + this.props.postID);
        //this.props.fetchPost(this.props.postID, ["id", "postType", "Description"])
    }

    componentWillReceiveProps(newProps) {
        if (newProps.postID && !this.state.postID) {
            // this.props.fetchEvent(newProps.eventID, ["id", "title", "goal", "time", "time_created", "owner", "members", "capacity", "difficulty"]);
            this.setState({postID: newProps.postID});
        }
    }

    getPostAttribute(attribute) {
        //alert(this.props.postID);
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
        return null;
    }

    openPostModal = () => {
        if (!this.state.postModalOpen) {
            this.setState({postModalOpen: true})
        };
    }
    closePostModal = () => {this.setState({postModalOpen: false})};

    getDisplayMedia() {
        // TODO How to properly display videos and pictures?
        const pictures = this.getPostAttribute("picturePaths");
        const videos = this.getPostAttribute("videoPaths");
        if (videos && videos.length > 0) {
            //alert(videos[0]);
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

    getOwnerName() {
        const owner = this.getPostAttribute("by");
        //alert(owner.substr(0, 2));
        if (owner.substr(0, 2) === "CL") {
            if (this.props.cache.clients[owner]) {
                //alert(JSON.stringify(this.props.cache.clients[owner]));
                return this.props.cache.clients[owner].name;
            }
            // else if (!this.props.info.isLoading) {
            //     this.props.fetchClient(owner, ["name"]);
            // }
        }
        else if (owner.substr(0, 2) === "TR") {
            if (this.props.cache.trainers[owner]) {
                //alert(JSON.stringify(this.props.cache.clients[owner]));
                return this.props.cache.trainers[owner].name;
            }
            // else if (!this.props.info.isLoading) {
            //     this.props.fetchClient(owner, ["name"]);
            // }
        }
        return null;
    }

    getCorrectDetailCard() {
        let postType = this.getPostAttribute("postType");
        let itemType = this.getPostAttribute("item_type");
        if (postType && postType.length) {
            //alert("Item Type: " + itemType);
            if (postType.substr(0, 3) === "new") {
                // TODO This indicates that this is for a newly created Item
                postType = ItemType[postType.substring(3, postType.length)];
            }
            //alert(itemType);
            if (postType) {
                //alert("Post Type: " + postType);
                // TODO Switch the post types
                if (postType === "Client") {
                    //alert("Client Share Post Spotted!");
                    if(!this.state.postMessageSet) {
                        this.setState({postMessage: "shared a user profile", postMessageSet: true});
                    }
                    return (<ClientDetailCard postID={this.state.postID}/>);
                }
                else if (postType === "Trainer") {
                    if(!this.state.postMessageSet) {
                        this.setState({postMessage: "shared a trainer profile", postMessageSet: true});
                    }
                    return (<TrainerDetailCard postID={this.state.postID}/>);
                }
                else if (postType === "Gym") {
                    //return (<GymDetailCard displayMedia = {this.getDisplayMedia}/>);
                }
                else if (postType === "Workout") {
                    //return (<WorkoutDetailCard displayMedia = {this.getDisplayMedia}/>);
                }
                else if (postType === "Review") {
                    //return (<ReviewDetailCard displayMedia = {this.getDisplayMedia}/>);
                }
                else if (postType === "Event") {
                    //return (<EventDetailCard displayMedia = {this.getDisplayMedia}/>);
                }
                else if (postType === "Challenge") {
                    if(!this.state.postMessageSet) {
                        this.setState({postMessage: "shared a challenge", postMessageSet: true});
                    }
                    return (<ChallengeDetailCard postID={this.state.postID}/>);
                }
                else if (postType === "Invite") {
                    //return (<InviteDetailCard displayMedia = {this.getDisplayMedia}/>);
                }
                else if (postType === "Post") {
                    if(!this.state.postMessageSet) {
                        this.setState({postMessage: "posted", postMessageSet: true});
                    }
                    return (<PostDetailCard postID={this.state.postID}/>);
                }
                else if (postType === "submission") {
                    return (<SubmissionDetailCard postID={this.state.postID}/>);
                }
            }
        }
        else if(itemType) {
            //alert("Item Type: " + itemType);
            if(!this.state.postMessageSet) {
                this.setState({postMessage: "posted", postMessageSet: true});
            }
            return (<PostDetailCard postID={this.state.postID}/>);
        }
        return (<div/>);
    }

    render() {
        if (!this.getPostAttribute("id")) {
            return (
                <Card color='purple' fluid raised>
                    <h1>Loading...</h1>
                </Card>
            );
        }
        return (
            // This is displays a few important pieces of information about the challenge for the feed view.
            <Card color='purple' fluid raised>
                <Card.Header textAlign = 'center'>{this.getOwnerName()} {this.state.postMessage}</Card.Header>
                <Card.Content>
                    <div align='center'>
                        {this.getCorrectDetailCard()}
                    </div>
                    {/*this.getDisplayMedia()*/}
                </Card.Content>
                <Card.Content extra onClick={this.openPostModal}>
                    {/*<Card.Meta textAlign = 'center'>{this.getPostAttribute("description")}</Card.Meta>*/}
                    <div align="center">
                        {convertFromISO(this.getPostAttribute("time_created")).substr(5, 12)}
                    </div>
                    <PostDescriptionModal open={this.state.postModalOpen} onClose={this.closePostModal} postID={this.state.postID}/>
                </Card.Content>
                <Card.Content extra>
                    <Card.Meta textAlign = 'center'>
                        {this.getPostAttribute("access")}
                    </Card.Meta>
                </Card.Content>
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
        fetchPost: (id, variablesList, dataHandler) => {
            dispatch(fetchPost(id, variablesList, dataHandler));
        },
        fetchChallenge: (id, variablesList, dataHandler) => {
            dispatch(fetchChallenge(id, variablesList, dataHandler));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostCard);
