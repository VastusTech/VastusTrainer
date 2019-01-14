import React, { Component, Fragment } from 'react';
import Comment from './Comment';
import ScrollView from 'react-inverted-scrollview';

type Props = {
    board: string
};

class Comments extends Component<Props> {
    scrollToBottom() {
        if (!this.scrollView) return;
        this.scrollView.scrollToBottom();
    }

    scrollToTop() {
        if (!this.scrollView) return;
        this.scrollView.scrollToTop();
    }

    handleScroll = ({ scrollTop, scrollBottom }) => {
        console.log('scrollTop', scrollTop);
        console.log('scrollBottom', scrollBottom);
    };

    render() {
        return (
            <ScrollView
                class='chat'
                width={800}
                height={400}
                ref={ref => (this.scrollView = ref)}
                onScroll={this.handleScroll}
            >
                {
                    this.props.comments.slice(0).reverse().map((comment, index) => {
                        return <Comment key={index} comment={comment} />
                    })
                }
            </ScrollView>
        );
    }
}

export default Comments;