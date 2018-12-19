import React, { Component } from 'react';
import {Checkbox, Modal, Button, Icon, Form, Segment, TextArea, Dropdown, Label, Image, Message} from 'semantic-ui-react';
import Lambda from "../Lambda";
import {connect} from "react-redux";
import {setError} from "../redux_helpers/actions/infoActions";
import VTLogo from "../img/vt_new.svg";
import QL from "../GraphQL";
import {clearEventQuery, fetchEvent, putEvent, putEventQuery} from "../redux_helpers/actions/cacheActions";
import ChallengeFunctions from "../databaseFunctions/ChallengeFunctions";

// Take from StackOverflow, nice snippit!
// https://stackoverflow.com/a/17415677
Date.prototype.toIsoString = function() {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
};

const timeOptions = [ { key: '0:15', value: '15', text: '0:15' },
    { key: '0:30', value: '30', text: '0:30' },
    { key: '0:45', value: '45', text: '0:45' },
    { key: '1:00', value: '60', text: '1:00' },
    { key: '1:15', value: '75', text: '1:15' },
    { key: '1:30', value: '90', text: '1:30' },
    { key: '1:45', value: '105', text: '1:45' },
    { key: '2:00', value: '120', text: '2:00' },
    { key: '2:15', value: '135', text: '2:15' },
    { key: '2:30', value: '150', text: '2:30' },
    { key: '2:45', value: '165', text: '2:45' },
    { key: '3:00', value: '180', text: '3:00' },
    //{ key: '3:00+', value: '3:00+', text: '3:00+' }
];

/*type Props = {
    queryEvents: any
}*/

/*
* Create Event Prop
*
* This is the modal for creating events. Every input is in the form of a normal text input.
* Inputting the time and date utilizes the Semantic-ui Calendar React library which isn't vanilla Semantic.
 */
class CreateEventProp extends Component<Props> {

    state = {
        checked: false,
        isSubmitLoading: false,
        showModal: false,
        submitError: "",
        showSuccessModal: false,
        showSuccessLabel: false,
        showSuccessLabelTimer: 0
    };

    toggle = () => this.setState({ checked: !this.state.checked });

    eventState = {
        title: "",
        eventDate: CreateEventProp.getTodayDateString(),
        startTime: CreateEventProp.getNowTimeString(),
        duration: '60',
        location: "",
        time: "",
        time_created: "",
        capacity: "",
        goal: "",
        description: "",
        access: "public"
    };

    changeStateText(key, value) {
        // TODO Sanitize this input
        // TODO Check to see if this will, in fact, work.!
        this.eventState[key] = value.target.value;
        console.log("New " + key + " is equal to " + value.target.value);
    }

    handleAccessSwitch = () => {
        if(this.eventState.access === 'public') {
            this.eventState.access = 'private';
        }
        else if (this.eventState.access === 'private') {
            this.eventState.access = 'public';
        }
        else {
            console.log("Event access should be public or private");
        }
    };

    handleSubmit = () => {
        // TODO Make sure the dates are well formed?
        const year = parseInt(this.eventState.eventDate.substr(0, 4));
        const month = parseInt(this.eventState.eventDate.substr(5, 2)) - 1;
        const day = parseInt(this.eventState.eventDate.substr(8, 2));
        const hour = parseInt(this.eventState.startTime.substr(0, 2));
        const minute = parseInt(this.eventState.startTime.substr(3, 2));
        let startDate = new Date(year, month, day, hour, minute);
        let endDate = new Date(startDate.getTime() + (60000 * this.eventState.duration));
        // console.log(endDate.toDateString());
        // console.log(endDate.getMinutes());
        // endDate.setMinutes(endDate.getMinutes() + this.eventState.duration);
        // console.log(endDate.getMinutes());
        // console.log(endDate.toDateString());

        

        const time = startDate.toIsoString() + "_" + endDate.toIsoString();

        this.setState({isSubmitLoading: true});

        // TODO Check to see if valid inputs!
        if (this.eventState.capacity && this.eventState.location && this.eventState.title && this.eventState.goal) {
            if (Number.isInteger(+this.eventState.capacity)) {
                // TODO Fix this........
                ChallengeFunctions.createChallengeOptional(this.props.user.id, this.props.user.id, time, this.eventState.capacity,
                    this.eventState.location, this.eventState.title, this.eventState.goal, this.eventState.description,
                    "3", [], this.eventState.access, (data) => {
                        console.log("Successfully created a challenge!");
                        //This is the second call
                        this.props.clearEventQuery();
                        this.props.queryEvents();
                        this.setState({isSubmitLoading: false});
                        this.closeModal();
                        this.setState({showSuccessLabel: true});
                        //this.setState({showSuccessModal: true});

                    }, (error) => {
                        //console.log(JSON.stringify(error));
                        this.setState({submitError: "*" + JSON.stringify(error)});
                        this.setState({isSubmitLoading: false});
                    });
            }
            else {
                this.setState({isSubmitLoading: false, submitError: "Capacity needs to be an integer!"});
            }
        }
        else {
            this.setState({isSubmitLoading: false, submitError: "All fields need to be filled out!"});
        }
    };

