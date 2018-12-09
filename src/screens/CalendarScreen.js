import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Header } from "semantic-ui-react";
import {
    DateInput,
    TimeInput,
    DateTimeInput,
    DatesRangeInput
} from 'semantic-ui-calendar-react';

class CalendarScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: '',
            time: '',
            dateTime: '',
            datesRange: ''
        };
    }

    handleChange = (event, {name, value}) => {
        alert("Changed: [name] = " + name + ", [value] = " + value);

        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
        }
    };

    render() {
        return (
            <div>
                <Header>Schedule</Header>
                <Form>
                    <DateInput
                        inline
                        name="date"
                        value={this.state.date}
                        onChange={this.handleChange} />
                </Form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);
