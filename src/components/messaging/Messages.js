import React from "react";
import Message from './Message';
import { Container } from "semantic-ui-react";

export default (props: {comments: [any], userID: string}) => {
    return (
        <Container style={{width: '95%'}}>
            {
                props.comments.slice(0).reverse().map((message, index) => {
                    return <Message key={index} message={message} userID={props.userID}/>
                })
            }
        </Container>
    );
}