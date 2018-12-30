import React, { Component } from 'react';
import CommentBox from "../components/CommentBox";
import Comments from '../components/Comments';
import { Icon, Message, Divider } from "semantic-ui-react";
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import connect from "react-redux/es/connect/connect";

class CommentScreen extends Component {
    state = {
        currentChannel: '',
        canCallHistory: true,
        comments: [],
        isHistoryLoading: true
    };

    _isMounted = true;

    channelName = "persisted:" + this.props.challengeChannel;
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
                const commentArray = Array.from(page.items.reverse(), item => item.data);

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
            console.log("Received history!");
            const commentArray = Array.from(page.items.reverse(), item => item.data);

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
            <div className='u-margin-top--4'>
                {/*console.log("Comment screen render user: " + this.props.curUser)*/}
                {this.loadHistory(this.state.isHistoryLoading)}
                <Comments comments={this.state.comments}/>
                <Divider className='u-margin-top--4' />
                <CommentBox handleAddComment={this.handleAddComment} curUser={this.props.curUser} curUserID={this.props.curUserID}
                    challengeChannel={this.channelName}/>
            </div>
        );
    }
}

export default CommentScreen;
