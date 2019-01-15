import React, { Component } from 'react'
import _ from 'lodash';
import {Grid, Button, Message, Image, Modal, Item} from 'semantic-ui-react';
import ClientModal from "../components/ClientModal";
import proPic from "../img/BlakeProfilePic.jpg";
import Lambda from "../Lambda";
import connect from "react-redux/es/connect/connect";
import ClientCard from "../components/ClientCard";

class EventMemberList extends Component {
    state = {
        error: null,
        isLoading: false,
        eventID: null,
        // members: [],
        // challengeID: null,
        // ifOwned: false,
        // clientModalOpen: false,
        // selectedClientID: null
    };

    constructor(props) {
        super(props);
        // this.openClientModal = this.openClientModal.bind(this);
    }

    componentDidMount() {
        if (this.props.eventID) {
            this.setState({eventID: this.props.eventID, isLoading: false});
        }
        //if (this.props.members) {
        //console.log("owned:" + this.props.ifOwned);
        // this.setState({isLoading: false, members: this.props.members, ifOwned: this.props.ifOwned});
        //}
    }

    componentWillReceiveProps(newProps) {
        if (newProps.eventID !== this.props.eventID) {
            this.setState({eventID: newProps.eventID, isLoading: false});
        }
        //if (newProps.members) {
        // this.setState({isLoading: false, members: newProps.members, ifOwned: newProps.ifOwned});
        //}
    }

    getEventAttribute(attribute) {
        if (this.state.eventID) {
            const event = this.props.cache.events[this.state.eventID];
            if (event) {
                return event[attribute];
            }
        }
        return null;
    }

    // openClientModal = (id) => {this.setState({selectedClientID: id, clientModalOpen: true})};
    // closeClientModal = () => {this.setState({clientModalOpen: false})};

    render() {
        // function createCorrectButton(userID, winnerID, challengeID, isOwned) {
        //     //console.log("user: " + userID + " winner: " + winnerID + " challenge: " + challengeID + " Owned?: " + isOwned);
        //     if(isOwned === true) {
        //         return (
        //             <Button basic color='purple' onClick={() => {Lambda.completeChallenge(userID, winnerID, challengeID,
        //                 (data) => {
        //                     console.log(JSON.stringify(data));
        //                 }, (error) => {
        //                     console.log(JSON.stringify(error));
        //                 })}}>
        //                 Declare Winner
        //             </Button>
        //         )
        //     }
        // }

        function rows(userID, members, handleClientPress)
        {
            //console.log(members);
            return _.times(members.length, i => (
                <Grid.Row key={i} className="ui one column stackable center aligned page grid">
                    <ClientCard clientID={members[i]}/>
                </Grid.Row>
            ));
        }
        if (this.state.isLoading) {
            return(
                <Message>Loading...</Message>
            )
        }
        // if (!this.state.selectedClientID) {
        //     return(
        //         <Grid>{rows(this.props.user.id, this.state.members, this.openClientModal)}</Grid>
        //     );
        // }
        if (this.getEventAttribute("members") && this.getEventAttribute("members").length > 0) {
            return (
                <Grid>
                    {rows(this.props.user.id, this.getEventAttribute("members"), this.openClientModal)}
                </Grid>
            );
        }
        else {
            return(
                <Message>No current members!</Message>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache
});

export default connect(mapStateToProps)(EventMemberList);