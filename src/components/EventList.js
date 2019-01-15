import React, { Component } from 'react'
import {List, Message} from 'semantic-ui-react';
import EventCard from "../components/EventCard";
import { connect } from "react-redux";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import {fetchEvent} from "../redux_helpers/actions/cacheActions";

type Props = {
    eventIDs: [string]
}

class EventList extends Component<Props> {
    state = {
        isLoading: true,
        eventIDs: null,
        loadedEventIDs: [],
        // events: {},
        // sentRequest: false,
        error: null
    };

    constructor(props) {
        super(props);
        //console.log("Got into Scheduled Events constructor");
        // this.state.username = this.props.username;
    }

    update(props) {
        // TODO Change this if we want to actually be able to do something while it's loading
        const user = props.user;
        //console.log("Updating Scheduled Events");
        if (!user.id) {
            console.error("Pretty bad error");
            this.setState({isLoading: true});
        }

        if (!this.state.eventIDs && props.eventIDs && props.eventIDs.length) {
            this.state.eventIDs = props.eventIDs;
            // this.state.loadedEventIDs = [];
            // this.setState({eventIDs: props.eventIDs});
            for (let i = 0; i < props.eventIDs.length; i++) {
                this.props.fetchEvent(props.eventIDs[i], ["id", "title", "time", "time_created", "owner", "members", "capacity", "difficulty", "restriction"], (event) => {
                    // Handle received data
                    if (event) {
                        this.state.loadedEventIDs.push(event.id);
                    }
                });
            }
        }

        // if (this.state.isLoading && user.hasOwnProperty("completedEvents") && user.completedEvents && user.completedEvents.length) {
        //     this.setState({isLoading: false});
        //     for (let i = 0; i < user.completedEvents.length; i++) {
        //         //QL.queryEvents(["id", "title", "goal", "time", "time_created", "owner", "ifChallenge", "members", "capacity", "difficulty"], QL.generateFilter("and",
        //         this.props.fetchEvent(user.completedEvents[i], ["id", "title", "goal", "time", "time_created", "owner", "ifChallenge", "members", "capacity", "difficulty"]);
        //         // if (!(user.scheduledEvents[i] in this.state.events)) {
        //         //     this.addEventFromGraphQL(user.scheduledEvents[i]);
        //         // }
        //     }
        // }
        // else if (!this.props.info.isLoading) {
        //     if (!this.state.sentRequest && !this.props.info.error) {
        //         this.props.fetchUserAttributes(["completedEvents"]);
        //         this.setState({sentRequest: true});
        //     }
        // }
    }

    // addEventFromGraphQL(eventID) {
    //     QL.getEvent(eventID, ["id", "time", "time_created", "title", "goal", "owner", "members"], (data) => {
    //         console.log("successfully got a event");
    //         this.setState({events: {...this.state.events, [data.id]: data}, isLoading: false});
    //     }, (error) => {
    //         console.log("Failed to get a vent");
    //         console.log(JSON.stringify(error));
    //         this.setState({error: error});
    //     });
    // }

    // getChallengeAttribute(id, attribute) {
    //     if (id && attribute) {
    //         if (this.props.cache.events[id]) {
    //             return this.props.cache.events[id][attribute];
    //         }
    //     }
    // }

    componentDidMount() {
        this.update(this.props);
    }

    componentWillReceiveProps(newProps) {
        //console.log("Receevin props");
        // this.props = newProps;
        // if (newProps.user && this.props.user && newProps.user.id !== this.props.user.id) {
        //     this.setState(this.state);
        // }
        this.update(newProps);
    }

    render() {
        //console.log("Redering");
        function rows(events) {
            const row = [];
            const rowProps = [];
            for (const key in events) {
                if (events.hasOwnProperty(key)) {
                    //console.log(JSON.stringify(events[key]));
                    row.push(
                        events[key]
                    );
                }
            }
            // row.sort(function(a,b){return b.time_created.localeCompare(a.time_created)});

            for (const key in row) {
                if (row.hasOwnProperty(key) === true) {
                    rowProps.push(
                        <List.Item>
                            <EventCard eventID={row[key]}/>
                        </List.Item>
                    );
                }
            }

            return rowProps;
        }
        if (this.props.isLoading) {
            //console.log("loading: " + JSON.stringify(this.state));
            return(
                <Message>Loading...</Message>
            )
        }
        if (this.state.loadedEventIDs.length > 0) {
            return(
                <List>{rows(this.state.loadedEventIDs)}</List>
            );
        }
        else {
            return(
                <Message>No completed events yet!</Message>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (attributeList) => {
            dispatch(fetchUserAttributes(attributeList));
        },
        fetchEvent: (id, variablesList, dataHandler) => {
            dispatch(fetchEvent(id, variablesList, dataHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
