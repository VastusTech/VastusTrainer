import { Fragment } from 'react';
import {Tab, Menu, Icon, Header, Feed } from "semantic-ui-react";
import NotificationFeed from "./notifications_tab/NotificationBellFeed";
import ProfileTab from "./profile_tab/ProfileTab";
import React from "react";
import LeaderBoard from "./Leaderboard";
import NotificationBellProp from "./notifications_tab/NotificationBell";
// import ChallengeFeed from "./ChallengeFeed";
import PostFeed from "./main_tab/PostFeed";
import Calendar from "./manager_tab/Calendar";
import OrganizationalScreen from "./manager_tab/OrganizationalScreen";
// import SearchScreen from "./SearchScreen";

/**
* Tabs TODO Potentially clean this up
*
* The app is currently split up into three sections: home, profile, and notifications.
 */
export default () => (
    <Tab menu={{fixed: "bottom", widths: 4, size: "medium", inverted: true}} panes={
        [
            {
                menuItem:
                    (<Menu.Item key={0}>
                        <Icon name='home' size='large' />
                    </Menu.Item>),
                render: () =>
                    <Tab.Pane basic attached={false}>
                        <PostFeed/>
                    </Tab.Pane>
            },
            {
                menuItem: (
                    <Menu.Item key={1}>
                        <Icon name='user circle outline' size='large' />
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <ProfileTab/>
                </Tab.Pane>
            },
            /*{
                menuItem: (
                    <Menu.Item key={2}>
                        <Icon name='world' size='large' />
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <ProfileProp/>
                </Tab.Pane>
            },*/
            {
                menuItem: (
                    <Menu.Item key={2}>
                        <Icon name='calendar' size='large' />
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <Calendar />
                </Tab.Pane>
            },
            {
                menuItem: (
                    <Menu.Item key={3}>
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