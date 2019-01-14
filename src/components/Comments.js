import React, { Component, Fragment } from 'react';
import Comment from './Comment';
import ScrollView from 'react-inverted-scrollview';

type Props = {
    board: string
};

class Comments extends Component<Props> {
    render() {
        return (
            <div>
            {
                this.props.comments.slice(0).reverse().map((comment, index) => {
                    return <Comment key={index} comment={comment} />
                })
            }
            </div>
        );
    }
}

export default Comments;