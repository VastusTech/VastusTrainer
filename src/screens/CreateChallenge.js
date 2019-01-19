import React, { Component } from 'react'
import _ from 'lodash';
import {Grid, Button, Message, Image, Modal, Card, Icon, Form, Container, TextArea, Checkbox, Header} from 'semantic-ui-react';
import CreateEventProp from "./CreateEvent";
import VTLogo from "../img/vt_new.svg"
import {connect} from "react-redux";
// import Lambda from "../Lambda";
import {setError} from "../redux_helpers/actions/infoActions";
import {clearChallengeQuery, fetchChallenge, putChallenge, putChallengeQuery} from "../redux_helpers/actions/cacheActions";
import ChallengeFunctions from "../databaseFunctions/ChallengeFunctions";
import PostFunctions from "../databaseFunctions/PostFunctions";

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

function arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele !== value;
    });

}

/*type Props = {
    queryChallenges: any
}*/

/*
* Create Event Prop
*
* This is the modal for creating events. Every input is in the form of a normal text input.
* Inputting the time and date utilizes the Semantic-ui Calendar React library which isn't vanilla Semantic.
 */
class CreateChallengeProp extends Component {
    state = {
        checked: false,
        checkedRest: false,
        isSubmitLoading: false,
        showModal: false,
        submitError: "",
        showSuccessModal: false,
        showSuccessLabel: false,
        showSuccessLabelTimer: 0,
        challengeType: "",
        tags: [],
        performancePressed: false,
        endurancePressed: false,
        hiitPressed: false,
        strengthPressed: false,
        restriction: null
    };

    toggle = () => this.setState({ checked: !this.state.checked });
    toggleRest = () => this.setState({ checkedRest: !this.state.checkedRest });

