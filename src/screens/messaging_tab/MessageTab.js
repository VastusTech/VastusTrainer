import React from 'react';
import {Grid, Button, Modal} from "semantic-ui-react";
import MessageBoardFeed from "../../vastuscomponents/components/messaging/MessageBoardFeed";
import MessageSelectionScreen from "../../vastuscomponents/components/messaging/MessageSelectionScreen";
import connect from "react-redux/es/connect/connect";

const MessageTab = (props) => (
    <Grid centered>
        <Grid.Row>
            <Modal trigger={<Button primary>Start New Chat</Button>} closeIcon>
                <MessageSelectionScreen
                    ids={props.user.friends}
                    noObjectsMessage={"No clients or trainers to message"}
                    acceptedItemTypes={["Client", "Trainer"]}
                />
            </Modal>
        </Grid.Row>
        <Grid.Row>
            <MessageBoardFeed userID={props.user.id}/>
        </Grid.Row>
    </Grid>
);

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(MessageTab);
