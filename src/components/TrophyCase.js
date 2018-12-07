import _ from 'lodash';
import React, { Component, Fragment } from 'react';
import { Grid, Label, Icon } from 'semantic-ui-react';

// TODO: Feature to be implemented later don't worry about this file.
class TrophyCase extends Component {
    state = {
        numTrophies: 0
    };

    constructor(props) {
        super(props);
        if (this.props.numTrophies) {
            this.state.numTrophies = this.props.numTrophies;
        }
    }

    render() {
        function columns(num) {
            return(_.times(num, i => (
                <Label key={i}>
                    <Icon name='trophy' />
                </Label>
            )));
        }

        return(
            <Fragment>
                {columns(this.state.numTrophies)}
            </Fragment>
        );
    }
}

export default TrophyCase;