import React, { Component } from 'react'
import { Message, List } from 'semantic-ui-react';
import EventCard from "../components/EventCard";
import QL from '../GraphQL';
import { connect } from 'react-redux';
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import {fetchEvent} from "../redux_helpers/actions/cacheActions";

class OwnedEventsList extends Component {
    state = {
        isLoading: true,
        events: {},
        sentRequest: false,
        error: null
    };

    constructor(props) {
        super(props);
        this.forceUpdate = this.forceUpdate.bind(this);
        //console.log("Got into Scheduled Events constructor");
        // this.state.username = this.props.username;
    }

    update() {
        // TODO Change this if we want to actually be able to do something while it's loading
        const user = this.props.user;
        //console.log("Updating Scheduled Events");
        if (!user.id) {
            // console.error("Pretty bad error");
            this.setState({isLoading: true});
        }

        if (this.state.isLoading && user.hasOwnProperty("ownedEvents") && user.ownedEvents && user.ownedEvents.length) {
            this.setState({isLoading: false});
            for (let i = 0; i < user.ownedEvents.length; i++) {
                // this.props.fetchEvent(user.ownedEvents[i], ["time", "time_created", "title", "goal", "members"]);
                this.props.fetchEvent(user.ownedEvents[i], ["id", "title", "goal", "time", "time_created", "owner", "ifChallenge", "members", "capacity", "difficulty"]);
                // if (!(user.scheduledEvents[i] in this.state.events)) {
                //     this.addEventFromGraphQL(user.scheduledEvents[i]);
                // }
            }
        }
        else if (!this.props.info.isLoading) {
            if (!this.state.sentRequest && !this.props.info.error) {
                this.props.fetchUserAttributes(["ownedEvents"]);
                this.setState({sentRequest: true});
            }
        }
    }

    forceUpdate = () => {
        this.props.forceFetchUserAttributes(["ownedEvents"]);
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
        this.update();
    }

    componentWillReceiveProps(newProps) {
        //console.log("Receevin props");
        //this.props = newProps;
        this.update();
    }

    render() {
        //console.log("Redering");
        function rows(events) {
            const row = [];
            const rowProps = [];
            // this.forceUpdate();
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
        if (this.props.info.isLoading) {
            //console.log("loading: " + JSON.stringify(this.state));
            return(
                <Message>Loading...</Message>
            )
        }
        if (this.props.user.ownedEvents && this.props.user.ownedEvents.length && this.props.user.ownedEvents.length > 0) {
            return(
                <List>{rows(this.props.user.ownedEvents)}</List>
            );
        }
        return(
            <Message>No owned events yet!</Message>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(OwnedEventsList);

