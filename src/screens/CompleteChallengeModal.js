import React, { Component, Fragment } from "react";
import { Modal, Message, Button, Card } from "semantic-ui-react";
import ClientCard from "../components/ClientCard";
import { connect } from "react-redux";
import ChallengeFunctions from "../databaseFunctions/ChallengeFunctions";

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
            console.log(this.props.user.id + " " + this.state.challengeID + " " + id);
            ChallengeFunctions.updateWinner(this.props.user.id, this.state.challengeID, id,
                (data) => {
                    // console.log("Successfully set the event winner!");
                    this.props.onClose();
                }, (error) => {
                    console.log("Event winner setting failed");
                });
        }
    }

    // This should show a modal that
    render() {
        function rows(members, buttonHandler) {
            const rowProps = [];
            for (let i = 0; i < members.length; i++) {
                rowProps.push(
                    <Card raised key={members[i]}>
                        <Card.Content>
                            <ClientCard clientID={members[i]} />
                            <Button primary fluid onClick={() => {buttonHandler(members[i])}}>Select</Button>
                        </Card.Content>
                    </Card> 
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
                <Modal centered open={this.props.open} onClose={this.props.onClose.bind(this)} closeIcon>
                    <Modal.Header className="u-bg--bg">Select Winner</Modal.Header>
                    <Modal.Content className="u-bg--bg">
                        <Card.Group itemsPerRow={2}>
                            {rows(this.getChallengeAttribute("members"), this.declareWinnerButtonHandler.bind(this))}
                        </Card.Group>
                    </Modal.Content>
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