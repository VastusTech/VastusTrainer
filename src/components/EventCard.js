import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import EventDescriptionModal from './EventDescriptionModal';
import { connect } from 'react-redux';
import {fetchEvent} from "../redux_helpers/actions/cacheActions";

function convertTime(time) {
    if (parseInt(time, 10) > 12) {
        return "0" + (parseInt(time, 10) - 12) + time.substr(2, 3) + "pm";
    }
    else if (parseInt(time, 10) === 12) {
        return time + "pm";
    }
    else if (parseInt(time, 10) === 0) {
        return "0" + (parseInt(time, 10) + 12) + time.substr(2, 3) + "am"
    }
    else {
        return time + "am"
    }
}

function convertDate(date) {
    let dateString = String(date);
    let year = dateString.substr(0, 4);
    let month = dateString.substr(5, 2);
    let day = dateString.substr(8, 2);

    return month + "/" + day + "/" + year;
}

/*
* Event Card
*
* This is the generic view for how a challenge shows up in any feeds or lists.
* It is used as a modal trigger in the feed.
 */
class EventCard extends Component {
    state = {
        error: null,
        // isLoading: true,
        eventID: null,
        // event: null,
        // members: {},
        // owner: null,
        // ifOwned: false,
        // ifJoined: false,
        // capacity: null,
        eventModalOpen: false
    };

    // componentDidMount() {
        // if (this.props.event) {
        //     let ifOwned = false;
        //     let ifJoined = false;
        //     //alert("Membahs: " + this.props.event.members);
        //     //alert(this.props.owner + "vs. " + this.props.event.owner);
        //     if (this.props.user.id === this.props.event.owner) {
        //         //alert("Same owner and cur user for: " + this.props.event.id);
        //         ifOwned = true;
        //     }
        //     if (this.props.event.members && this.props.event.members.includes(this.props.user.id)) {
        //         ifJoined = false;
        //     }
        //
        //     this.setState({isLoading: false, event: this.props.event, members: this.props.event.members, ifOwned, ifJoined});
        // }
    // }
    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.eventID && !this.state.eventID) {
            // this.props.fetchEvent(newProps.eventID, ["id", "title", "goal", "time", "time_created", "owner", "members", "capacity", "difficulty"]);
            this.setState({eventID: newProps.eventID});
        }
    }

    convertFromISO(dateTime) {
        let dateTimeString = String(dateTime);
        let dateTimes = String(dateTimeString).split("_");
        let fromDateString = dateTimes[0];
        let toDateString = dateTimes[1];
        let fromDate = new Date(fromDateString);
        let toDate = new Date(toDateString);

        // Display time logic came from stack over flow
        // https://stackoverflow.com/a/18537115
        const fromHourInt = fromDate.getHours() > 12 ? fromDate.getHours() - 12 : fromDate.getHours();
        const toHourInt = toDate.getHours() > 12 ? toDate.getHours() - 12 : toDate.getHours();
        const fromminutes = fromDate.getMinutes().toString().length === 1 ? '0'+ fromDate.getMinutes() : fromDate.getMinutes(),
            fromhours = fromHourInt.toString().length === 1 ? '0'+ fromHourInt : fromHourInt,
            fromampm = fromDate.getHours() >= 12 ? 'PM' : 'AM',
            tominutes = toDate.getMinutes().toString().length === 1 ? '0'+ toDate.getMinutes() : toDate.getMinutes(),
            tohours = toHourInt.toString().length === 1 ? '0'+ toHourInt : toHourInt,
            toampm = toDate.getHours() >= 12 ? 'PM' : 'AM',
            months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        return days[fromDate.getDay()]+', '+months[fromDate.getMonth()]+' '+fromDate.getDate()+', '+fromDate.getFullYear()+' '+fromhours+':'+fromminutes+fromampm + ' - '+tohours+':'+tominutes+toampm;
    }

    getEventAttribute(attribute) {
        if (this.state.eventID) {
            let event = this.props.cache.events[this.state.eventID];
            if (event) {
                if (attribute.substr(attribute.length - 6) === "Length") {
                    attribute = attribute.substr(0, attribute.length - 6);
                    if (event[attribute] && event[attribute].length) {
                        return event[attribute].length;
                    }
                    else {
                        return 0;
                    }
                }
                return event[attribute];
            }
        }
        return null;
    }

    openEventModal = () => { this.setState({eventModalOpen: true})};
    closeEventModal = () => {this.setState({eventModalOpen: false})};

    render() {
        if (!this.getEventAttribute("id")) {
            return(
                <Card fluid raised>
                    <h1>Loading...</h1>
                </Card>
            );
        }
        return(
            // This is displays a few important pieces of information about the challenge for the feed view.
            <Card fluid raised onClick={this.openEventModal.bind(this)}>
                <Card.Content>
                    <Card.Header textAlign = 'center'>{this.getEventAttribute("title")}</Card.Header>
                    <Card.Meta textAlign = 'center' >{this.convertFromISO(this.getEventAttribute("time"))}</Card.Meta>
                    <Card.Meta textAlign = 'center'>Location: {this.getEventAttribute("address")}</Card.Meta>
                    <EventDescriptionModal open={this.state.eventModalOpen} onClose={this.closeEventModal.bind(this)} eventID={this.state.eventID}/> </Card.Content> <Card.Content extra> {/* <Card.Meta>{this.state.event.time_created}</Card.Meta> */} <Card.Meta textAlign = 'center'>{this.getEventAttribute("membersLength")} of {this.getEventAttribute("capacity")} spots taken.</Card.Meta> </Card.Content>
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
        fetchEvent: (id, variablesList) => {
            dispatch(fetchEvent(id, variablesList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventCard);
