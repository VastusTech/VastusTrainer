import React, { Component, Fragment } from 'react';
import Comment from './Comment';
import {Segment} from 'semantic-ui-react'

type Props = {
    board: string
};

class Comments extends Component<Props> {
    render() {
        return (
            <Fragment style={{overflow: 'auto', maxHeight: '50px'}}>
                {
                    this.props.comments.slice(0).reverse().map((comment, index) => {
                        return <Comment key={index} comment={comment} />
                    })
                }
            </Fragment>
        );
    }
}

export default Comments;