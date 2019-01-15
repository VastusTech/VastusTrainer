import React, {Component, Fragment} from 'react'
import {Icon, Message, Label, Header} from 'semantic-ui-react';
import ChallengeCard from "./ChallengeCard";
import { connect } from "react-redux";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import { inspect } from 'util';
import {fetchChallenge} from "../redux_helpers/actions/cacheActions";
import {daysLeft, parseISOString} from "../logic/TimeHelper";

class NextChallengeProp extends Component {
    state = {
        isLoading: true,
        isFetching: false,
        sentRequest: false,
        nearestChallenge: null,
        nearestDaysLeft: null,
        error: null
    };

    constructor(props) {
        super(props);
        //console.log("Got into Scheduled Events constructor");
        this.update = this.update.bind(this);
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

    resetState() {
        this.setState({isLoading: true, sentRequest: false, error: null});
    }

    update(props) {
        if (!props.user.id) {
            console.error("No user ID...");
            return;
        }
        //console.log("Cur User for grabbing Attributes: " + this.props.user.id);
        if (!this.state.sentRequest) {
            this.setState({isLoading: true});
            this.state.sentRequest = true;
            this.props.fetchUserAttributes(["challenges"], (user) => {
                if (user.challenges) {
                    for (let i = 0; i < user.challenges.length; i++) {
                        this.props.fetchChallenge(user.challenges[i], ["id", "tags", "title", "goal", "endTime", "time_created", "owner", "ifCompleted", "members", "capacity", "difficulty", "access", "restriction"], (challenge) => {
                            if (challenge && challenge.endTime) {
                                const challengeDaysLeft = daysLeft(parseISOString(challenge.endTime));
                                if (challengeDaysLeft >= 0) {
                                    if ((!this.state.nearestChallenge) || (challenge.endTime && challengeDaysLeft < this.state.nearestDaysLeft)) {
                                        this.state.nearestDaysLeft = challengeDaysLeft;
                                        this.state.nearestChallenge = challenge;
                                    }
                                }
                            }
                        });
                    }
                }
                this.setState({isLoading: false});
            });
        }
    }

    render() {
        if (this.state.isLoading) {
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
        if (this.state.nearestChallenge) {
            return (
                <Fragment key={0}>
                    <Message>
                        <ChallengeCard challengeID={this.state.nearestChallenge.id}/>
                    </Message>
                </Fragment>
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
        fetchUserAttributes: (attributeList, dataHandler) => {
            dispatch(fetchUserAttributes(attributeList, dataHandler));
        },
        fetchChallenge: (id, variablesList, dataHandler) => {
            dispatch(fetchChallenge(id, variablesList, dataHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NextChallengeProp);
