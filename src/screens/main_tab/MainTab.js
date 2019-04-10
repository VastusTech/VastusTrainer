import React from "react";
import {Header, Modal, Button, Icon} from "semantic-ui-react";
import PostFeedProp from "../../vastuscomponents/components/feeds/PostFeed";
import NextChallengeProp from "../../vastuscomponents/components/info/NextChallenge";
import QL from "../../vastuscomponents/api/GraphQL";
import CreateChallengeProp from "../../vastuscomponents/components/manager/CreateChallenge";

const MainTab = () => {

    return (
        <div>
            <Modal closeIcon trigger={<Button fluid primary>Create Challenge {" "}<Icon name="trophy"/></Button>}>
                <Modal.Content>
                    <CreateChallengeProp/>
                </Modal.Content>
            </Modal>
            <Header sub>Your Next Challenge:</Header>
            <NextChallengeProp/>
            <Header sub>Upcoming Posts:</Header>
            <PostFeedProp filter={
                QL.generateFilter({
                    and: [{
                        or: [{
                            postType: {
                                eq: "$postType1"
                            }
                        }, {
                            postType: {
                                eq: "$postType2"
                            }
                        }]
                    }
                    ]}, {
                    postType1: "Challenge",
                    postType2: "newChallenge",
                })
            }/>
        </div>
    );
};

export default MainTab;