    eventState = {
        title: "",
        eventDate: null,
        startTime: CreateChallengeProp.getNowTimeString(),
        duration: '60',
        location: "",
        time: "",
        time_created: "",
        capacity: "",
        goal: "",
        prize: "",
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
            console.error("Event access should be public or private");
        }
    };

    handleRestrictionSwitch = () => {
        if(this.state.restriction === 'invite') {
            this.setState({restriction: null});
        }
        else {
            this.setState({restriction: 'invite'});
        }
    };

    showRestriction() {
        if(!this.state.restriction) {
            return 'unrestricted';
        }
        else {
            return this.state.restriction;
        }
    }

    handleTag(tag) {
        if(tag === "HIIT" && !this.state.hiitPressed) {
            this.setState({tags: this.state.tags.concat(tag)},
                () => console.log(JSON.stringify(this.state.tags)));
            this.setState({hiitPressed: true});
        }
        else if(tag === "Performance" && !this.state.performancePressed) {
            this.setState({tags: this.state.tags.concat(tag)},
                () => console.log(JSON.stringify(this.state.tags)));
            this.setState({performancePressed: true});
        }
        else if(tag === "Endurance" && !this.state.endurancePressed) {
            this.setState({tags: this.state.tags.concat(tag)},
                () => console.log(JSON.stringify(this.state.tags)));
            this.setState({endurancePressed: true});
        }
        else if(tag === "Strength" && !this.state.strengthPressed) {
            this.setState({tags: this.state.tags.concat(tag)},
                () => console.log(JSON.stringify(this.state.tags)));
            this.setState({strengthPressed: true});
        }
        else if(tag === "HIIT" && this.state.hiitPressed) {
            this.setState({tags: arrayRemove(this.state.tags, tag)},
                () => console.log(JSON.stringify(this.state.tags)));
            this.setState({hiitPressed: false});
        }
        else if(tag === "Performance" && this.state.performancePressed) {
            this.setState({tags: arrayRemove(this.state.tags, tag)},
                () => console.log(JSON.stringify(this.state.tags)));
            this.setState({performancePressed: false});
        }
        else if(tag === "Endurance" && this.state.endurancePressed) {
            this.setState({tags: arrayRemove(this.state.tags, tag)},
                () => console.log(JSON.stringify(this.state.tags)));
            this.setState({endurancePressed: false});
        }
        else if(tag === "Strength" && this.state.strengthPressed) {
            this.setState({tags: arrayRemove(this.state.tags, tag)},
                () => console.log(JSON.stringify(this.state.tags)));
            this.setState({strengthPressed: false});
        }
    }

    handleSubmit = () => {
        // TODO Make sure the dates are well formed?
        /*
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
        */
        this.setState({isSubmitLoading: true});

        // TODO Check to see if valid inputs!
        if (this.eventState.capacity && this.eventState.title && this.eventState.goal && this.state.tags) {
            if (Number.isInteger(+this.eventState.capacity)) {
                ChallengeFunctions.createChallengeOptional(this.props.user.id, this.props.user.id, this.eventState.eventDate, this.eventState.capacity,
                    this.eventState.title, this.eventState.goal, "n/a",
                    "3", [], this.state.tags, this.eventState.access, this.state.restriction, this.eventState.prize, (data) => {
                        console.log("Successfully created a challenge!");
                        //console.log(data.data);
                        PostFunctions.createNewChallengePost(this.props.user.id, this.props.user.id, this.eventState.description, this.eventState.access, data.data, (data) => {
                            console.log("Successfully created automatic challenge Post");
                        }, (error) => {
                            //console.log(JSON.stringify(error));
                            this.setState({submitError: "*" + JSON.stringify(error)});
                            this.setState({isSubmitLoading: false});
                        });
                        //This is the second call
                        //this.props.clearChallengeQuery();
                        //this.props.queryChallenges();
                        this.setState({isSubmitLoading: false});
                        this.closeModal();
                        this.setState({showSuccessLabel: true});
                        this.setState({showModal: false});
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
        if(this.state.showSuccessModal) {
            return (
                <Modal open={this.state.showSuccessModal}>
                    <Modal.Header align='center'>Successfully Created Event!</Modal.Header>
                    <Modal.Content>
                        <Button fluid negative size="small" onClick={this.closeSuccessModal}>Ok</Button>
                    </Modal.Content>
                </Modal>
            );
        }
    }

    createSuccessLabel() {
        if(this.state.showSuccessLabel && this.state.showModal) {
            this.setState({showSuccessLabel: false});
        }
        else if(this.state.showSuccessLabel) {
            return (<Message positive>
                <Message.Header>Success!</Message.Header>
                <p>
                    You just created a new Challenge!
                </p>
            </Message>);
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

    render() {

        return (
            <div align='center'>
                <Header align='center'>Challenge Builder</Header>
                <div align='center'>
                    <Grid align='center'>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Button inverted={this.state.hiitPressed} basic={!this.state.hiitPressed}>
                                    <Image dark size='medium' src={require('../img/vastus-tech-icons-03.svg')} onClick={() => {this.handleTag("HIIT")}}/>
                                    <div style={{color: 'white'}}>HIIT</div>
                                </Button>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Button inverted inverted={this.state.strengthPressed} basic={!this.state.strengthPressed}>
                                    <Image size='medium' src={require('../img/vastus-tech-icons-04.svg')} onClick={() => {this.handleTag("Strength")}}/>
                                    <div style={{color: 'white'}}>Strength</div>
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Button inverted inverted={this.state.performancePressed} basic={!this.state.performancePressed}>
                                    <Image size='medium' src={require('../img/vastus-tech-icons-02.svg')} onClick={() => {this.handleTag("Performance")}}/>
                                    <div style={{color: 'white'}}>Performance</div>
                                </Button>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Button inverted inverted={this.state.endurancePressed} basic={!this.state.endurancePressed}>
                                    <Image size='medium' src={require('../img/vastus-tech-icons-01.svg')} onClick={() => {this.handleTag("Endurance")}}/>
                                    <div style={{color: 'white'}}>Endurance</div>
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <Container align='center'>
                        <Grid centered>
                            <Grid.Row centered>
                                <Grid.Column>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Input fluid label="Title" type="text" name="title" placeholder="Title" onChange={value => this.changeStateText("title", value)}/>
                                        <div className="field" fluid>
                                            <label>End Date & Time</label>
                                            <input fluid type="datetime-local" name="challengeDate" onChange={value => this.changeStateText("eventDate", value)}/>
                                        </div>
                                        <Form.Input fluid label="Capacity" type="text" name="capacity" placeholder="Number of allowed attendees... " onChange={value => this.changeStateText("capacity", value)}/>
                                        <Form.Input fluid label="Goal" type="text" name="goal" placeholder="Criteria the victor is decided on..." onChange={value => this.changeStateText("goal", value)}/>
                                        <Form.Input fluid label="Prize" type="text" name="prize" placeholder="Prize for winning the event..." onChange={value => this.changeStateText("prize", value)}/>
                                        {/*<Form.Field>
                                            <div className="field" width={5}>
                                                <label>Difficulty</label>
                                                <Rating icon='star' defaultRating={1} maxRating={3} />
                                            </div>
                                        </Form.Field>*/}
                                        <Form.Field width={12}>
                                            <Checkbox toggle onClick={this.handleAccessSwitch} onChange={this.toggle} checked={this.state.checked} label={this.eventState.access} />
                                        </Form.Field>
                                        <Form.Field width={12}>
                                            <Checkbox toggle onClick={this.handleRestrictionSwitch} onChange={this.toggleRest} checked={this.state.checkedRest} label={this.showRestriction()} />
                                        </Form.Field>
                                        <div>{this.displayError()}{this.createSuccessLabel()}</div>
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </div>
                <Modal.Actions>
                    <Button loading={this.state.isSubmitLoading} disabled={this.state.isSubmitLoading} primary size="big" type='button' onClick={() => { this.handleSubmit()}}>Submit</Button>
                </Modal.Actions>
                {this.createSuccessLabel()}</div>
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
        fetchChallenge: (id, variablesList) => {
            dispatch(fetchChallenge(id, variablesList));
        },
        putChallenge: (event) => {
            dispatch(putChallenge(event));
        },
        putChallengeQuery: (queryString, queryResult) => {
            dispatch(putChallengeQuery(queryString, queryResult));
        },
        clearChallengeQuery: () => {
            dispatch(clearChallengeQuery());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateChallengeProp);