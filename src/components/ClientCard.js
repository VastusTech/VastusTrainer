import React, { Component } from 'react';
import { Card, Dimmer, Image, Loader, Grid } from 'semantic-ui-react';
import ClientModal from './ClientModal';
import { connect } from 'react-redux';
import { fetchClient } from "../redux_helpers/actions/cacheActions";

/*
* Event Card
*
* This is the generic view for how a challenge shows up in any feeds or lists.
* It is used as a modal trigger in the feed.
 */
class ClientCard extends Component {
    state = {
        error: null,
        // isLoading: true,
        clientID: null,
        // event: null,
        // members: {},
        // owner: null,
        // ifOwned: false,
        // ifJoined: false,
        // capacity: null,
        clientModalOpen: false
    };

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps, nextContext) {
        if (newProps.clientID && !this.state.clientID) {
           
            this.setState({clientID: newProps.clientID});
        }
    }

    getClientAttribute(attribute) {
        if (this.state.clientID) {
            const client = this.props.cache.clients[this.state.clientID];
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

    openClientModal = () => {this.setState({clientModalOpen: true})};
    closeClientModal = () => {this.setState({clientModalOpen: false})};

    profilePicture() {
        if (this.getClientAttribute("profilePicture")) {
            return(
                <Image wrapped size="tiny" circular src={this.getClientAttribute("profilePicture")} />
            );
        }
        else {
            return(
                <Dimmer inverted>
                    <Loader />
                </Dimmer>
            );
        }
    }

    render() {
        if (!this.getClientAttribute("id")) {
            return(
                <Card fluid raised>
                    <h1>Loading...</h1>
                </Card>
            );
        }
        return(
            // This is displays a few important pieces of information about the challenge for the feed view.
            <Card fluid raised onClick={this.openClientModal.bind(this)}>
                <Card.Content>
                    
                            <Card.Header textAlign = 'center'>
                            {this.profilePicture()}
                             </Card.Header>
                              <Card.Header textAlign = 'center'>
                                {this.getClientAttribute("name")}
                            </Card.Header>
                            <ClientModal open={this.state.clientModalOpen} onClose={this.closeClientModal.bind(this)} clientID={this.state.clientID}/>
                        
                </Card.Content>
                <Card.Content extra>
                    <Card.Meta>
                        {this.getClientAttribute("challengesWonLength")} challenges won
                    </Card.Meta>
                </Card.Content>
            </Card>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchClient: (id, variablesList) => {
            dispatch(fetchClient(id, variablesList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientCard);
