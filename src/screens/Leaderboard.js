import React, { Component, Fragment } from "react";
import _ from "lodash";
import { Visibility, Grid, Header, Message } from "semantic-ui-react";
import { connect } from "react-redux";
import ClientCard from "../components/ClientCard";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import {fetchClient} from "../redux_helpers/actions/cacheActions";

class Leaderboard extends Component {
    state = {
        isLoading: true,
        isFetching: true,
        sentRequest: false,
        friends: [],
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // alert("Mounted");
        this.update(this.props);
    }

    componentWillReceiveProps(newProps, nextContext) {
        this.update(newProps);
    }

    update(props) {
        if (!props.user.id) {
            // alert("No user ID...");
            return;
        }
        //alert("Cur User for grabbing Attributes: " + this.props.user.id);
        if (props.user.hasOwnProperty("friends") && props.user.hasOwnProperty("challengesWon") && props.user.friends && props.user.friends.length && this.state.isLoading) {
            // alert("in here + " + this.state.isLoading);
            this.state.isLoading = false;
            let challengesWonLength;
            if (props.user.challengesWon) {
                challengesWonLength = props.user.challengesWon.length;
            }
            else {
                challengesWonLength = 0;
            }
            // this.state.friends.push({id: props.user.id, challengesWonLength: challengesWonLength});
            //this.setState({isLoading: false});
            // alert(JSON.stringify(props.user.friends));
            // alert(JSON.stringify(this.state.friends));
            this.state.friends.push({id: this.props.user.id, challengesWonLength});
            for (let i = 0; i < props.user.friends.length; i++) {
                // if (!(this.props.user.scheduledEvents[i] in this.state.events)) {
                //     this.addEventFromGraphQL(this.props.user.scheduledEvents[i]);
                // }
                // alert("Fetching client = " + props.user.friends[i]);
                props.fetchClient(props.user.friends[i], ["id", "challengesWon"],
                    (client) => {
                        // Rerender when you get a new scheduled event
                        // alert("Received client id = " + client.id);
                        for (let i = 0; i < this.state.friends.length; i++) {
                            if (this.state.friends[i].id === client.id) {
                                return;
                            }
                        }
                        let challengesWonLength;
                        if (client.challengesWon) {
                            challengesWonLength = client.challengesWon.length;
                        }
                        else {
                            challengesWonLength = 0;
                        }
                        // alert("Client id = " + client.id + " has challenge length = " + challengesWonLength);
                        // alert("hey " + JSON.stringify(this.state.friends));
                        this.state.friends.push({id: client.id, challengesWonLength: challengesWonLength});
                        if (this.state.friends.length === props.user.friends.length) {
                            this.setState({isFetching: false})
                        }
                        //this.setState({friends: [...this.state.friends, {id: client.id, challengesWon: client.challengesWon}]});
                    });
            }
        }
        else if (!props.info.isLoading) {
            if (!this.state.sentRequest && !props.info.error && props.user.id != null) {
                props.fetchUserAttributes(["friends", "challengesWon"]);
                this.setState({sentRequest: true});
            }
        }
    }

    // TODO Soon, we will need to address the User vs Client issue
    getFriendAttribute(id, attribute) {
        if (id && attribute) {
            const client = this.props.cache.clients[id];
            if (client) {
                if (attribute.substr(attribute.length - 6) === "Length") {
                    attribute = attribute.substr(0, attribute.length - 6);
                    if (client[attribute] && client[attribute].length) {
                        return client[attribute].length;
                    }
                    else {
                        return 0;
                    }
                }
                return this.props.cache.clients[this.state.clientID][attribute];
            }
        }
        return null;
    }

    render() {
        /**
         * This function takes in a list of events and displays them in a list of Event Card views.
         * @param clients
         * @param getClientAttribute
         * @returns {*}
         */
        function rows(clients, getClientAttribute) {
            //let sortedClients = [...clients];
            // alert(JSON.stringify(clients));
            let sortedClients = clients.sort(function(a,b) {
                return (b.challengesWonLength - a.challengesWonLength);
            });
            // alert(JSON.stringify(sortedClients));
            // if(events != null && events.length > 0)
            //     alert(JSON.stringify(events[0].id));
            // alert("EVENTS TO PRINT: ");
            // alert(JSON.stringify(events));
            return _.times(sortedClients.length, i => (
                <Fragment key={i}>
                    <Grid columns={2}>
                        <Grid.Column>
                            <Header>{i + 1}. </Header>
                        </Grid.Column>
                        <Grid.Column>
                            <ClientCard clientID={sortedClients[i].id}/>
                        </Grid.Column>
                    </Grid>
                </Fragment>
            ));
        }

        //This displays the rows in a grid format, with visibility enabled so that we know when the bottom of the page
        //is hit by the user.
        if (this.state.isFetching) {
            return(
                <Message>Loading...</Message>
            );
        }
        return (
            <Visibility onUpdate={this.handleUpdate}>
                {rows(this.state.friends, this.getFriendAttribute.bind(this))}
            </Visibility>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info,
    cache: state.cache,
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (variablesList) => {
            dispatch(fetchUserAttributes(variablesList));
        },
        fetchClient: (id, variablesList, dataHandler) => {
            dispatch(fetchClient(id, variablesList, dataHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboard);