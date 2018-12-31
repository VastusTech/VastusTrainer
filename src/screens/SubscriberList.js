import React, {Component, Fragment} from 'react'
import { Button, List, Message, Image } from 'semantic-ui-react';
import ClientModal from "../components/ClientModal";
import QL from "../GraphQL";
import { connect } from "react-redux";
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import Lambda from "../Lambda";
import { inspect } from 'util';
import proPic from '../img/BlakeProfilePic.jpg';
import {fetchClient} from "../redux_helpers/actions/cacheActions";
import ClientCard from "../components/ClientCard";

class SubscriberListProp extends Component {
    state = {
        isLoading: true,
        subscribers: [],
        sentRequest: false,
        clientModalOpen: false,
        error: null
    };

    constructor(props) {
        super(props);
        this.openClientModal = this.openClientModal.bind(this);
        this.closeClientModal = this.closeClientModal.bind(this);
    }

    componentDidMount() {
        this.update(this.props);
    }

    // update() {
    //     // TODO Change this if we want to actually be able to do something while it's loading
    //     const user = this.props.user;
    //     if (!user.id) {
    //         console.error("Pretty bad error");
    //         this.setState({isLoading: true});
    //     }
    //
    //     if (user.hasOwnProperty("subscribers")) {
    //         //console.log("subscribers: " + user.subscribers);
    //         if(user.subscribers != null) {
    //             //console.log("getting to subscriber loupe");
    //             for (let i = 0; i < user.subscribers.length; i++) {
    //                 if (!(user.subscribers[i] in this.state.subscribers)) {
    //                     this.addsubscriberFromGraphQL(user.subscribers[i]);
    //                 }
    //             }
    //         }
    //         else {
    //             console.log("You got no subscribers you loser");
    //         }
    //     }
    //     else if (!this.props.info.isLoading) {
    //         if (!this.state.sentRequest && !this.props.info.error) {
    //             this.props.fetchUserAttributes(user.id, ["subscribers"]);
    //             this.setState({sentRequest: true});
    //         }
    //     }
    // }

    update(props) {
        // TODO Change this if we want to actually be able to do something while it's loading
        const user = props.user;
        //console.log("Updating Scheduled Events");
        if (!user.id) {
            console.error("Pretty bad error");
            this.setState({isLoading: true});
        }

        if (!this.state.sentRequest && this.state.isLoading && user.hasOwnProperty("subscribers") && user.subscribers && user.subscribers.length) {
            this.state.sentRequest = true;
            this.setState({isLoading: false});
            for (let i = 0; i < user.subscribers.length; i++) {
                if (!this.state.subscribers.includes(user.subscribers[i])) {
                    props.fetchClient(user.subscribers[i], ["id", "username", "gender", "birthday", "name", "subscribers", "challengesWon", "scheduledEvents", "profileImagePath", "profilePicture", "subscriberRequests"]
                        , (client) => {
                            if (client && client.id) {
                                this.state.subscribers.push(client.id);
                            }
                        });
                }
                // if (!(user.scheduledEvents[i] in this.state.events)) {
                //     this.addEventFromGraphQL(user.scheduledEvents[i]);
                // }
            }
        }
        // else if (!props.info.isLoading) {
        //     if (!this.state.sentRequest && !props.info.error) {
        //         this.props.fetchUserAttributes(["subscribers"]);
        //         this.setState({sentRequest: true});
        //     }
        // }
    }

    // addsubscriberFromGraphQL(subscriberID) {
    //     QL.getClient(subscriberID, ["id"], (data) => {
    //         console.log("successfully got a subscriber");
    //         this.setState({subscribers: {...this.state.subscribers, [data.id]: data}, isLoading: false});
    //     }, (error) => {
    //         console.log("Failed to get a vent");
    //         console.log(JSON.stringify(error));
    //         this.setState({error: error});
    //     });
    // }

    getClientAttribute(id, attribute) {
        const client = this.props.cache.clients[id];
        if (client) {
            return client[attribute];
        }
        return null;
    }

    componentWillReceiveProps(newProps) {
        this.update(newProps);
    }

    openClientModal = () => { this.setState({clientModalOpen: true}); };
    closeClientModal = () => { this.setState({clientModalOpen: false}); };

    render() {

        function rows(subscribers, closeModal, openModal, openBool, userID, getClientAttribute, forceUpdate) {
            const rowProps = [];
            for (const key in subscribers) {
                if (subscribers.hasOwnProperty(key) === true) {
                    //console.log("subscriber " + key + ": " + JSON.stringify(subscribers[key].id));
                    const subscriberID = subscribers[key];
                    rowProps.push(
                        <List.Item>
                            <List.Content>
                                <ClientCard rank={key} clientID={subscriberID} feedUpdate={forceUpdate}/>
                            </List.Content>
                        </List.Item>
                    );
                }
            }
            return rowProps;
        }

        if (this.props.info.isLoading) {
            return(
                <Message>Loading...</Message>
            )
        }
        if (this.props.user.subscribers && this.props.user.subscribers.length > 0 && this.state.subscribers.length > 0) {
            return(
                <List relaxed verticalAlign="middle">
                    {rows(this.state.subscribers, this.closeClientModal, this.openClientModal, this.state.clientModalOpen, this.props.user.id, this.getClientAttribute.bind(this),
                    this.forceUpdate.bind(this))}
                </List>
            );
        }
        else {
            return(
                <Message>No subscribers yet!</Message>
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
        fetchClient: (id, variablesList, dataHandler) => {
            dispatch(fetchClient(id, variablesList, dataHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubscriberListProp);