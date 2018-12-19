import React, { Component, Fragment } from 'react';
import VideoUpload from '../components/VideoUpload';
import Comments from '../components/Comments';
import {Grid, Card, Dimmer, Loader, Icon, Message} from "semantic-ui-react";
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import connect from "react-redux/es/connect/connect";

class VideoUploadScreen extends Component {
    state = {
        currentChannel: '',
        canCallHistory: true,
        comments: [],
        isHistoryLoading: true
    };

    _isMounted = true;

    channelName = "persisted:" + this.props.challengeChannel + "_VideoFeed";
    //channelName = this.props.challengeChannel;

    constructor(props) {
        super(props);
        this.handleAddComment = this.handleAddComment.bind(this);
    }

    componentDidMount() {
        /*global Ably*/

        this._isMounted = true;

        //console.error(this.props.challengeChannel);

        const channel = Ably.channels.get(this.channelName);

        let self = this;

        channel.subscribe(function(msg) {
            if(self._isMounted) {
                //console.error(JSON.stringify(msg.data));
                self.setState({comments: self.state.comments.concat(msg.data)});
            }
            self.getHistory();
        });

        channel.attach();
        channel.once('attached', () => {
            channel.history((err, page) => {
                // create a new array with comments only in an reversed order (i.e old to new)
                const commentArray = Array.from(page.items, item => item.data);

                //console.error(JSON.stringify(commentArray));

                this.setState({comments: commentArray});
            });
        });
        //console.error("Comment screen user: " + this.props.curUser);
    }


    componentDidUpdate() {
        //Don't call the history multiple times or else Ably will restrict us lol
        if(this.state.canCallHistory) {
            //console.error("Getting the history");
            this.getHistory();
           //console.error("I should only be called once");
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    update(props) {
        // TODO Change this if we want to actually be able to do something while it's loading
        const user = props.user;
        //console.log("Updating Scheduled Events");
        if (!user.id) {
            // console.error("Pretty bad error");
            this.setState({isLoading: true});
        }

        if (this.state.isLoading && user.hasOwnProperty("scheduledEvents") && user.scheduledEvents && user.scheduledEvents.length) {
            this.setState({isLoading: false});
            for (let i = 0; i < user.scheduledEvents.length; i++) {
                this.props.fetchEvent(user.scheduledEvents[i], ["id", "title", "goal", "time", "time_created", "owner", "ifChallenge", "members", "capacity", "difficulty"]);
                //this.props.fetchEvent(user.scheduledEvent//s[i], ["time", "time_created", "title", "goal", "members"]);
                // if (!(user.scheduledEvents[i] in this.state.events)) {
                //     this.addEventFromGraphQL(user.scheduledEvents[i]);
                // }
            }
        }
        else if (!this.props.info.isLoading) {
            if (!this.state.sentRequest && !this.props.info.error) {
                this.props.fetchUserAttributes(["scheduledEvents"]);
                this.setState({sentRequest: true});
            }
        }
    }

    getChallengeAttribute(attribute) {

    }

    handleAddComment(comment) {
        //console.error("concatted: " + JSON.stringify(this.state.comments.concat(comment)));
        //this.setState({comments: this.state.comments.concat(comment)});
        //console.error("after: " + JSON.stringify(this.state.comments));
        //this.getHistory();
    }

    getHistory() {
        //console.error(this.channelName);
        this.setState({canCallHistory: true});

        const channel = Ably.channels.get(this.channelName);

        this.setState({canCallHistory: false});

        channel.history((err, page) => {
            // create a new array with comments only in an reversed order (i.e old to new)
            const commentArray = Array.from(page.items, item => item.data);

            //console.error(JSON.stringify(commentArray));

            if(this._isMounted) {
                this.setState({comments: commentArray, isHistoryLoading: false});
            }
        });
    }

    loadHistory(historyLoading) {
        if (historyLoading) {
            return (
                    <Message icon>
                        <Icon name='spinner' size="small" loading />
                        <Message.Content>
                            <Message.Header>
                                Loading...
                            </Message.Header>
                        </Message.Content>
                    </Message>
            )
        }
    }

    render() {

        return (
            <Fragment>
                {/*console.error("Comment screen render user: " + this.props.curUser)*/}
                {this.loadHistory(this.state.isHistoryLoading)}
                {/* TODO: This should be removed and replaced at the ChallengeDescriptionModal */}
                {/* <VideoUpload handleAddComment={this.handleAddComment} curUser={this.props.curUser} curUserID={this.props.curUserID}
                                challengeChannel={this.channelName}/> */}
                <Comments comments={this.state.comments}/>
            </Fragment>
        );
    }
}

export default VideoUploadScreen;
