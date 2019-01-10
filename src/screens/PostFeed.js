import React, {Component, Fragment} from 'react'
import _ from 'lodash'
import {Visibility, Header, Grid} from 'semantic-ui-react'
import PostCard from "../components/PostCard";
import QL from "../GraphQL";
import { connect } from 'react-redux';
import {fetchPost, putChallengeQuery, putPost, putPostQuery, fetchChallenge, putChallenge, fetchClient} from "../redux_helpers/actions/cacheActions";
import { fetchPostQuery } from "../redux_helpers/actions/cacheActions";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import NextChallengeProp from "../components/NextChallenge";
import { Tab } from "semantic-ui-react/dist/commonjs/modules/Tab/Tab";
import PostManager from './PostManager'

/**
 * Post Feed
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
        postFeedLength: 10,
        challengeFeedLength: 10,
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
        this.queryChallenges = this.queryChallenges.bind(this);
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
            this.props.fetchUserAttributes(["friends", "invitedChallenges", "name"],
                (data) => {
                    // console.log("finished");
                    this.queryPosts()
                });
        }
    }

    queryChallenges() {
        this.setState({isLoading: true});
        if (!this.state.ifFinished) {
            // console.log(JSON.stringify(this.props.cache.eventQueries));
            const filter = QL.generateFilter({
                and: [
                    {
                        ifCompleted: {
                            eq: "$ifCompleted"
                        }
                    }
                ]
            }, {
                ifCompleted: "false"
            });
            // QL.queryChallenges(["id", "title", "endTime", "time_created", "owner", "ifCompleted", "members", "capacity", "goal", "access", "restriction", "tags", "prize"], QL.generateFilter("and",
            //     {"ifCompleted": "eq"}, {"ifCompleted": "false"}), this.state.challengeFeedLength,
            //     this.state.nextToken, (data) => {
            QL.queryChallenges(["id", "title", "endTime", "time_created", "owner", "ifCompleted", "members", "capacity", "goal", "access", "restriction", "tags", "prize", "submissions"],
                filter, this.state.challengeFeedLength, this.state.nextToken, (data) => {
                    if (!data.nextToken) {
                        this.setState({ifFinished: true});
                    }
                    if (data.items) {
                        // TODO We can see private events
                        // console.log("got items");
                        const newlyQueriedChallenges = [];
                        for (let i = 0; i < data.items.length; i++) {
                            const challenge = data.items[i];
                            // console.log(JSON.stringify(challenge));
                            if (challenge.access === 'public') {
                                newlyQueriedChallenges.push(challenge);
                            }
                            else if (this.props.user.id && this.props.user.id === challenge.owner) {
                                newlyQueriedChallenges.push(challenge);
                            }
                            else if (this.props.user.friends && this.props.user.friends.includes(challenge.owner)) {
                                newlyQueriedChallenges.push(challenge);
                            }
                            else if (this.props.user.invitedChallenges && this.props.user.invitedChallenges.includes(challenge.id)) {
                                newlyQueriedChallenges.push(challenge);
                            }
                        }
                        this.setState({challenges: [...this.state.challenges, ...newlyQueriedChallenges]});
                        for (let i = 0; i < data.items.length; i++) {
                            //console.log(data.items[i].time_created);
                            // console.log("Putting in event: " + JSON.stringify(data.items[i]));
                            // this.setState({events: [...this.state.events, data.items[i]]});
                            this.props.putChallenge(data.items[i]);
                        }
                        // console.log("events in the end: " + JSON.stringify(this.state.events));
                        this.setState({nextToken: data.nextToken});
                    }
                    else {
                        // TODO Came up with no events
                    }
                    this.setState({isLoading: false});
                }, (error) => {
                    console.log("Querying challenges failed!");
                    console.log(error);
                    console.error(error);
                    this.setState({isLoading: false, error: error});
                }, this.props.cache.challengeQueries, this.props.putChallengeQuery);
        }
    }

    queryPosts() {
        this.setState({isLoading: true});
        if (!this.state.ifFinished) {
            // console.log(JSON.stringify(this.props.cache.eventQueries));

            // QL.queryPosts(["id", "title", "endTime", "time_created", "owner", "ifCompleted", "members", "capacity", "goal", "access", "restriction", "tags", "prize"], QL.generateFilter("and",
            //     {"ifCompleted": "eq"}, {"ifCompleted": "false"}), this.state.PostFeedLength,
            //     this.state.nextToken, (data) => {
            const filter = QL.generateFilter({
                    not: {
                        postType: {
                            eq: "$postType"
                        }
                    }}
                ,{postType: "submission"}
            );
            // QL.queryPosts(["id", "time_created", "by", "item_type", "postType", "about", "description", "videoPaths", "picturePaths"],
            //     filter, this.state.postFeedLength, this.state.nextToken, (data) => {
            this.props.fetchPostQuery(["id", "time_created", "by", "item_type", "postType", "about", "description", "videoPaths", "picturePaths"],
                filter, this.state.eventFeedLength, this.state.nextToken, (data) => {
                    if (!data.nextToken) {
                        this.setState({ifFinished: true});
                    }
                    if (data.items) {
                        // TODO We can see private events
                        // console.log("got items");
                        const newlyQueriedPosts = [];
                        for (let i = 0; i < data.items.length; i++) {
                            const post = data.items[i];
                            //alert(JSON.stringify("")
                            this.props.fetchChallenge(data.items[i].about, ["title", "endTime", "tags", "time_created", "capacity", "members"]);
                            this.props.fetchClient(data.items[i].about, ["id", "profileImagePath", "name"]);
                            this.props.fetchPost(data.items[i].about, ["time_created", "about", "by", "description", "picturePaths", "videoPaths"]);
                            newlyQueriedPosts.push(post);
                        }
                        // console.error(JSON.stringify(this.state.posts) + "\n" + JSON.stringify(newlyQueriedPosts));
                        this.setState({posts: [...this.state.posts, ...newlyQueriedPosts]});
                        // for (let i = 0; i < data.items.length; i++) {
                            //console.log(data.items[i].time_created);
                            // console.log("Putting in event: " + JSON.stringify(data.items[i]));
                            // this.setState({events: [...this.state.events, data.items[i]]});
                            // this.props.putPost(data.items[i]);
                        // }
                        // console.log("events in the end: " + JSON.stringify(this.state.events));
                        this.setState({nextToken: data.nextToken});
                    }
                    else {
                        // TODO Came up with no events
                    }
                    this.setState({isLoading: false});
                }, (error) => {
                    console.log("Querying Posts failed!");
                    console.log(error);
                    console.error(error);
                    this.setState({isLoading: false, error: error});
                });
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
        this.props.forceFetchUserAttributes(["Posts"]);
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
                <Grid className='ui center aligned'>
                    <Grid.Column floated='center' width={15}>
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
        fetchPost: (id, variablesList) => {
            dispatch(fetchPost(id, variablesList));
        },
        putPost: (post) => {
            dispatch(putPost(post));
        },
        putPostQuery: (queryString, queryResult) => {
            dispatch(putPostQuery(queryString, queryResult));
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
        fetchPostQuery: (variablesList, filter, limit, nextToken, dataHandler, failureHandler) => {
            dispatch(fetchPostQuery(variablesList, filter, limit, nextToken, dataHandler, failureHandler));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PostFeedProp);