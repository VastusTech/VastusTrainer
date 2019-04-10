import React, { useState, useEffect } from 'react';
import './App.css';
import Tabs from './screens/Tabs.js';
import {Menu, Container, Message, Icon, Grid, Modal} from "semantic-ui-react";
import SearchBarProp from "./vastuscomponents/components/props/SearchBar";
import { connect } from "react-redux";
import {subscribeFetchUserAttributes} from "./redux_helpers/actions/userActions";
import NotificationBellProp from "./vastuscomponents/components/info/NotificationBell";
import Breakpoint from "react-socks";
import FilterModal from "./screens/filter/FilterModal";
import NotificationsModal from "./screens/notification_bell/NotificationsModal";

//This displays the search bar, log out button, and tab system inside of the grid.
// const { stickyRef } = this.state;
const getLoadingApp = (user, isLoading) => {
    if (isLoading) {
        return (
            <div>
                <Message icon>
                    <Icon name='spinner' size="small" loading />
                    <Message.Content>
                        <Message.Header>
                            Loading...
                        </Message.Header>
                    </Message.Content>
                </Message>
            </div>
        );
    }
    else {
        return (
            <Tabs user={user}/>
        );
    }
};

/**
 * Auth App
 *
 * This file contains the general outline of the app in a grid based format.
 */
const AuthApp = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [filterModalOpen, setFilterModalOpen] = useState(false);

    useEffect(() => {
        if (props.user.id) {
            props.subscribeFetchUserAttributes(["name", "username", "birthday", "profileImagePath",
                "profileImagePaths", "challengesWon", "friends", "scheduledEvents", "ownedEvents", "completedEvents",
                "challenges", "ownedChallenges", "completedChallenges", "groups", "ownedGroups", "receivedInvites",
                "invitedChallenges", "messageBoards", "streaks"], (data) => {
                setIsLoading(false);
            });
        }
        return () => {
            // TODO Clean up?
            alert("Cleaning up auth app");
        }
    }, [props.user.id]);

    return (
        <div>
            <div className="App">
                <Menu borderless inverted vertical fluid widths={1} fixed="top">
                    <Menu.Item>
                        <Container fluid>
                            <Breakpoint large up>
                                <Grid columns="equal" centered>
                                    <Grid.Row stretched>
                                        <Grid.Column>
                                            <Grid onClick={() => setFilterModalOpen(true)} style={{marginTop: "6px", marginLeft: "-40px"}} centered>
                                                <Icon name="filter" size="big"/>
                                            </Grid>
                                        </Grid.Column>
                                        <Grid.Column width={13}>
                                            <SearchBarProp />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Modal trigger={<NotificationBellProp/>} closeIcon>
                                                <NotificationsModal/>
                                            </Modal>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Breakpoint>
                            <Breakpoint medium>
                                <Grid columns="equal" centered>
                                    <Grid.Row stretched>
                                        <Grid.Column width={2}>
                                            <Grid onClick={() => setFilterModalOpen(true)} style={{marginTop: "6px", marginLeft: "-40px"}} centered>
                                                <Icon name="filter" size="big"/>
                                            </Grid>
                                        </Grid.Column>
                                        <Grid.Column width={12}>
                                            <SearchBarProp />
                                        </Grid.Column>
                                        <Grid.Column width={2}>
                                            <Modal trigger={<NotificationBellProp/>} closeIcon>
                                                <NotificationsModal/>
                                            </Modal>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Breakpoint>
                            <Breakpoint small down>
                                <Grid columns="equal" centered>
                                    <Grid.Row stretched>
                                        <Grid.Column style={{marginTop: "6px", marginLeft: "12px", marginRight: "-12px"}}>
                                            <Grid onClick={() => setFilterModalOpen(true)} style={{marginTop: "3px", marginLeft: "-60px"}} centered>
                                                <Icon name="filter" size="big"/>
                                            </Grid>
                                        </Grid.Column>
                                        <Grid.Column width={9}>
                                            <SearchBarProp />
                                        </Grid.Column>
                                        <Grid.Column style={{marginTop: "3px", marginLeft: "-6px"}}>
                                            <Modal trigger={<NotificationBellProp/>} closeIcon>
                                                <NotificationsModal/>
                                            </Modal>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Breakpoint>
                        </Container>
                    </Menu.Item>
                </Menu>
                <FilterModal open={filterModalOpen} onClose={() => setFilterModalOpen(false)}/>
                {getLoadingApp(props.user, isLoading)}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => {
    return {
        subscribeFetchUserAttributes: (variablesList, dataHandler) => {
            dispatch(subscribeFetchUserAttributes(variablesList, dataHandler));
        },
        // fetchUserAttributes: (variablesList, dataHandler) => {
        //     dispatch(fetchUserAttributes(variablesList, dataHandler));
        // }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthApp);

