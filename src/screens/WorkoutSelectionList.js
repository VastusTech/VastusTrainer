import React, { Component } from 'react'
import _ from 'lodash';
import {Grid, Button, Message, Image, Modal, Item, Segment, Dropdown, TextArea, Checkbox, Icon} from 'semantic-ui-react';
import CreateEventProp from "./CreateEvent";
import VTLogo from "../img/vt_new.svg"
import {connect} from "react-redux";
import {Form} from "semantic-ui-react/dist/commonjs/collections/Form/Form";

class WorkoutSelectionList extends Component {
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

    render() {

        return (
            <Modal closeIcon trigger={<Button primary fluid size="large"> <Icon name='plus' /> Post Challenge</Button>}>
                <Modal.Header align='center'>Select Challenge</Modal.Header>
                <Modal.Content align='center'>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Image size='small' src={require('../img/vastus-tech-icons-03.svg')} />
                                    HIIT
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Image size='small' src={require('../img/vastus-tech-icons-04.svg')} />
                                    Strength
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Image size='small' src={require('../img/vastus-tech-icons-02.svg')} />
                                    Performance
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Image size='small' src={require('../img/vastus-tech-icons-01.svg')} />
                                    Endurance
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <CreateEventProp/>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache
});

export default connect(mapStateToProps)(WorkoutSelectionList);