import React, {Component, Fragment} from 'react'
import _ from 'lodash'
import {Visibility, Header, Grid} from 'semantic-ui-react'
import PostCard from "../components/PostCard";
import QL from "../GraphQL";
import { connect } from 'react-redux';
import {
    fetchPost,
    putChallengeQuery,
    putPost,
    putPostQuery,
    fetchChallenge,
    putChallenge,
    fetchClient,
    fetchTrainer,
    fetchPostQuery
} from "../redux_helpers/actions/cacheActions";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import PostManager from "./PostManager";
import NextChallengeProp from "../components/NextChallenge";
import {getItemTypeFromID} from "../logic/ItemType";
import {consoleLog, consoleError} from "../logic/DebuggingHelper";

/**
 * Event Feed
 *
 * This is the main feed in the home page, it currently displays all public events inside of the database for
 * the user to see.
 */
class PostFeedProp extends Component {
    state = {
        isLoading: true,
        userID: null,
        posts: [],
        challenges: [],
        loadedPostIDs: [],
        clientNames: {}, // id to name
        postFeedLength: 25,
        challengeFeedLength: 10,
        sentRequest: false,
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
        //this.queryChallenges = this.queryChallenges.bind(this);
    }

    componentDidMount() {
        // this.componentWillReceiveProps(this.props);
        // if (this.props.userID) {
        //     this.setState({userID: this.props.userID});
        //     this.props.fetchUserAttributes(["friends", "invitedEvents"],
        //         (data) => {
        //             // When it has finished
        //             consoleLog("Finished");
        //             this.queryEvents();
        //         });
        // }
    }

    componentWillReceiveProps(newProps) {
        // consoleLog("Set state to userID = " + newProps.userID);
        if (this.state.userID !== newProps.userID) {
            this.state.userID = newProps.userID;
            this.queryPosts();
        }
    }

    /*
    Here we have a feed of posts that we are querying.

    For one query, we only change the nextToken to get the next stuff

    PostQuery nextToken = null (1)

    PostQuery nextToken = 1 (2)

    PostQuery nextToken = 2 (null)

    Done...


     */
    queryPosts() {
        // alert("BEFORE: " + this.state.sentRequest);
        if (!this.state.sentRequest) {
            this.state.sentRequest = true;
            // alert("AFTER: " + this.state.sentRequest);
            if (!this.state.ifFinished) {
                this.setState({isLoading: true});
                const filter = QL.generateFilter({
                        or: [{
                            postType: {
                                eq: "$postType1"
                            }
                        }, {
                            postType: {
                                eq: "$postType2"
                            }
                        }]
                    }
                    , {
                        postType1: "Challenge",
                        postType2: "newChallenge"
                    }
                );
                // QL.queryPosts(["id", "time_created", "by", "item_type", "postType", "about", "description", "videoPaths", "picturePaths"],
                // alert("QUerying posts!");
                this.props.fetchPostQuery(["id", "time_created", "by", "item_type", "postType", "about", "description", "videoPaths", "picturePaths"],
                    filter, this.state.postFeedLength, this.state.nextToken, (data) => {
                        if (!data.nextToken) {
                            this.setState({ifFinished: true});
                        }
                        if (data.items) {
                            // TODO We can see private events
                            // consoleLog("got items");
                            // alert("Received " + data.items.length + " posts!");
                            const newlyQueriedPosts = [];
                            for (let i = 0; i < data.items.length; i++) {
                                const post = data.items[i];
                                //alert(JSON.stringify("")
                                const aboutItemType = getItemTypeFromID(post.about);
                                if (aboutItemType === "Client") {
                                    this.props.fetchClient(data.items[i].about, ["id", "profileImagePath", "name"]);
                                } else if (aboutItemType === "Trainer") {
                                    this.props.fetchTrainer(data.items[i].about, ["id", "profileImagePath", "name"]);
                                } else if (aboutItemType === "Event") {

                                } else if (aboutItemType === "Challenge") {
                                    // alert("Fetching challenge for post in post feed");
                                    this.props.fetchChallenge(data.items[i].about, ["title", "endTime", "tags", "time_created", "capacity", "members", "prize", "goal", "owner", "restriction", "submissions"]);
                                } else if (aboutItemType === "Post") {
                                    this.props.fetchPost(data.items[i].about, ["about", "by", "description", "picturePaths", "videoPaths"]);
                                }
                                newlyQueriedPosts.push(post);
                            }
                            this.setState({posts: [...this.state.posts, ...newlyQueriedPosts]});
                            for (let i = 0; i < data.items.length; i++) {
                                //consoleLog(data.items[i].time_created);
                                // consoleLog("Putting in event: " + JSON.stringify(data.items[i]));
                                // this.setState({events: [...this.state.events, data.items[i]]});
                                this.props.putPost(data.items[i]);
                            }
                            // consoleLog("events in the end: " + JSON.stringify(this.state.events));
                            this.setState({nextToken: data.nextToken});
                        }
                        else {
                            // TODO Came up with no events
                        }
                        this.setState({isLoading: false});
                    }, (error) => {
                        consoleError("Querying Posts failed!");
                        consoleError(error);
                        this.setState({isLoading: false, error: error});
                    }, this.props.cache.postQueries, this.props.putPostQuery);
            }
        }
    }

