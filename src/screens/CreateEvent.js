import React, { Component } from 'react';
import {Checkbox, Modal, Button, Icon, Form, Segment, TextArea, Dropdown, Label} from 'semantic-ui-react';
import Lambda from "../Lambda";
import {connect} from "react-redux";
import {setError} from "../redux_helpers/actions/infoActions";

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

/*
* Create Event Prop
*
* This is the modal for creating events. Every input is in the form of a normal text input.
* Inputting the time and date utilizes the Semantic-ui Calendar React library which isn't vanilla Semantic.
 */
class CreateEventProp extends Component {

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
            alert("Event access should be public or private");
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
        // alert(endDate.toDateString());
        // alert(endDate.getMinutes());
        // endDate.setMinutes(endDate.getMinutes() + this.eventState.duration);
        // alert(endDate.getMinutes());
        // alert(endDate.toDateString());

        

        const time = startDate.toIsoString() + "_" + endDate.toIsoString();

        this.setState({isSubmitLoading: true});

        // TODO Check to see if valid inputs!
        if (this.eventState.capacity && this.eventState.location && this.eventState.title && this.eventState.goal) {
            if (Number.isInteger(+this.eventState.capacity)) {
                Lambda.createChallengeOptional(this.props.user.id, this.props.user.id, time, this.eventState.capacity,
                    this.eventState.location, this.eventState.title, this.eventState.goal, this.eventState.description,
                    "3", [], this.eventState.access, (data) => {
                        console.log("Successfully created a challenge!");
                        this.setState({isSubmitLoading: false});
                        this.closeModal();
                        this.setState({showSuccessLabel: true});
                        //this.setState({showSuccessModal: true});

                    }, (error) => {
                        //alert(JSON.stringify(error));
                        this.setState({submitError: "*" + JSON.stringify(error)});
                        this.setState({isSubmitLoading: false});
                    });
            }
            else {
                this.setState({isSubmitLoading: false});
                alert("Capacity needs to be an integer!");
                alert(this.eventState.capacity);
            }
        }
        else {
            this.setState({isSubmitLoading: false});
            alert("All fields need to be filled out!");
        }

        // let time = '';
        // let endTime;

        // let date = this.eventState.startDateTime.substr(0, 11);
        // let nextDate = this.eventState.startDateTime.substr(0, 8) + "0" +
        //     (parseInt(this.eventState.startDateTime.substr(8, 2), 10) + 1) +
        //     this.eventState.startDateTime.substr(10, 1);
        // let hour = this.eventState.startDateTime.substr(11, 2);
        // let durationHour = this.state.duration.substr(0, 1);
        // let minute = this.eventState.startDateTime.substr(14, 2);
        // let durationMinute = this.state.duration.substr(2, 2);
        // let endHour = (parseInt(hour, 10) + parseInt(durationHour, 10));
        //
        // if(endHour >= 24) {
        //     endTime = (this.eventState.startDateTime + "_" + nextDate + "0" + (parseInt(hour, 10) +
        //         parseInt(durationHour, 10) - 24));
        // }
        // else if((endHour < 24) && (endHour < 10)) {
        //     endTime = this.eventState.startDateTime + "_" + date + "0" +
        //         (parseInt(hour, 10) + parseInt(durationHour, 10));
        // }
        // else {
        //     endTime = this.eventState.startDateTime + "_" + date +
        //         (parseInt(hour, 10) + parseInt(durationHour, 10));
        // }
        //
        // alert("Minute: " + minute + " " + "Duration: " + durationMinute);
        // if(((parseInt(minute, 10) + parseInt(durationMinute, 10))) >= 60) {
        //     minute = (parseInt(minute, 10) + parseInt(durationMinute, 10)) - 60;
        //     hour = "0" + (parseInt(hour, 10) + 1);
        //     alert("Min: " + minute);
        //     endTime = endTime.substr(0, 28) + (hour + ":" + minute);
        //     alert("End: " + endTime);
        // }
        // else {
        //     minute = (parseInt(minute, 10) + parseInt(durationMinute, 10));
        //     alert("Min: " + minute);
        //     endTime += (":" + minute);
        //     alert("End: " + endTime);
        // }
        //
        // alert("End time substring: " + endTime.substr(0, 28));
        // alert(endTime);
        //
        // alert(endTime);

        // if(Number.isInteger(+this.eventState.capacity)) {
        //     Lambda.createChallenge(this.props.user.id, this.props.user.id, time, String(this.eventState.capacity),
        //         String(this.eventState.location), String(this.eventState.title),
        //         String(this.eventState.goal), (data) => {
        //             alert(JSON.stringify(data));
        //             // HANDLE WHAT HAPPENS afterwards
        //             if (data.errorMessage) {
        //                 // Java error handling
        //                 alert("ERROR: " + data.errorMessage + "!!! TYPE: " + data.errorType + "!!! STACK TRACE: " + data.stackTrace + "!!!");
        //             }
        //             else {
        //                 alert("ya did it ya filthy animal");
        //             }
        //         }, (error) => {
        //             alert(error);
        //             // TODO HANDLE WHAT HAPPENS afterwards
        //             // TODO keep in mind that this is asynchronous
        //         }
        //     );
        // }
        // else {
        //     alert("Capacity must be an integer! Instead it is: " + this.eventState.capacity);
        // }
    };

    handleDurationChange = (e, data) => {
        this.eventState.duration = data.value;
        alert(this.eventState.duration);
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


    //Inside of render is a modal containing each form input required to create a Event.
    render() {

        return (
            <div>
            <div>{this.createSuccessLabel()}</div>
            <Segment raised inverted>
                {/*Modal trigger={<Button primary fluid size="large" closeIcon>+ Create Event</Button>} closeIcon>*/}
                <Modal closeIcon onClose={this.closeModal} open={this.state.showModal} trigger={<div>
                    <Button primary fluid size="large" onClick={() => this.setState({ showModal: true })}><Icon className='plus' />Post Challenge</Button></div>}>
                    <Modal.Header align='center'>Challenge Builder</Modal.Header>
                    <Modal.Content>

                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group unstackable widths={2}>
                                <Form.Input label="Title" type="text" name="title" placeholder="Title" onChange={value => this.changeStateText("title", value)}/>
                                <Form.Input label="Location" type="text" name="location" placeholder="Address for Event" onChange={value => this.changeStateText("location", value)}/>
                            </Form.Group>
                            <Form.Group unstackable widths={3}>
                                <div className="field">
                                    <label>Event Date</label>
                                    <input type="date" name="eventDate" defaultValue={CreateEventProp.getTodayDateString()} onChange={value => this.changeStateText("eventDate", value)}/>
                                </div>
                                <div className="field">
                                    <label>Start Time</label>
                                    <input type="time" name="startTime" defaultValue={CreateEventProp.getNowTimeString()} onChange={value => this.changeStateText("startTime", value)}/>
                                </div>
                                <div className="field">
                                    <label>Duration</label>
                                    <Dropdown placeholder='duration' defaultValue={this.eventState.duration} fluid search selection options={timeOptions} onChange={this.handleDurationChange}/>
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
                            <div>{this.state.submitError}</div>
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
    user: state.user
});

const mapDispatchToProps = (dispatch) => {
    return {
        setError: (error) => {
            dispatch(setError(error));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateEventProp);