    handleDurationChange = (e, data) => {
        this.eventState.duration = data.value;
        //console.log(this.eventState.duration);
        // this.setState({
        //     duration: data.value,
        // }, () => {
        //     console.log('value',this.state.duration);
        // });
    };

    static getTodayDateString() {
        // This is annoying just because we need to work with time zones :(
        const shortestTimeInterval = 5;
        const date = new Date();
        date.setMinutes(date.getMinutes() + (shortestTimeInterval - (date.getMinutes() % shortestTimeInterval)));
        return date.toIsoString().substr(0, 10);
    }

    static getNowTimeString() {
        // Sneaking some modular arithmetic in this ;) This is so that the time shown is always a nice lookin' number
        const shortestTimeInterval = 5;
        const date = new Date();
        date.setMinutes(date.getMinutes() + (shortestTimeInterval - (date.getMinutes() % shortestTimeInterval)));
        return date.toIsoString().substr(11, 5);
    }

    closeModal = () => {
        this.setState({ showModal: false })
    };

    createSuccessModal() {

        return(
            <Modal open={this.state.showSuccessModal}>
                <Modal.Header align='center'>Successfully Created Event!</Modal.Header>
                <Modal.Content>
                    <Button fluid negative size="small" onClick={this.closeSuccessModal}>Ok</Button>
                </Modal.Content>
            </Modal>
        );
    }

    createSuccessLabel() {
        if(this.state.showSuccessLabel && this.state.showModal) {
            this.setState({showSuccessLabel: false});
        }
        else if(this.state.showSuccessLabel) {
            return (<Label inverted primary fluid size="massive" color="green">Successfully Created Event!</Label>);
        }
        else {
            return null;
        }
    }

    closeSuccessModal = () => {
        this.setState({showSuccessModal: false});
    };

    displayError() {
        if(this.state.submitError !== "") {
            return (<Message negative>
                <Message.Header>Sorry!</Message.Header>
                <p>{this.state.submitError}</p>
            </Message>);
        }
    }

    //Inside of render is a modal containing each form input required to create a Event.
    render() {

        return (
            <div>
            <div>{this.createSuccessLabel()}</div>
            <Segment raised inverted>
                {/*Modal trigger={<Button primary fluid size="large" closeIcon>+ Create Event</Button>} closeIcon>*/}
                <Modal closeIcon onClose={this.closeModal} open={this.state.showModal} trigger={<div>
                    <Button primary fluid size="large" onClick={() => this.setState({ showModal: true })}>{<Image src={VTLogo} avatar />}Custom Challenge</Button></div>}>
                    <Modal.Header align='center'>Challenge Builder</Modal.Header>
                    <Modal.Content>

                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group unstackable widths={2}>
                                <Form.Input label="Title" type="text" name="title" placeholder="Title" onChange={value => this.changeStateText("title", value)}/>
                                <Form.Input label="Location" type="text" name="location" placeholder="Address for Event" onChange={value => this.changeStateText("location", value)}/>
                            </Form.Group>
                            <Form.Group unstackable widths={3}>
                                <div className="field">
                                    <label>End Date</label>
                                    <input type="date" name="eventDate" defaultValue={CreateEventProp.getTodayDateString()} onChange={value => this.changeStateText("eventDate", value)}/>
                                </div>
                                <div className="field">
                                    <label>Duration</label>
                                    <Dropdown placeholder='duration' defaultValue={this.eventState.duration} fluid search selection inverted options={timeOptions} onChange={this.handleDurationChange}/>
                                </div>
                            </Form.Group>
                            <Form.Group unstackable widths={2}>
                                <Form.Input label="Capacity" type="text" name="capacity" placeholder="Number of allowed attendees... " onChange={value => this.changeStateText("capacity", value)}/>
                                <Form.Input label="Goal" type="text" name="goal" placeholder="Criteria the victor is decided on..." onChange={value => this.changeStateText("goal", value)}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field width={12}>
                                    <label>Event Description</label>
                                    <TextArea type="text" name="description" placeholder="Describe Event here... " onChange={value => this.changeStateText("description", value)}/>
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field width={12}>
                                    <Checkbox toggle onClick={this.handleAccessSwitch} onChange={this.toggle} checked={this.state.checked} label={this.eventState.access} />
                                </Form.Field>
                            </Form.Group>
                            <div>{this.displayError()}</div>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button loading={this.state.isSubmitLoading} disabled={this.state.isSubmitLoading} primary size="big" type='button' onClick={() => { this.handleSubmit()}}>Submit</Button>
                    </Modal.Actions>
                </Modal>
            </Segment>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info,
    cache: state.cache
});

const mapDispatchToProps = (dispatch) => {
    return {
        setError: (error) => {
            dispatch(setError(error));
        },
        fetchEvent: (id, variablesList) => {
            dispatch(fetchEvent(id, variablesList));
        },
        putEvent: (event) => {
            dispatch(putEvent(event));
        },
        putEventQuery: (queryString, queryResult) => {
            dispatch(putEventQuery(queryString, queryResult));
        },
        clearEventQuery: () => {
            dispatch(clearEventQuery())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateEventProp);


