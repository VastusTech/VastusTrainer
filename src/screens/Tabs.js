import { Fragment } from 'react';
import {Tab, Menu, Icon, Header, Feed } from "semantic-ui-react";
import EventFeed from "./EventFeed";
import NotificationFeed from "./NotificationBellFeed";
import ProfileProp from "./Profile";
import React from "react";
import CreateEventProp from "./CreateEvent";
import NextWorkoutProp from "../components/NextWorkout";
// import ScheduledEventsList from "./ScheduledEventList";
// import LeaderBoard from "./Leaderboard";
import CalendarScreen from "./CalendarScreen";
import CommentScreen from "./CommentScreen";

/*
So the trainer app will have a bunch of different aspects to it, as described by Billy
    * Must be able to give the trainer more exposure (Posting content)
    * Must be able to let the trainer develop their brand (Portal)
    * Providing useful information regarding diets/helpful workouts/...
    * Building rapport with users
        * By creating challenges (Challenge Manager)
        * By conversating with them (Forums and/or direct chat?)
        *
    * Facilitator of knowledge through group chat style forums (Content + Forums)
    * Giving out free info and guidance is the biggest barrier for trainers atm
    * Trainers will have public portal and private portal for $X a month.
        * I'm not a fan of the pay wall, but this could be do-able
        * Do the trainers decide their own monthly prices? (Marketplace-style)
        * The services that will be for pay:
            * Private group/individual chats
            * Premium Challenges
            * Workout Templates!
            * Personal Workout Plans
            * Personal Diets
            * Day-in-the-life
            * Videos
            * Personal Training(?) Maybe this could be discounted for premium members!

    BASED ON THESE USE CASES, here's how I think we should structure our app should be in these Tabs

    - NEWS
    - PROFILE/PORTAL
    - CALENDAR VIEW
    - FORUMS/GROUP CHATS/CHATS
    - NOTIFICATIONS

 */

/**
* Tabs TODO Potentially clean this up
*
* The app is currently split up into three sections: home, profile, and notifications.
 */
export default () => (
    <Tab menu={{fixed: "bottom", widths: 5, size: "small", inverted: true}} panes={
        [
            {   /* THIS WILL LEAD TO ALL THE EVENTS (But this should be substantially less prevalent) */
                menuItem:
                    (<Menu.Item key={0}>
                        <Icon name='home' size='large' />
                    </Menu.Item>),
                render: () =>
                    <Tab.Pane basic attached={false}>
                        {/*<CreateEventProp/>*/}
                        {/*<NextWorkoutProp/>*/}
                        {/*<EventFeed/>*/}
                    </Tab.Pane>
            },
            {   /* THIS IS THE TRAINER PROFILE and PORTAL */
                menuItem: (
                    <Menu.Item key={1}>
                        <Icon name='user circle outline' size='large' />
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    {/*<ProfileProp/>*/}
                </Tab.Pane>
            },
            {   /* VIEW THE CALENDAR / TIME-INTENSIVE STUFFS? */
                menuItem: (
                    <Menu.Item key={2}>
                        <Icon name='calendar' size='large' />
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <CalendarScreen />
                </Tab.Pane>
            },
            {   /* HERE WILL BE THE FORUM FOR DISCUSSION (Reddit AMA style?) */
                menuItem: (
                    <Menu.Item key={2}>
                        <Icon name='comment' size='large' />
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    {/*<CommentScreen/>*/}
                </Tab.Pane>
            },
            {   /* NOTIFICATIONS (necessary, duh) */
                menuItem: (
                    <Menu.Item key={3}>
                        <Icon name='bell outline' size='large' />
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <Fragment>
                        {/*<Header inverted textAlign={'center'}>Notification Feed</Header>*/}
                        {/*<NotificationFeed/>*/}
                    </Fragment>
                </Tab.Pane>
            },
        ]
    }/>
);