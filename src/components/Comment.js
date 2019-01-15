import React, { Component } from 'react';
import { Label, Grid, Icon, Container } from 'semantic-ui-react'
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import connect from "react-redux/es/connect/connect";
import {Player} from "video-react";
// import { Storage } from 'aws-amplify';

type Props = {
    comment: any
}

class Comment extends Component<Props> {
    state = {
        username: null,
        sentRequest: false,
    };

    createCorrectComment() {
        const from = this.props.comment.from;
        const name = this.props.comment.name;
        const message = this.props.comment.message;
        const type = this.props.comment.type;
        const ifSelf = from === this.props.user.id;
        if (type) {
            // Image or video message
            if (type === "picture") {
                if (ifSelf) {
                    // Self picture
                    return (
                        <Label className='ui right fluid' pointing='right' color='purple'>
                            <div className="u-avatar u-avatar--large u-margin-x--auto u-margin-top--neg4"
                                 style={{backgroundImage: `url(${message})`}}>
                                <Label as="label" htmlFor="proPicUpload" circular className="u-bg--primaryGradient">
                                    <Icon name="upload" className='u-margin-right--0' size="large" inverted/>
                                </Label>
                                <input type="file" accept="video/*;capture=camcorder" id="proPicUpload" hidden={true}
                                       onChange={this.setPicture}/>
                            </div>
                        </Label>
                    );
                }
                else {
                    // Other picture
                    return (
                        <Label className='ui left fluid' pointing='left'>
                            <div className="u-avatar u-avatar--large u-margin-x--auto u-margin-top--neg4"
                                 style={{backgroundImage: `url(${message})`}}>
                                <Label as="label" htmlFor="proPicUpload" circular className="u-bg--primaryGradient">
                                    <Icon name="upload" className='u-margin-right--0' size="large" inverted/>
                                </Label>
                                <input type="file" accept="video/*;capture=camcorder" id="proPicUpload" hidden={true}
                                       onChange={this.setPicture}/>
                            </div>
                        </Label>
                    );
                }
            }
            else if (type === "video") {
                if (ifSelf) {
                    // Self video
                    return (
                        <Label className='ui right fluid' pointing='right' color='purple'>
                            <Player>
                                <source src={message} type="video/mp4"/>
                            </Player>
                        </Label>
                    );
                }
                else {
                    // Other video
                    return (
                        <Label className='ui left fluid' pointing='left'>
                            <Player>
                                <source src={message} type="video/mp4"/>
                            </Player>
                        </Label>
                    );
                }
            }
            else {
                alert("Unrecognized message type = " + type);
            }
        }
        else {
            // Normal message
            if (ifSelf) {
                // Self text
                return (
                    <Grid.Column floated='right' width={10}>
                        <div>
                            <Label pointing='right' size='large' color='purple'>
                                {message}
                            </Label>
                            <strong>{name}</strong>
                        </div>
                    </Grid.Column>
                );
            }
            else {
                // Other text
                return (
                    <Grid.Column floated='left' width={10}>
                        <div>
                            <strong>{name}</strong>
                            <Label pointing='left' size='large'>
                                {message}
                            </Label>
                        </div>
                    </Grid.Column>
                );
            }
        }
    }

    render() {
        return (
            <Grid class="ui computer vertically reversed equal width grid">
                {this.createCorrectComment()}
            </Grid>

        );
    }
}


const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (attributesList) => {
            dispatch(fetchUserAttributes(attributesList));
        },
        forceFetchUserAttributes: (variablesList) => {
            dispatch(forceFetchUserAttributes(variablesList));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);