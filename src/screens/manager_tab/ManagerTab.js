import React, {Component} from 'react';
import {Grid, Button, Modal, Divider} from 'semantic-ui-react';
import Calendar from "./Calendar";
import GroupFeed from "../../vastuscomponents/components/feeds/GroupFeed";
import CreateGroupProp from "../../vastuscomponents/components/manager/CreateGroup";

class ManagerTab extends Component {
    render() {
        return (
            <div>
                <Grid fluid>
                    <Grid.Row centered fluid>
                        <Modal fluid trigger={<Grid fluid centered><Button fluid primary>Create New Group</Button></Grid>}>
                            <CreateGroupProp/>
                        </Modal>
                    </Grid.Row>
                    <Grid.Row centered fluid>
                        <Calendar/>
                    </Grid.Row>
                    <Grid.Row centered fluid>
                        <GroupFeed />
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default ManagerTab;