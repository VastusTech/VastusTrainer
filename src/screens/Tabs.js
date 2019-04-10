import { Fragment } from 'react';
import {Tab, Menu, Icon, Header, Feed } from "semantic-ui-react";
import NotificationFeed from "./notification_bell/NotificationBellFeed";
import ProfileTab from "./profile_tab/ProfileTab";
import React from "react";
import NotificationBellProp from "../vastuscomponents/components/info/NotificationBell";
import MainTab from "./main_tab/MainTab";
import Calendar from "./manager_tab/Calendar";
import OrganizationalScreen from "./manager_tab/OrganizationalScreen";
import ManagerTab from "./manager_tab/ManagerTab";
import MessageIcon from "../vastuscomponents/components/messaging/MessageIcon";
import MessageTab from "./messaging_tab/MessageTab";
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
                        <MainTab/>
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
                    <ManagerTab />
                </Tab.Pane>
            },
            {
                menuItem: (
                    <Menu.Item key={3}>
                        <MessageIcon />
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <Fragment>
                        <MessageTab/>
                    </Fragment>
                </Tab.Pane>
            },
        ]
    }/>
);