import React from 'react';
import NotificationsFeed from "./NotificationBellFeed";
import {Modal} from "semantic-ui-react";

const NotificationsModal = () => {
    return (
        <div>
            <Modal.Header as="h1" align='center'>Notifications</Modal.Header>
            <NotificationsFeed/>
        </div>
    );
};

export default NotificationsModal;