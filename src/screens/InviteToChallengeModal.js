import React, { Component, Fragment } from 'react'
import {Message, Button, Modal, Card} from 'semantic-ui-react';
import EventCard from "../components/EventCard";
// import QL from "../GraphQL";
import { connect } from "react-redux";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
// import { inspect } from 'util';
// import Lambda from "../Lambda";
import {fetchChallenge} from "../redux_helpers/actions/cacheActions";
import InviteFunctions from "../databaseFunctions/InviteFunctions";
import ChallengeCard from "../components/ChallengeCard";

class InviteToChallengeModalProp extends Component {
    state = {
        isLoading: true,
        friendID: null,
        loadedChallengeIDs: [],
        sentRequest: false,
        error: null,
        isInviteLoading: false,
        inviteButtonName: "Invite To Challenge",
        isInviteDisabled: false
    };

    constructor(props) {
        super(props);
        this.getChallengeAttribute = this.getChallengeAttribute.bind(this);
        InviteToChallengeModalProp.getTodayDateString = InviteToChallengeModalProp.getTodayDateString.bind(this);
        InviteToChallengeModalProp.convertMonth = InviteToChallengeModalProp.convertMonth.bind(this);
        this.rows = this.rows.bind(this);
    }

    update() {
        // TODO Change this if we want to actually be able to do something while it's loading
        const user = this.props.user;
        //console.log("Updating Scheduled Events");
        if (!user.id) {
            console.error("Pretty bad error");
            this.setState({isLoading: true});
        }

        if (this.state.isLoading && user.hasOwnProperty("challenges") && user.challenges && user.challenges.length) {
            this.setState({isLoading: false});
            for (let i = 0; i < user.challenges.length; i++) {
                this.props.fetchChallenge(user.challenges[i], ["id", "title", "endTime", "time_created", "owner", "ifCompleted", "members", "capacity", "goal", "access", "restriction", "tags", "prize"],
                    (challenge) => {
                        if (challenge && challenge.id && !this.state.loadedChallengeIDs.includes(challenge.id)) {
                            this.state.loadedChallengeIDs.push(challenge.id);
                        }
                    });
            }
            this.setState({isInviteLoading: false});
        }
        else if (!this.props.info.isLoading) {
            if (!this.state.sentRequest && !this.props.info.error) {
                this.props.fetchUserAttributes(["challenges"]);
                this.setState({sentRequest: true});
            }
        }
    }

    handleInviteToChallenge(challengeID) {
        InviteFunctions.createChallengeInvite(this.props.user.id, this.props.user.id, this.props.friendID, challengeID,
            (data) => {
                this.handleClose();
                this.setState({isInviteLoading: false, isInviteDisabled: true, inviteButtonName: "Invite Sent"});

            }, (error) => {
                console.log(JSON.stringify(error));
                this.setState({isInviteLoading: false, error: error});
            });
    }

    handleOpen = () => {this.props.onOpen.bind(this);};
    handleClose = () => {this.props.onClose.bind(this);};

    componentDidMount() {
        this.update();
    }

    componentWillReceiveProps(newProps, nextContext) {
        this.update();
    }

    sendInvite(challenge) {
        this.setState({isInviteLoading: true});
        this.handleInviteToChallenge(challenge);
    }

    getChallengeAttribute = (challengeID, attribute) => {
        if (challengeID) {
            const challenge = this.props.cache.challenges[challengeID];
            if (challenge) {
                return challenge[attribute];
            }
        }
        return null;
    }

    static getTodayDateString() {
        // This is annoying just because we need to work with time zones :(
        const shortestTimeInterval = 5;
        const date = new Date();
        date.setMinutes(date.getMinutes() + (shortestTimeInterval - (date.getMinutes() % shortestTimeInterval)));
        return String(date);
    }

    static convertMonth(month) {
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        for(let i=0; i<12; i++) {
            //console.log(month + "vs" + months[i]);
            if(month === months[i]) {
                return (i + 1);
            }
        }
    }

    getDaysLeft = (challengeID) => {
        let curDate = InviteToChallengeModalProp.getTodayDateString();
        let endTime = this.getChallengeAttribute(challengeID, "endTime");
        let curMonth = InviteToChallengeModalProp.convertMonth(curDate.substr(4, 3));
        let endMonth = endTime.substr(5, 2);
        //console.log(endMonth + " vs " + curMonth + " = " + (endMonth - curMonth));
        if(endTime && curDate) {
            endTime = parseInt(endTime.substr(8, 2), 10);
            curDate = parseInt(curDate.substr(8, 2), 10);
            //console.log(endMonth - curMonth);
            if((endMonth - curMonth) < 0) {
                //console.log((endTime + (30 * (endMonth - curMonth + 12))));
                return ((endTime + (30 * (endMonth - curMonth + 12))) - curDate);
            }
            else {
                return ((endTime + (30 * (endMonth - curMonth))) - curDate);
            }
        }
    }

    rows(userID, friendID, challenges, challengeInviteHandler, isInviteLoading, daysLeft) {
        const rowProps = [];
        for (let i = 0; i < challenges.length; i++) {
            //alert("see me");
            if (challenges.hasOwnProperty(i) === true && daysLeft(challenges[i]) >= 0) {
                rowProps.push(
                    <Fragment key={i+1}>
                        <Card fluid raised>
                            <Card.Content>
                                <ChallengeCard challengeID={challenges[i]}/>
                                <Button disabled={this.state.isInviteDisabled} loading={this.state.isInviteLoading} primary fluid onClick={() => {challengeInviteHandler(challenges[i])}}>{this.state.inviteButtonName}</Button>
                            </Card.Content>
                        </Card>
                    </Fragment>
                );
            }
        }

        return rowProps;
    }

    render() {

        if (this.props.info.isLoading) {
            //console.log("loading: " + JSON.stringify(this.state));
            return(
                <Modal dimmer='blurring' open={this.props.open} onClose={this.props.onClose.bind(this)}>
                    <Message>Loading...</Message>
                </Modal>
            );
        }
        if (this.state.loadedChallengeIDs && this.state.loadedChallengeIDs.length && this.state.loadedChallengeIDs.length > 0) {
            return(
                <Modal centered dimmer='blurring' size='large' open={this.props.open} onClose={this.props.onClose.bind(this)} closeIcon>
                    <Modal.Header className="u-bg--bg">Select Challenge</Modal.Header>
                    <Modal.Content className="u-bg--bg">
                        {this.rows(this.props.user.id, this.props.friendID, this.state.loadedChallengeIDs, this.sendInvite.bind(this),
                            this.state.isInviteLoading, this.getDaysLeft)}
                    </Modal.Content>
                    {this.state.error}
                </Modal>
            );
        }
        else {
            return(
                <Modal dimmer='blurring' open={this.props.open} onClose={this.props.onClose.bind(this)}>
                    <Message>No current challenges...</Message>
                </Modal>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info,
    cache: state.cache
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

export default connect(mapStateToProps, mapDispatchToProps)(InviteToChallengeModalProp);
