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

class BuddyListProp extends Component {
    state = {
        isLoading: true,
        friends: {},
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
    //         alert("Pretty bad error");
    //         this.setState({isLoading: true});
    //     }
    //
    //     if (user.hasOwnProperty("friends")) {
    //         //alert("Friends: " + user.friends);
    //         if(user.friends != null) {
    //             //alert("getting to friend loupe");
    //             for (let i = 0; i < user.friends.length; i++) {
    //                 if (!(user.friends[i] in this.state.friends)) {
    //                     this.addFriendFromGraphQL(user.friends[i]);
    //                 }
    //             }
    //         }
    //         else {
    //             alert("You got no friends you loser");
    //         }
    //     }
    //     else if (!this.props.info.isLoading) {
    //         if (!this.state.sentRequest && !this.props.info.error) {
    //             this.props.fetchUserAttributes(user.id, ["friends"]);
    //             this.setState({sentRequest: true});
    //         }
    //     }
    // }

    update(props) {
        // TODO Change this if we want to actually be able to do something while it's loading
        const user = props.user;
        //alert("Updating Scheduled Events");
        if (!user.id) {
            alert("Pretty bad error");
            this.setState({isLoading: true});
        }

        if (this.state.isLoading && user.hasOwnProperty("friends") && user.friends && user.friends.length) {
            this.setState({isLoading: false});
            for (let i = 0; i < user.friends.length; i++) {
                props.fetchClient(user.friends[i], ["id", "name", "gender", "birthday", "profileImagePath", "profilePicture"]);
                // if (!(user.scheduledEvents[i] in this.state.events)) {
                //     this.addEventFromGraphQL(user.scheduledEvents[i]);
                // }
            }
        }
        // else if (!props.info.isLoading) {
        //     if (!this.state.sentRequest && !props.info.error) {
        //         this.props.fetchUserAttributes(["friends"]);
        //         this.setState({sentRequest: true});
        //     }
        // }
    }

    // addFriendFromGraphQL(friendID) {
    //     QL.getClient(friendID, ["id"], (data) => {
    //         console.log("successfully got a friend");
    //         this.setState({friends: {...this.state.friends, [data.id]: data}, isLoading: false});
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

        function rows(friends, closeModal, openModal, openBool, userID, getClientAttribute, forceUpdate) {
            const rowProps = [];
            for (const key in friends) {
                if (friends.hasOwnProperty(key) === true) {
                    //alert("Friend " + key + ": " + JSON.stringify(friends[key].id));
                    const friendID = friends[key];
                    rowProps.push(
                        <List.Item>
                            <List.Content>
                                <ClientCard clientID={friendID} feedUpdate={forceUpdate}/>
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
        if (this.props.user.friends && this.props.user.friends.length && this.props.user.friends.length > 0) {
            return(
                <List relaxed divided verticalAlign="middle">
                    {rows(this.props.user.friends, this.closeClientModal, this.openClientModal, this.state.clientModalOpen, this.props.user.id, this.getClientAttribute.bind(this),
                    this.forceUpdate.bind(this))}
                </List>
            );
        }
        else {
            return(
                <Message>No friends yet!</Message>
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
        fetchClient: (id, variablesList) => {
            dispatch(fetchClient(id, variablesList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuddyListProp);