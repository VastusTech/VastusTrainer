import React, {Component, Fragment} from 'react'
import {Icon, Message, Label, Header} from 'semantic-ui-react';
import ChallengeCard from "./ChallengeCard";
// import QL from "../GraphQL";
import { connect } from "react-redux";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import { inspect } from 'util';
import {fetchChallenge} from "../redux_helpers/actions/cacheActions";

class NextEventProp extends Component {
    state = {
        isLoading: true,
        isFetching: false,
        sentRequest: false,
        challenges: [],
        error: null
    };

    constructor(props) {
        super(props);
        //console.log("Got into Scheduled Events constructor");
        this.update = this.update.bind(this);
    }

    resetState() {
        this.setState({isLoading: true, sentRequest: false, error: null});
    }

    update(props) {
        if (!props.user.id) {
            // console.log("No user ID...");
            return;
        }
        //console.log("Cur User for grabbing Attributes: " + this.props.user.id);
        if (props.user.hasOwnProperty("challenges") && this.state.isLoading) {
            this.setState({isLoading: false});
            if (props.user.challenges && props.user.challenges.length) {
                this.setState({isFetching: true});
                var n = 0;
                for (var i = 0; i < props.user.challenges.length; i++) {
                    // if (!(this.props.user.scheduledEvents[i] in this.state.events)) {
                    //     this.addEventFromGraphQL(this.props.user.scheduledEvents[i]);
                    // }
                    // TODO Make the function outside of the loop
                    props.fetchChallenge(props.user.challenges[i], ["id", "title", "goal", "endTime", "time_created", "owner", "ifCompleted", "members", "capacity", "difficulty", "access", "restriction"],
                        () => {
                            // console.log(JSON.stringify(data));
                            // Rerender when you get a new scheduled event
                            // this.state.events.push(data);
                            this.setState({});
                            n++;
                            if (n === props.user.challenges.length) {
                                this.setState({isFetching: false});
                            }
                        });
                }
            }
        }
        else if (!props.info.isLoading) {
            if (!this.state.sentRequest && !props.info.error && props.user.id != null) {
                props.fetchUserAttributes(["challenges"]);
                this.setState({sentRequest: true});
            }
        }
    }

    // addEventFromGraphQL(eventID) {
    //     QL.getEvent(eventID, ["id", "time", "time_created", "title", "goal", "owner", "members", "capacity"], (data) => {
    //         console.log("successfully got a event");
    //         this.setState({events: {...this.state.events, [data.id]: data}, isLoading: false});
    //     }, (error) => {
    //         console.log("Failed to get a vent");
    //         console.log(JSON.stringify(error));
    //         this.setState({error: error});
    //     });
    // }
    getChallengeTime(id) {
        // console.log("getting " + id);
        if (this.props.cache.challenges[id]) {
            // console.log("returning " + this.props.cache.events[id].time);
            return this.props.cache.challenges[id].endTime;
        }
        return null;
    }

    componentDidMount() {
        this.update(this.props);
    }

    componentWillReceiveProps(newProps, nextContext) {
        if (newProps.user && this.props.user && newProps.user.id !== this.props.user.id) {
            // console.log("resetting app for new user!");
            this.resetState();
        }
        this.update(newProps);
    }

    render() {
        // this.update();
        //console.log("Redering");
        function rows(challengeIDs, getChallengeTimeFunction) {
            const row = [];
            // console.log("eventIDs = " + JSON.stringify(eventIDs));
            for (const key in challengeIDs) {
                if (challengeIDs.hasOwnProperty(key) && challengeIDs[key]) {
                    const time = getChallengeTimeFunction(challengeIDs[key]);
                    if (time) {
                        row.push({
                            id: challengeIDs[key],
                            time
                        });
                    }
                }
            }
            // console.log("row = " + JSON.stringify(row));

            row.sort(function(a,b){return (b.time).localeCompare(a.time)});

            if (row.length > 0) {
                return (
                    <Fragment key={0}>
                        <Message>
                            <ChallengeCard challengeID={row[row.length - 1].id}/>
                        </Message>
                    </Fragment>
                );
            }
            else {
                return(null);
            }
        }
        if (this.state.isFetching) {
            //console.log("loading: " + JSON.stringify(this.state));
            return(
                <Message icon>
                    <Icon name='spinner' size="small" loading />
                    <Message.Content>
                        <Message.Header>
                            Loading...
                        </Message.Header>
                    </Message.Content>

                </Message>
            )
        }
        if (this.props.user.challenges && this.props.user.challenges.length && this.props.user.challenges.length > 0) {
            return(
                rows(this.props.user.challenges, this.getChallengeTime.bind(this))
            );
        }
        else {
            // Then it's empty, no next scheduled event
            return(
                <Message>No scheduled challenges!</Message>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache,
    info: state.info,
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

export default connect(mapStateToProps, mapDispatchToProps)(NextEventProp);
