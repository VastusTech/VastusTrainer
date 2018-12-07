import { Tab } from "semantic-ui-react";
import React, { Component } from "react";
import ScheduledChallengesProp from "./ScheduledEventList";
import OwnedChallengesProp from "./OwnedEventList";

class ChallengeManagerProp extends Component {
    state = {
        isLoading: true,
        username: null
    };

    constructor(props) {
        super(props);
        if (this.props.username) {
            this.setState({isLoading: false, username: this.props.username});
        }
    }

    render() {
        const panes = [
            {
                menuItem: 'Owned Challenges', render: () => <Tab.Pane attached={false}>
                    <OwnedChallengesProp username={this.props.username}/>
                </Tab.Pane>
            },
            {
                menuItem: 'Scheduled Challenges', render: () => <Tab.Pane attached={false}>
                    <ScheduledChallengesProp username={this.props.username}/>
                </Tab.Pane>
            },
        ];

        return(
            <Tab menu={{inverted: false, secondary: true, pointing: true}} panes={panes}/>
        );
    }
}

export default ChallengeManagerProp;
