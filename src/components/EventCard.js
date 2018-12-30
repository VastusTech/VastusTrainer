import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import EventDescriptionModal from './EventDescriptionModal';
import { connect } from 'react-redux';
import {fetchEvent} from "../redux_helpers/actions/cacheActions";
import {convertFromISO, convertFromIntervalISO} from "../logic/TimeHelper";

type Props = {
    eventID: string
}

/*
* Event Card
*
* This is the generic view for how a challenge shows up in any feeds or lists.
* It is used as a modal trigger in the feed.
 */
class EventCard extends Component<Props> {
    state = {
        error: null,
        eventID: null,
        eventModalOpen: false
    };

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.eventID && !this.state.eventID) {
            // this.props.fetchEvent(newProps.eventID, ["id", "title", "goal", "time", "time_created", "owner", "members", "capacity", "difficulty"]);
            this.setState({eventID: newProps.eventID});
        }
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
                    <EventDescriptionModal open={this.state.eventModalOpen} onClose={this.closeEventModal.bind(this)} eventID={this.state.eventID}/>
                </Card.Content>
                <Card.Content extra>
                    <Card.Meta>{convertFromISO(this.getEventAttribute("time_created"))}</Card.Meta>
                    <Card.Meta textAlign = 'center'>
                        {this.getEventAttribute("membersLength")} of {this.getEventAttribute("capacity")} spots taken.
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
        fetchEvent: (id, variablesList) => {
            dispatch(fetchEvent(id, variablesList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventCard);
