import { Fragment } from 'react';
import {Tab, Menu, Icon, Header, Feed } from "semantic-ui-react";
// import EventFeed from "./EventFeed";
import NotificationFeed from "./NotificationBellFeed";
import ProfileProp from "./Profile";
import React from "react";
// import CreateEventProp from "./CreateEvent";
// import NextEventProp from "../components/NextWorkout";
import LeaderBoard from "./Leaderboard";
// import VideoUploadScreen from "./VideoUploadScreen";
// import PaymentScreen from "./PaymentScreen";
import NotificationBellProp from "../components/NotificationBell";
import ChallengeFeed from "./ChallengeFeed";
import SearchScreen from "./SearchScreen";

/**
* Tabs TODO Potentially clean this up
*
* The app is currently split up into three sections: home, profile, and notifications.
 */
export default () => (
    <Tab menu={{fixed: "bottom", widths: 5, size: "small", inverted: true}} panes={
        [
            {
                menuItem:
                    (<Menu.Item key={0}>
                        <Icon name='home' size='large' />
                    </Menu.Item>),
                render: () =>
                    <Tab.Pane basic attached={false}>
                        <ChallengeFeed/>
                    </Tab.Pane>
            },
            {
                menuItem: (
                    <Menu.Item key={1}>
                        <Icon name='user circle outline' size='large' />
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <ProfileProp/>
                </Tab.Pane>
            },
            {
                menuItem: (
                    <Menu.Item key={2}>
                        <Icon name='winner' size='large' />
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <LeaderBoard />
                </Tab.Pane>
            },
            {
                menuItem: (
                    <Menu.Item key={3}>
                        <Icon name='search' size='large' />
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <SearchScreen />
                </Tab.Pane>
            },
            {
                menuItem: (
                    <Menu.Item key={4}>
                        <NotificationBellProp/>
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <Fragment>
                        <Header inverted textAlign={'center'}>Notification Feed</Header>
                        <NotificationFeed/>
                    </Fragment>
                </Tab.Pane>
            },
        ]
    }/>
);