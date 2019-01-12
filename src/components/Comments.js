import React, { Component, Fragment } from 'react';
import Comment from './Comment';
import {Segment} from 'semantic-ui-react'

type Props = {
    board: string
};

class Comments extends Component<Props> {
    render() {
        return (
            <Fragment>
                {
                    this.props.comments.map((comment, index) => {
                        return <Comment key={index} comment={comment} />
                    })
                }
            </Fragment>
        );
    }
}

export default Comments;