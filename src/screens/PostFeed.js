import React, {Component, Fragment} from 'react';
import _ from 'lodash';
import {Visibility, Header} from 'semantic-ui-react';
import PostCard from "../components/PostCard";
import QL from "../GraphQL";
import { connect } from 'react-redux';
// import ScheduledEventsList from "./ScheduledEventList";
import fetchPost, {fetchPostQuery, putClientQuery, putPost, putPostQuery} from "../redux_helpers/actions/cacheActions";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import CreatePostProp from "./CreatePost";
// import CreateEventProp from "./CreateEvent";
// import WorkoutSelectionList from "./WorkoutSelectionList";
// import CreateChallengeProp from "./CreateChallenge"
import {Tab} from "semantic-ui-react/dist/commonjs/modules/Tab/Tab";
// import * as AWS from "aws-sdk";

// AWS.config.update({region: 'REGION'});
// AWS.config.credentials = new AWS.CognitoIdentityCredentials(
//     {IdentityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222'});

/**
 * Post Feed
 *
 * This is the main feed in the home page, it currently displays all public events inside of the database for
 * the user to see.
 */
class PostFeed extends Component {
    state = {
        isLoading: true,
        userID: null,
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
        this.queryPosts = this.queryPosts.bind(this);
    }

    componentDidMount() {
        // this.componentWillReceiveProps(this.props);
        // if (this.props.userID) {
        //     this.setState({userID: this.props.userID});
        //     this.props.fetchUserAttributes(["friends", "invitedEvents"],
        //         (data) => {
        //             // When it has finished
        //             console.log("Finished");
        //             this.queryEvents();
        //         });
        // }
    }

    componentWillReceiveProps(newProps) {
        // console.log("Set state to userID = " + newProps.userID);
        if (this.state.userID !== newProps.userID) {
            this.setState({userID: newProps.userID});
            // console.log("fetchin user attributes");
            this.props.fetchUserAttributes(["friends"],
                (data) => {
                    // console.log("finished");
                    this.queryPosts()
                });
        }
    }

    // queryEvents() {
    //     this.setState({isLoading: true});
    //     if (!this.state.ifFinished) {
    //         // console.log(JSON.stringify(this.props.cache.eventQueries));
    //         QL.queryEvents(["id", "title", "time", "time_created", "address", "owner", "ifCompleted", "members", "capacity", "access"], QL.generateFilter("and",
    //             {"ifCompleted": "eq"}, {"ifCompleted": "false"}), this.state.eventFeedLength,
    //             this.state.nextToken, (data) => {
    //                 if (!data.nextToken) {
    //                     this.setState({ifFinished: true});
    //                 }
    //                 if (data.items) {
    //                     // TODO We can see private events
    //                     // console.log("got items");
    //                     const newlyQueriedEvents = [];
    //                     for (let i = 0; i < data.items.length; i++) {
    //                         const event = data.items[i];
    //                         // console.log(JSON.stringify(event));
    //                         if (event.access === 'public') {
    //                             newlyQueriedEvents.push(event);
    //                         }
    //                         else if (this.props.user.id && this.props.user.id === event.owner) {
    //                             newlyQueriedEvents.push(event);
    //                         }
    //                         else if (this.props.user.friends && this.props.user.friends.includes(event.owner)) {
    //                             newlyQueriedEvents.push(event);
    //                         }
    //                         else if (this.props.user.invitedEvents && this.props.user.invitedEvents.includes(event.id)) {
    //                             newlyQueriedEvents.push(event);
    //                         }
    //                     }
    //                     this.setState({events: [...this.state.events, ...newlyQueriedEvents]});
    //                     for (let i = 0; i < data.items.length; i++) {
    //                         //console.log(data.items[i].time_created);
    //                         // console.log("Putting in event: " + JSON.stringify(data.items[i]));
    //                         // this.setState({events: [...this.state.events, data.items[i]]});
    //                         this.props.putEvent(data.items[i]);
    //                     }
    //                     // console.log("events in the end: " + JSON.stringify(this.state.events));
    //                     this.setState({nextToken: data.nextToken});
    //                 }
    //                 else {
    //                     // TODO Came up with no events
    //                 }
    //                 this.setState({isLoading: false});
    //             }, (error) => {
    //                 console.log("Querying events failed!");
    //                 console.log(error);
    //                 console.log(error);
    //                 this.setState({isLoading: false, error: error});
    //             }, this.props.cache.eventQueries, this.props.putEventQuery);
    //     }
    // }

