import React, { Component } from "react";
import { Modal, Message, Grid, Button } from "semantic-ui-react";
import ClientCard from "../components/ClientCard";
import Lambda from "../Lambda";
import { connect } from "react-redux";

/**
 * Takes in open, onClose, and challengeID
 */
class CompleteChallengeModal extends Component {
    state = {
        challengeID: null,
    };

    componentDidMount() {
        this.setState({challengeID: this.props.challengeID})
    }

    componentWillReceiveProps(newProps, nextContext) {
        if (this.props.challengeID !== newProps.challengeID) {
            this.setState({challengeID: newProps.challengeID});
        }
    }

    getChallengeAttribute(attribute) {
        if (this.state.challengeID) {
            const challenge = this.props.cache.events[this.state.challengeID];
            if (challenge) {
                return challenge[attribute];
            }
        }
        return null;
    }

    declareWinnerButtonHandler(id) {
        if (id && this.state.challengeID && this.props.user.id) {
            alert(this.props.user.id + " " + this.state.challengeID + " " + id);
            Lambda.setEventWinner(this.props.user.id, this.state.challengeID, id,
                (data) => {
                    // alert("Successfully set the event winner!");
                    this.props.onClose();
                }, (error) => {
                    alert("Event winner setting failed");
                });
        }
    }

    // This should show a modal that
    render() {
        function rows(members, buttonHandler) {
            const rowProps = [];
            for (let i = 0; i < members.length; i++) {
                rowProps.push(
                    <Grid.Row key={members[i]}>
                        <Grid.Column>
                            <ClientCard clientID={members[i]}/>
                        </Grid.Column>
                        <Grid.Column>
                            <Button primary inverted onClick={() => {buttonHandler(members[i])}}>Declare Winner!</Button>
                        </Grid.Column>
                    </Grid.Row>
                );
            }
            return rowProps;
        }

        if (this.props.info.isLoading) {
            return (
                <Modal dimmer='blurring' open={this.props.open} onClose={this.props.onClose.bind(this)}>
                    <Message>Loading...</Message>
                </Modal>
            );
        }
        if (this.getChallengeAttribute("members") && this.getChallengeAttribute("members").length > 0) {
            return(
                <Modal open={this.props.open} onClose={this.props.onClose.bind(this)} closeIcon>
                    <Grid columns={2}>
                        {rows(this.getChallengeAttribute("members"), this.declareWinnerButtonHandler.bind(this))}
                    </Grid>
                </Modal>
            );
        }
        else {
            return (
                <Modal dimmer='blurring' open={this.props.open} onClose={this.props.onClose.bind(this)} closeIcon>
                    <Message>No members in the challenge yet!</Message>
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

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompleteChallengeModal);