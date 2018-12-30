import React, {Component, Fragment} from 'react'
import _ from 'lodash'
import {Visibility, Header} from 'semantic-ui-react'
import ChallengeCard from "../components/ChallengeCard";
import QL from "../GraphQL";
import { connect } from 'react-redux';
// import ScheduledEventsList from "./ScheduledEventList";
import {fetchChallenge, putClientQuery, putChallenge, putChallengeQuery} from "../redux_helpers/actions/cacheActions";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
// import CreateEventProp from "./CreateEvent";
import CreateChallengeProp from "./CreateChallenge"
// import NextEventProp from "../components/NextEvent";
import NextChallengeProp from "../components/NextChallenge";
import { Tab } from "semantic-ui-react/dist/commonjs/modules/Tab/Tab";
// import * as AWS from "aws-sdk";

// AWS.config.update({region: 'REGION'});
// AWS.config.credentials = new AWS.CognitoIdentityCredentials(
//     {IdentityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222'});

/**
 * Event Feed
 *
 * This is the main feed in the home page, it currently displays all public events inside of the database for
 * the user to see.
 */
class ChallengeFeed extends Component {
    state = {
        isLoading: true,
        userID: null,
        challenges: [],
        clientNames: {}, // id to name
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
            this.props.fetchUserAttributes(["friends", "invitedChallenges"],
                (data) => {
                    // console.log("finished");
                    this.queryChallenges()
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
            this.queryChallenges();
        }
    };

    forceUpdate = () => {
        this.props.forceFetchUserAttributes(["ownedChallenges", "challenges"]);
    };

    render() {
        /**
         * This function takes in a list of challenges and displays them in a list of Event Card views.
         * @param challenges
         * @returns {*}
         */
        function rows(challenges) {
            // if(challenges != null && challenges.length > 0)
            //     console.log(JSON.stringify(challenges[0].id));
            // console.log("EVENTS TO PRINT: ");
            // console.log(JSON.stringify(challenges));
            return _.times(challenges.length, i => (
                <Fragment key={i + 1}>
                    <ChallengeCard challengeID={challenges[i].id}/>
                </Fragment>
            ));
        }

        //This displays the rows in a grid format, with visibility enabled so that we know when the bottom of the page
        //is hit by the user.
        return (
            <Visibility onUpdate={this.handleUpdate}>
                <CreateChallengeProp queryChallenges={this.queryChallenges}/>
                <Header sub>Your Next Challenge:</Header>
                <NextChallengeProp/>
                <Header sub>Upcoming Challenges:</Header>
                {rows(this.state.challenges)}
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

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeFeed);
