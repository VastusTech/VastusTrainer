import React from "react";
import Message from './Message';

export default (props: {comments: [any], userID: string}) => {
    return (
        <div style={{width: '300px'}}>
            {
                props.comments.slice(0).reverse().map((message, index) => {
                    return <Message key={index} message={message} userID={props.userID}/>
                })
            }
        </div>
    );
}
