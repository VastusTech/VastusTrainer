import React, { Component } from 'react';
import CommentBox from "../components/CommentBox";
import Comments from '../components/Comments';
import { Icon, Message, Divider, Grid } from "semantic-ui-react";
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import {fetchClient, fetchTrainer, fetchMessageQuery, getFetchItemFunction} from "../redux_helpers/actions/cacheActions";
import {
    queryNextMessagesFromBoard,
    clearBoard,
    addMessageToBoard,
    addMessageFromNotification
} from "../redux_helpers/actions/messageActions";
import {setHandlerToBoard} from "../redux_helpers/actions/ablyActions";
import connect from "react-redux/es/connect/connect";
import QL from "../GraphQL";
import { getItemTypeFromID } from "../logic/ItemType";
import ScrollView from "react-inverted-scrollview";

type Props = {
    board: string,
};

class CommentScreen extends Component<Props> {
    state = {
        board: null,
        messages: [],
        isLoading: false,
        fetchLimit: 10,
        canFetch: true,
    };

    constructor(props) {
        super(props);
        // this.handleAddComment = this.handleAddComment.bind(this);
        this.queryMessages = this.queryMessages.bind(this);
    }

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillUnmount() {
        // TODO Unsubscribe to the Ably messages
        // TODO Also potentially clear the board?
    }

    componentWillReceiveProps(newProps, nextContext) {
        if (this.state.board !== newProps.board) {
            this.state.board = newProps.board;
            this.props.setHandlerToBoard(newProps.board, (message) => {
                // If you get a message, then that means that it is definitely a Message?
                // alert("What to do with this?\n\n" + JSON.stringify(message));

                this.props.addMessageFromNotification(newProps.board, message.data);
            });
            // Set up the board
            // this.queryMessages();
            if (this.state.board && !this.props.message.boards[this.state.board]) {
                this.queryMessages();
            }
        }
    }

    queryMessages() {
        // alert("Can we query?");
        if (this.state.canFetch) {
            // alert("QUerying next messages from the board!");
            this.setState({isLoading: true});
            this.props.queryNextMessagesFromBoard(this.state.board, this.state.fetchLimit, (items) => {
                if (items) {
                    // this.setState({messages: [...this.state.messages, ...items]});
                    // for (let i = 0; i < items.length; i++) {
                    //     // Fetch everything we need to!
                    //     const message = items[i];
                    //     const fromItemType = getItemTypeFromID(message.from);
                    //     if (fromItemType === "Client") {
                    //         this.props.fetchClient(message.from, ["name"])
                    //     }
                    //     else if (fromItemType === "Trainer") {
                    //         this.props.fetchTrainer(message.from, ["name"]);
                    //     }
                    // }
                }
                else {
                    // That means we're done getting messages
                    this.setState({canFetch: false});
                }
                this.setState({isLoading: false});
            });
        }
    }

    getBoardMessages() {
        if (this.state.board && this.props.message.boards[this.state.board]) {
            return this.props.message.boards[this.state.board];
        }
        return [];
    }
    scrollToBottom() {
        if (!this.scrollView) return;
        this.scrollView.scrollToBottom();
    }

    scrollToTop() {
        if (!this.scrollView) return;
        this.scrollView.scrollToTop();
    }

    handleScroll = ({ scrollTop, scrollBottom }) => {
        console.log('scrollTop', scrollTop);
        console.log('scrollBottom', scrollBottom);
        if (scrollTop < 1) {
            // Then we fetch new stuff
            this.queryMessages();
        }
    };

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
                <div className='u-margin-top--2'>
                    {/*console.log("Comment screen render user: " + this.props.curUser)*/}
                    {this.loadHistory(this.state.isLoading)}
                    <ScrollView
                        class='chat'
                        width={800}
                        height={400}
                        ref={ref => (this.scrollView = ref)}
                        onScroll={this.handleScroll}
                    >
                        <Comments board={this.state.board} comments={this.getBoardMessages()}/>
                    </ScrollView>
                    <Divider className='u-margin-top--2' />
                    <CommentBox board={this.state.board}/>
                </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache,
    message: state.message
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchClient: (id, variablesList, dataHandler) => {
            dispatch(fetchClient(id, variablesList, dataHandler));
        },
        fetchTrainer: (id, variablesList, dataHandler) => {
            dispatch(fetchTrainer(id, variablesList, dataHandler));
        },
        addMessageToBoard: (board, message) => {
            dispatch(addMessageToBoard(board, message));
        },
        queryNextMessagesFromBoard: (board, limit, dataHandler, failureHandler) => {
            dispatch(queryNextMessagesFromBoard(board, limit, dataHandler, failureHandler));
        },
        clearBoard: (board) => {
            dispatch(clearBoard(board));
        },
        setHandlerToBoard: (board, handler) => {
            dispatch(setHandlerToBoard(board, handler));
        },
        addMessageFromNotification: (board, message, dataHandler, failureHandler) => {
            dispatch(addMessageFromNotification(board, message, dataHandler, failureHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentScreen);
