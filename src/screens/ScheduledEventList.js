import React, { Component } from 'react'
import {List, Message} from 'semantic-ui-react';
import EventCard from "../components/EventCard";
import QL from "../GraphQL";
import { connect } from "react-redux";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import { inspect } from 'util';
import {fetchEvent} from "../redux_helpers/actions/cacheActions";

class ScheduledEventsList extends Component {
    state = {
        isLoading: true,
        events: {},
        sentRequest: false,
        error: null
    };

    constructor(props) {
        super(props);
        this.forceUpdate = this.forceUpdate.bind(this);
        //alert("Got into Scheduled Events constructor");
        // this.state.username = this.props.username;
    }

    update() {
        // TODO Change this if we want to actually be able to do something while it's loading
        const user = this.props.user;
        //alert("Updating Scheduled Events");
        if (!user.id) {
            // alert("Pretty bad error");
            this.setState({isLoading: true});
        }

        if (this.state.isLoading && user.hasOwnProperty("scheduledEvents") && user.scheduledEvents && user.scheduledEvents.length) {
            this.setState({isLoading: false});
            for (let i = 0; i < user.scheduledEvents.length; i++) {
                this.props.fetchEvent(user.scheduledEvents[i], ["id", "title", "goal", "time", "time_created", "owner", "ifChallenge", "members", "capacity", "difficulty"]);
                //this.props.fetchEvent(user.scheduledEvent//s[i], ["time", "time_created", "title", "goal", "members"]);
                // if (!(user.scheduledEvents[i] in this.state.events)) {
                //     this.addEventFromGraphQL(user.scheduledEvents[i]);
                // }
            }
        }
        else if (!this.props.info.isLoading) {
            if (!this.state.sentRequest && !this.props.info.error) {
                this.props.fetchUserAttributes(["scheduledEvents"]);
                this.setState({sentRequest: true});
            }
        }
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

    // getEventAttribute(id, attribute) {
    //     if (id && attribute) {
    //         if (this.props.cache.events[id]) {
    //             return this.props.cache.events[id][attribute];
    //         }
    //     }
    // }

    componentDidMount() {
        this.update();
    }

    componentWillReceiveProps(newProps) {
        //alert("Receevin props");
        // this.props = newProps;
        // if (newProps.user && this.props.user && newProps.user.id !== this.props.user.id) {
        //     this.setState(this.state);
        // }
        this.update();
    }

    render() {
        //alert("Redering");
        function rows(events) {
            const row = [];
            const rowProps = [];
            for (const key in events) {
                if (events.hasOwnProperty(key)) {
                    //alert(JSON.stringify(events[key]));
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
        if (this.props.info.isLoading) {
            //alert("loading: " + JSON.stringify(this.state));
            return(
                <Message>Loading...</Message>
            )
        }
        if (this.props.user.scheduledEvents && this.props.user.scheduledEvents.length && this.props.user.scheduledEvents.length > 0) {
            return(
                <List>{rows(this.props.user.scheduledEvents)}</List>
            );
        }
        else {
            return(
                <Message>No scheduled events yet!</Message>
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
        fetchEvent: (id, variablesList) => {
            dispatch(fetchEvent(id, variablesList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledEventsList);