import React, { Component, Fragment } from 'react';
import { Card, Dimmer, Loader, Grid, Header } from 'semantic-ui-react';
import ClientModal from './ClientModal';
import { connect } from 'react-redux';
import { fetchClient } from "../redux_helpers/actions/cacheActions";

/*
* Event Card
*
* This is the generic view for how a challenge shows up in any feeds or lists.
* It is used as a modal trigger in the feed.
 */

type Props = {
    rank: number,
    clientID: string
}

class ClientCard extends Component<Props> {
    constructor(props) {
        super(props);
        this.openClientModal = this.openClientModal.bind(this);
        this.closeClientModal = this.closeClientModal.bind(this);
        this.profilePicture = this.profilePicture.bind(this);
        this.getClientAttribute = this.getClientAttribute.bind(this);
    }

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
                <div className="u-avatar u-avatar--small" style={{backgroundImage: `url(${this.getClientAttribute("profilePicture")})`}}></div>
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
        const { rank } = this.props;
        if (!this.getClientAttribute("id")) {
            return(
                <Card fluid raised>
                    <h1>Loading...</h1>
                </Card>
            );
        }
        return(
            // This is displays a few important pieces of information about the challenge for the feed view.
            <Card fluid raised onClick={this.openClientModal}>
                <Card.Content>
                    {/* If no rank */}
                    {!rank && (
                        <Fragment>
                            <Card.Header>
                                <div className="u-flex u-flex-justify--center u-margin-bottom--2">
                                    {this.profilePicture()}
                                </div>
                            </Card.Header>
                            <Card.Header textAlign = 'center'>
                                {this.getClientAttribute("name")}
                            </Card.Header>
                        </Fragment>
                    )}
                    {/* If has rank */}
                    {rank && (
                        <Grid divided verticalAlign='middle'>
                            <Grid.Row>
                                <Grid.Column width={4}>
                                    <Header size='large' textAlign='center'>{rank}</Header>
                                </Grid.Column>
                                <Grid.Column width={12}>
                                    <div className="u-flex u-flex-align--center">
                                        {this.profilePicture()} <Header size='small' className='u-margin-top--0 u-margin-left--2'>{this.getClientAttribute("name")}</Header>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    )}
                    <ClientModal open={this.state.clientModalOpen} onClose={this.closeClientModal} clientID={this.state.clientID}/>
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
