import React, {Component, Fragment} from 'react'
import _ from 'lodash'
import {Visibility, Header} from 'semantic-ui-react'
import EventCard from "../components/EventCard";
import QL from "../GraphQL";
import { connect } from 'react-redux';
// import ScheduledEventsList from "./ScheduledEventList";
import {fetchEvent, putClientQuery, putEvent, putEventQuery} from "../redux_helpers/actions/cacheActions";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
// import CreateEventProp from "./CreateEvent";
// import WorkoutSelectionList from "./WorkoutSelectionList";
import CreateChallengeProp from "./CreateChallenge"
import NextEventProp from "../components/NextEvent";
import {Tab} from "semantic-ui-react/dist/commonjs/modules/Tab/Tab";
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
class EventFeed extends Component {
    state = {
        isLoading: true,
        userID: null,
        events: [],
        challenges: [],
        clientNames: {}, // id to name
        eventFeedLength: 10,
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
        this.queryEvents = this.queryEvents.bind(this);
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
            this.props.fetchUserAttributes(["friends", "invitedEvents"],
                (data) => {
                    // console.log("finished");
                    this.queryEvents()
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

    queryEvents() {
        this.setState({isLoading: true});
        if (!this.state.ifFinished) {
            // TODO This needs to be rewritten if we want to have any kind of event feed!!!!!
            const filter = QL.generateFilter({

            },{

            });
            // const oldFilter = QL.generateFilter("and", {"ifCompleted": "eq"}, {"ifCompleted": "false"});
            QL.queryEvents(["id", "title", "time", "time_created", "address", "owner", "ifCompleted", "members", "capacity", "access"], filter, this.state.eventFeedLength,
                this.state.nextToken, (data) => {
                    if (!data.nextToken) {
                        this.setState({ifFinished: true});
                    }
                    if (data.items) {
                        // TODO We can see private events
                        // console.log("got items");
                        const newlyQueriedChallenges = [];
                        for (let i = 0; i < data.items.length; i++) {
                            const challenge = data.items[i];
                            // console.log(JSON.stringify(event));
                            if (challenge.access === 'public') {
                                newlyQueriedChallenges.push(challenge);
                            }
                            else if (this.props.user.id && this.props.user.id === challenge.owner) {
                                newlyQueriedChallenges.push(challenge);
                            }
                            else if (this.props.user.friends && this.props.user.friends.includes(challenge.owner)) {
                                newlyQueriedChallenges.push(challenge);
                            }
                            else if (this.props.user.invitedEvents && this.props.user.invitedEvents.includes(challenge.id)) {
                                newlyQueriedChallenges.push(challenge);
                            }
                        }
                        this.setState({challenges: [...this.state.events, ...newlyQueriedChallenges]});
                        for (let i = 0; i < data.items.length; i++) {
                            //console.log(data.items[i].time_created);
                            // console.log("Putting in event: " + JSON.stringify(data.items[i]));
                            // this.setState({events: [...this.state.events, data.items[i]]});
                            this.props.putEvent(data.items[i]);
                        }
                        // console.log("events in the end: " + JSON.stringify(this.state.events));
                        this.setState({nextToken: data.nextToken});
                    }
                    else {
                        // TODO Came up with no events
                    }
                    this.setState({isLoading: false});
                }, (error) => {
                    console.log("Querying events failed!");
                    console.log(error);
                    console.log(error);
                    this.setState({isLoading: false, error: error});
                }, this.props.cache.eventQueries, this.props.putEventQuery);
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
            this.queryEvents();
        }
    };

    forceUpdate = () => {
        this.props.forceFetchUserAttributes(["ownedEvents", "scheduledEvents"]);
    };

    render() {
        /**
         * This function takes in a list of events and displays them in a list of Event Card views.
         * @param events
         * @returns {*}
         */
        function rows(events) {
            // if(events != null && events.length > 0)
            //     console.log(JSON.stringify(events[0].id));
            // console.log("EVENTS TO PRINT: ");
            // console.log(JSON.stringify(events));
            return _.times(events.length, i => (
                <Fragment key={i + 1}>
                    <EventCard eventID={events[i].id}/>
                </Fragment>
            ));
        }

        //This displays the rows in a grid format, with visibility enabled so that we know when the bottom of the page
        //is hit by the user.
        return (
            <Visibility onUpdate={this.handleUpdate}>
                <CreateChallengeProp queryEvents={this.queryEvents}/>
                <Header sub>Your Next Challenge:</Header>
                <NextEventProp/>
                <Header sub>Upcoming Challenges:</Header>
                {rows(this.state.events)}
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
        fetchEvent: (id, variablesList) => {
            dispatch(fetchEvent(id, variablesList));
        },
        putEvent: (event) => {
            dispatch(putEvent(event));
        },
        putEventQuery: (queryString, queryResult) => {
            dispatch(putEventQuery(queryString, queryResult));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EventFeed);