    /**
     *
     * @param e
     * @param calculations
     */
    handleUpdate = (e, { calculations }) => {
        this.setState({ calculations });
        // consoleLog(calculations.bottomVisible);
        if (calculations.bottomVisible) {
            consoleLog("Next Token: " + this.state.nextToken);
            this.state.sentRequest = false;
            this.queryPosts();
        }
    };

    forceUpdate = () => {
        // What is this even doing?
        // this.props.forceFetchUserAttributes(["Posts"]);
    };

    render() {
        /**
         * This function takes in a list of Posts and displays them in a list of Event Card views.
         * @param Posts
         * @returns {*}
         */
        function rows(Posts) {
            // if(Posts != null && Posts.length > 0)
            //     consoleLog(JSON.stringify(Posts[0].id));
            // consoleLog("EVENTS TO PRINT: ");
            // consoleLog(JSON.stringify(Posts));
            return _.times(Posts.length, i => (
                <Fragment key={i + 1}>
                    {/*alert(JSON.stringify(Posts[i].id))*/}
                    <PostCard postID={Posts[i].id}/>
                </Fragment>
            ));
        }

        //This displays the rows in a grid format, with visibility enabled so that we know when the bottom of the page
        //is hit by the user.
        return (
            <Visibility onUpdate={_.debounce(this.handleUpdate, 500)}>
                {/*<Grid className='ui center aligned'>
                    <Grid.Column floated='center' width={15}>
                        <CreateChallengeProp queryChallenges={this.queryChallenges} queryPosts={this.queryPosts}/>
                    </Grid.Column>
                    <Grid.Column floated='center' width={15}>
                        <CreatePostProp queryPosts={this.queryPosts}/>
                    </Grid.Column>
                </Grid>*/}
                <Grid className='ui center aligned'>
                    <Grid.Column /*floated*/ width={15}>
                        <PostManager queryChallenges={this.queryChallenges} queryPosts={this.queryPosts}/>
                    </Grid.Column>
                </Grid>
                <Header sub>Your Next Challenge:</Header>
                <NextChallengeProp/>
                <Header sub>Upcoming Posts:</Header>
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
        fetchClient: (variablesList, dataHandler) => {
            dispatch(fetchClient(variablesList, dataHandler));
        },
        fetchTrainer: (variablesList, dataHandler) => {
            dispatch(fetchTrainer(variablesList, dataHandler));
        },
        fetchPost: (id, variablesList) => {
            dispatch(fetchPost(id, variablesList));
        },
        putPost: (event) => {
            dispatch(putPost(event));
        },
        putPostQuery: (queryString, queryResult) => {
            dispatch(putPostQuery(queryString, queryResult));
        },
        fetchPostQuery: (variablesList, filter, limit, nextToken, dataHandler, failureHandler) => {
            dispatch(fetchPostQuery(variablesList, filter, limit, nextToken, dataHandler, failureHandler));
        },
        fetchChallenge: (id, variablesList) => {
            dispatch(fetchChallenge(id, variablesList));
        },
        putChallenge: (event) => {
            dispatch(putChallenge(event));
        },
        putChallengeQuery: (queryString, queryResult) => {
            dispatch(putChallengeQuery(queryString, queryResult));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PostFeedProp);