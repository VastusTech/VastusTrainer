import React, {Component, Fragment} from 'react'
import _ from 'lodash'
import {Grid, Visibility } from 'semantic-ui-react'
import EventCard from "../components/EventCard";
import QL from "../GraphQL";
import { connect } from 'react-redux';
import ScheduledEventsList from "./ScheduledEventList";
import {fetchEvent, putClientQuery, putEvent, putEventQuery} from "../redux_helpers/actions/cacheActions";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
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
    }

    componentDidMount() {
        // this.componentWillReceiveProps(this.props);
        // if (this.props.userID) {
        //     this.setState({userID: this.props.userID});
        //     this.props.fetchUserAttributes(["friends", "invitedEvents"],
        //         (data) => {
        //             // When it has finished
        //             alert("Finished");
        //             this.queryEvents();
        //         });
        // }
    }

    componentWillReceiveProps(newProps) {
        // alert("Set state to userID = " + newProps.userID);
        if (this.state.userID !== newProps.userID) {
            this.setState({userID: newProps.userID});
            // alert("fetchin user attributes");
            this.props.fetchUserAttributes(["friends", "invitedEvents"],
                (data) => {
                    // alert("finished");
                    this.queryEvents()
                });
        }
    }

    queryEvents() {
        this.setState({isLoading: true});
        if (!this.state.ifFinished) {
            // alert(JSON.stringify(this.props.cache.eventQueries));
            QL.queryEvents(["id", "title", "goal", "time", "time_created", "address", "owner", "ifChallenge", "ifCompleted", "members", "capacity", "difficulty", "access"], QL.generateFilter("and",
                {"ifCompleted": "eq"}, {"ifCompleted": "false"}), this.state.eventFeedLength,
                this.state.nextToken, (data) => {
                    if (!data.nextToken) {
                        this.setState({ifFinished: true});
                    }
                    if (data.items) {
                        // TODO We can see private events
                        // alert("got items");
                        const newlyQueriedEvents = [];
                        for (let i = 0; i < data.items.length; i++) {
                            const event = data.items[i];
                            // alert(JSON.stringify(event));
                            if (event.access === 'public') {
                                newlyQueriedEvents.push(event);
                            }
                            else if (this.props.user.id && this.props.user.id === event.owner) {
                                newlyQueriedEvents.push(event);
                            }
                            else if (this.props.user.friends && this.props.user.friends.includes(event.owner)) {
                                newlyQueriedEvents.push(event);
                            }
                            else if (this.props.user.invitedEvents && this.props.user.invitedEvents.includes(event.id)) {
                                newlyQueriedEvents.push(event);
                            }
                        }
                        this.setState({events: [...this.state.events, ...newlyQueriedEvents]});
                        for (let i = 0; i < data.items.length; i++) {
                            //alert(data.items[i].time_created);
                            // alert("Putting in event: " + JSON.stringify(data.items[i]));
                            // this.setState({events: [...this.state.events, data.items[i]]});
                            this.props.putEvent(data.items[i]);
                        }
                        // alert("events in the end: " + JSON.stringify(this.state.events));
                        this.setState({nextToken: data.nextToken});
                    }
                    else {
                        // TODO Came up with no events
                    }
                    this.setState({isLoading: false});
                }, (error) => {
                    console.log("Querying events failed!");
                    console.log(error);
                    alert(error);
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
            //     alert(JSON.stringify(events[0].id));
            // alert("EVENTS TO PRINT: ");
            // alert(JSON.stringify(events));
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