    queryPosts() {
        this.setState({isLoading: true});
        if (!this.state.ifFinished) {
            // TODO We really want the "IN" operator so we can check to see if the owner is in our friends list...
            const filter = QL.generateFilter({
                or: [{
                    access: {
                        eq: "$access"
                    }
                }]
            },{
                access: "public"
            });
            // const oldFilter = QL.generateFilter("and", {"ifCompleted": "eq"}, {"ifCompleted": "false"});
            // QL.queryPostsOld(["id", "item_type", "by", "about", "time_created", "access", "description", "postType", "picturePaths", "videoPaths"], filter, this.state.eventFeedLength,
            //     this.state.nextToken, (data) => {
            this.props.fetchPostQuery(["id", "item_type", "by", "about", "time_created", "access", "description", "postType", "picturePaths", "videoPaths"],
                filter, this.state.eventFeedLength, this.state.nextToken, (data) => {
                    if (!data.nextToken) {
                        this.setState({ifFinished: true});
                    }
                    if (data.items) {
                        // console.log("got items");
                        const newlyQueriedPosts = [];
                        for (let i = 0; i < data.items.length; i++) {
                            const post = data.items[i];
                            // console.log(JSON.stringify(event));
                            if (post.access === 'public') {
                                newlyQueriedPosts.push(post);
                            }
                            else if (this.props.user.id && this.props.user.id === post.by) {
                                newlyQueriedPosts.push(post);
                            }
                            else if (this.props.user.friends && this.props.user.friends.includes(post.by)) {
                                newlyQueriedPosts.push(post);
                            }
                        }
                        console.error(JSON.stringify(this.state.posts) + "\n" + JSON.stringify(newlyQueriedPosts));
                        this.setState({posts: [...this.state.posts, ...newlyQueriedPosts]});
                        for (let i = 0; i < data.items.length; i++) {
                            //console.log(data.items[i].time_created);
                            // console.log("Putting in event: " + JSON.stringify(data.items[i]));
                            // this.setState({events: [...this.state.events, data.items[i]]});
                            //TODO: put this back later -> this.props.putPost(data.items[i]);
                        }
                        // console.log("events in the end: " + JSON.stringify(this.state.events));
                        this.setState({nextToken: data.nextToken});
                    }
                    else {
                        // TODO Came up with no events
                    }
                    this.setState({isLoading: false});
                    console.log("Finish successHandler");
                }, (error) => {
                    console.log("Querying events failed!");
                    console.log(error);
                    this.setState({isLoading: false, error: error});
                }, this.props.cache.postQueries, this.props.putPostQuery);
        }
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
            console.log("Next Token: " + this.state.nextToken);
            this.queryPosts();
        }
    };

    forceUpdate = () => {
        this.props.forceFetchUserAttributes(["posts"]);
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
                    <PostCard postID={posts[i].id}/>
                </Fragment>
            ));
        }

        //This displays the rows in a grid format, with visibility enabled so that we know when the bottom of the page
        //is hit by the user.
        return (
            <Visibility onUpdate={this.handleUpdate}>
                <CreatePostProp queryPosts={this.queryPosts} queryChallenges={this.queryChallenges}/>
                <Header sub>Recent Posts:</Header>
                {rows(this.state.posts)}
            </Visibility>
        );
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
        fetchPost: (id, variablesList) => {
            dispatch(fetchPost(id, variablesList));
        },
        putPost: (post) => {
            dispatch(putPost(post));
        },
        putPostQuery: (queryString, queryResult) => {
            dispatch(putPostQuery(queryString, queryResult));
        },
        fetchPostQuery: (variablesList, filter, limit, nextToken, dataHandler, failureHandler) => {
            dispatch(fetchPostQuery(variablesList, filter, limit, nextToken, dataHandler, failureHandler));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PostFeed);
