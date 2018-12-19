import React, { Component, Fragment } from 'react';
import Comment from './Comment';
import {Segment} from 'semantic-ui-react'

class Comments extends Component {
    render() {
        return (
            //<Segment style={{overflow: 'auto', maxHeight: 200 }}>
            <Fragment>
                    {
                        this.props.comments.map((comment, index) => {
                            //console.log(index + ":" + JSON.stringify(comment));
                            return <Comment key={index} comment={comment} />
                        })
                    }
            </Fragment>
            //</Segment>
        );
    }
}

export default Comments;