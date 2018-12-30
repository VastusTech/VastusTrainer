import React, { Component } from 'react'
import {List, Message} from 'semantic-ui-react';
import ChallengeCard from "../components/ChallengeCard";
import { connect } from "react-redux";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import {fetchChallenge} from "../redux_helpers/actions/cacheActions";
import ChallengeFeed from "../screens/ChallengeFeed";

type Props = {
    challengeIDs: [string]
}

class ChallengeList extends Component<Props> {
    state = {
        isLoading: true,
        challengeIDs: null,
        loadedChallengeIDs: [],
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

        if (!this.state.challengeIDs && props.challengeIDs && props.challengeIDs.length) {
            this.state.challengeIDs = props.challengeIDs;
            // this.state.loadedEventIDs = [];
            // this.setState({eventIDs: props.eventIDs});
            for (let i = 0; i < props.challengeIDs.length; i++) {
                this.props.fetchChallenge(props.challengeIDs[i], ["id", "title", "goal", "endTime", "time_created", "owner", "members", "capacity", "difficulty", "restriction"], (event) => {
                    // Handle received data
                    if (event) {
                        this.state.loadedChallengeIDs.push(event.id);
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
        function rows(challenges) {
            const row = [];
            const rowProps = [];
            for (const key in challenges) {
                if (challenges.hasOwnProperty(key)) {
                    //console.log(JSON.stringify(events[key]));
                    row.push(
                        challenges[key]
                    );
                }
            }
            // row.sort(function(a,b){return b.time_created.localeCompare(a.time_created)});

            for (const key in row) {
                if (row.hasOwnProperty(key) === true) {
                    rowProps.push(
                        <List.Item key={key}>
                            <ChallengeCard challengeID={row[key]}/>
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
        if (this.state.loadedChallengeIDs.length > 0) {
            return(
                <List>{rows(this.state.loadedChallengeIDs)}</List>
            );
        }
        else {
            return(
                <Message>No challenges yet!</Message>
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
        fetchChallenge: (id, variablesList, dataHandler) => {
            dispatch(fetchChallenge(id, variablesList, dataHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeList);
