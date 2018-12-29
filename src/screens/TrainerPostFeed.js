import React, {Component, Fragment} from 'react';
import _ from 'lodash';
import {Visibility, Header, Icon, Message} from 'semantic-ui-react';
import PostCard from "../components/PostCard";
import QL from "../GraphQL";
import { connect } from 'react-redux';
// import ScheduledEventsList from "./ScheduledEventList";
import {fetchPost, fetchTrainer, forceFetchTrainer, putClientQuery, putPost, putPostQuery} from "../redux_helpers/actions/cacheActions";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import CreatePostProp from "./CreatePost";
// import CreateEventProp from "./CreateEvent";
// import WorkoutSelectionList from "./WorkoutSelectionList";
// import CreateChallengeProp from "./CreateChallenge"
// import {Tab} from "semantic-ui-react/dist/commonjs/modules/Tab/Tab";
// import * as AWS from "aws-sdk";

// AWS.config.update({region: 'REGION'});
// AWS.config.credentials = new AWS.CognitoIdentityCredentials(
//     {IdentityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222'});

type Props = {
    trainerID: string
};

/**
 * Post Feed
 *
 * This is the main feed in the home page, it currently displays all public events inside of the database for
 * the user to see.
 */
class TrainerPostFeed extends Component<Props> {
    state = {
        isLoading: true,
        trainerID: null,
        shownPostIDs: [],
        hiddenPostIDs: [],
        posts: [],
        // challenges: [],
        clientNames: {}, // id to name
        postFeedLength: 10,
        nextToken: null,
        ifFinished: false,
        calculations: {
            topVisible: false,
            bottomVisible: false
        },
    };

    constructor(props) {
        super(props);
        this.forceUpdate = this.forceUpdate.bind(this);
        // this.queryPosts = this.queryPosts.bind(this);
    }

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        // console.log("Set state to userID = " + newProps.userID);
        if (this.state.trainerID !== newProps.trainerID) {
            this.setState({isLoading: true, trainerID: newProps.trainerID});
            this.props.fetchTrainer(newProps.trainerID, ["posts"], (trainer) => {
                this.setState({isLoading: false});
                if (trainer && trainer.posts && trainer.posts.length) {
                    for (let i = 0; i < trainer.posts.length; i++) {
                        this.props.fetchPost(trainer.posts[i], ["by", "about", "time_created", "access", "description", "postType", "picturePaths", "videoPaths"], (post) => {
                            this.state.hiddenPostIDs.push(post.id);
                        });
                    }
                }
            });
            // console.log("fetchin user attributes");
            // this.props.fetchUserAttributes(["friends"],
            //     (data) => {
            //         // console.log("finished");
            //         this.queryPosts()
            //     });
        }
    }

    addAnotherPost() {
        this.state.shownPostIDs.push(this.state.hiddenPostIDs.pop(0));
    }

    /**
     *
     * @param e
     * @param calculations
     */
    handleUpdate = (e, { calculations }) => {
        this.setState({ calculations });
        // console.log(calculations.bottomVisible);
        if (calculations.bottomVisible) {
            this.addAnotherPost();
        }
    };

    forceUpdate = () => {
        this.props.forceFetchTrainer(this.props.trainerID, ["posts"]);
    };

    render() {
        /**
         * This function takes in a list of posts and displays them in a list of Post Card views.
         * @param posts
         * @returns {*}
         */
        function rows(posts) {
            // if(events != null && events.length > 0)
            //     console.log(JSON.stringify(events[0].id));
            // console.log("EVENTS TO PRINT: ");
            // console.log(JSON.stringify(events));
            return _.times(posts.length, i => (
                <Fragment key={i + 1}>
                    <PostCard postID={posts[i]}/>
                </Fragment>
            ));
        }

        //This displays the rows in a grid format, with visibility enabled so that we know when the bottom of the page
        //is hit by the user.
        if (this.state.isLoading) {
            return(
                <Message icon>
                    <Icon name='spinner' size="small" loading />
                    <Message.Content>
                        <Message.Header>
                            Loading...
                        </Message.Header>
                    </Message.Content>
                </Message>
            );
        }
        else if (this.state.shownPostIDs.length > 0 || this.state.hiddenPostIDs.length > 0) {
            return (
                <Visibility onUpdate={this.handleUpdate}>
                    <Header sub>Recent Posts:</Header>
                    {rows(this.state.shownPostIDs)}
                </Visibility>
            );
        }
        else {
            return(
                <Message>No posts yet!</Message>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info,
    cache: state.cache
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (variablesList, dataHandler) => {
            dispatch(fetchUserAttributes(variablesList, dataHandler));
        },
        fetchTrainer: (id, variableList, dataHandler) => {
            dispatch(fetchTrainer(id, variableList, dataHandler));
        },
        forceFetchTrainer: (id, variableList, dataHandler) => {
            dispatch(forceFetchTrainer(id, variableList, dataHandler));
        },
        fetchPost: (id, variablesList) => {
            dispatch(fetchPost(id, variablesList));
        },
        putPost: (post) => {
            dispatch(putPost(post));
        },
        // putPostQuery: (queryString, queryResult) => {
        //     dispatch(putPostQuery(queryString, queryResult));
        // },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TrainerPostFeed);
