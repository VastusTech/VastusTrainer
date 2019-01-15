import React, { Component, Fragment } from 'react';
import { Card, Dimmer, Loader, Grid, Header } from 'semantic-ui-react';
import TrainerPortalModal from './TrainerPortalModal';
import { connect } from 'react-redux';
import { fetchTrainer } from "../redux_helpers/actions/cacheActions";

/*
* Trainer Card
*
* This is the generic view for how a challenge shows up in any feeds or lists.
* It is used as a modal trigger in the feed.
 */

type Props = {
    rank: number,
    trainerID: string
}

class TrainerCard extends Component<Props> {
    constructor(props) {
        super(props);
        this.openTrainerModal = this.openTrainerModal.bind(this);
        this.closeTrainerModal = this.closeTrainerModal.bind(this);
        this.profilePicture = this.profilePicture.bind(this);
        this.getTrainerAttribute = this.getTrainerAttribute.bind(this);
    }

    state = {
        error: null,
        // isLoading: true,
        trainerID: null,
        // event: null,
        // members: {},
        // owner: null,
        // ifOwned: false,
        // ifJoined: false,
        // capacity: null,
        trainerModalOpen: false
    };

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps, nextContext) {
        if (newProps.trainerID && !this.state.trainerID) {
            this.setState({trainerID: newProps.trainerID});
        }
    }

    getTrainerAttribute(attribute) {
        if (this.state.trainerID) {
            const trainer = this.props.cache.trainers[this.state.trainerID];
            if (trainer) {
                if (attribute.substr(attribute.length - 6) === "Length") {
                    attribute = attribute.substr(0, attribute.length - 6);
                    if (trainer[attribute] && trainer[attribute].length) {
                        return trainer[attribute].length;
                    }
                    else {
                        return 0;
                    }
                }
                return this.props.cache.trainers[this.state.trainerID][attribute];
            }
        }
        return null;
    }

    openTrainerModal = () => {this.setState({trainerModalOpen: true})};
    closeTrainerModal = () => {this.setState({trainerModalOpen: false})};

    profilePicture() {
        if (this.getTrainerAttribute("profilePicture")) {
            return(
                <div className="u-avatar u-avatar--small" style={{backgroundImage: `url(${this.getTrainerAttribute("profilePicture")})`}}></div>
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
        if (!this.getTrainerAttribute("id")) {
            return(
                <Card color='purple' fluid raised>
                    <h1>Loading...</h1>
                </Card>
            );
        }
        return(
            // This is displays a few important pieces of information about the challenge for the feed view.
            <Card color='purple' fluid raised onClick={this.openTrainerModal}>
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
                                {this.getTrainerAttribute("name")}
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
                                        {this.profilePicture()} <Header size='small' className='u-margin-top--0 u-margin-left--2'>{this.getTrainerAttribute("name")}</Header>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    )}
                    <TrainerPortalModal open={this.state.trainerModalOpen} onClose={this.closeTrainerModal} trainerID={this.state.trainerID}/>
                </Card.Content>
                <Card.Content extra>
                    <Card.Meta>
                        {this.getTrainerAttribute("challengesWonLength")} challenges won
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
        fetchTrainer: (id, variablesList, dataHandler) => {
            dispatch(fetchTrainer(id, variablesList, dataHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TrainerCard);
