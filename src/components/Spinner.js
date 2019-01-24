import React from "react";
import PropTypes from "prop-types";
import {Message, Icon} from "semantic-ui-react";

const Spinner = (props) => {
    if (props.loading) {
        return (
            <Message icon>
                <Icon name='spinner' size="small" loading />
                <Message.Content>
                    <Message.Header>
                        Loading...
                    </Message.Header>
                </Message.Content>
            </Message>
        );
    }
    return null;
};

Spinner.propTypes = {
    loading: PropTypes.bool
};

Spinner.defaultProps = {
    loading: true
};

export default Spinner;
