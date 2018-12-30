import React, { Component, Fragment } from 'react';
import {Button, Input, Grid, Label, Icon} from "semantic-ui-react";
import { Storage } from 'aws-amplify';
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import connect from "react-redux/es/connect/connect";
import Lambda from "../Lambda";
import defaultProfilePicture from "../img/roundProfile.png";

type Props = {

}

class VideoUpload extends Component<Props> {
    state = {
        imagePath: '',
        imageURL: '',
        sentRequest: false,
        canAddImage: true
    };

    constructor(props) {
        super(props);
        this.addComment = this.addComment.bind(this);
        this.addPicOrVid = this.addPicOrVid.bind(this);
        this.setPicture = this.setPicture.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.user && this.props.user && newProps.user.id !== this.props.user.id) {
            this.resetState();
        }
        //console.error("Comment User: " + JSON.stringify(this.props));
    }

    addComment(e) {
        // Prevent the default behaviour of form submit
        e.preventDefault();

        // Get the value of the comment box
        // and make sure it not some empty strings
        let comment = e.target.elements.comment.value.trim();
        //let name = this.props.user.username;
        let name = this.props.curUser;

        //console.error(name);

        // Make sure name and comment boxes are filled
        if (comment) {
            //console.error(name);
            const commentObject = { name, comment };

            this.props.handleAddComment(commentObject);

            // Publish comment
            /*global Ably*/
            //console.error(this.props.challengeChannel);
            const channel = Ably.channels.get(this.props.challengeChannel);
            channel.publish('add_comment', commentObject, err => {
                if (err) {
                    console.log('Unable to publish message; err = ' + err.message);
                }
            });

            // Clear input fields
            e.target.elements.comment.value = '';
        }
    }

    addPicOrVid(path) {
        // Get the value of the comment box
        // and make sure it not some empty strings
        let comment = path;
        //let name = this.props.user.username;
        let name = this.props.curUser;

        //console.error(name);
        //console.error(name);
        const commentObject = { name, comment };

        this.props.handleAddComment(commentObject);

        // Publish comment
        /*global Ably*/
        //console.error(this.props.challengeChannel);
        const channel = Ably.channels.get(this.props.challengeChannel);
        channel.publish('add_comment', commentObject, err => {
            //console.error("Added Comment: " + commentObject.comment);
            if (err) {
                console.log('Unable to publish message; err = ' + err.message);
            }
        });
    }

    setPicture(event) {
        //console.error(JSON.stringify(this.props));
        //console.error(this.props.curUserID);
        if (this.props.curUserID) {
            const path = "/ClientFiles/" + this.props.curUserID + "/" + Math.floor((Math.random() * 10000000000000) + 1);

            Storage.put(path, event.target.files[0], { contentType: "video/*;image/*" }).then((result) => {
                this.setState({imagePath: path});
                this.setState({isLoading: true});
                this.addPicOrVid(path);
            }).catch((error) => {
                console.error("failed storage put");
                console.error(error);
            });

            //console.error("Calling storage put");
            //console.error("File = " + JSON.stringify(event.target.files[0]));
        }
    }



    render() {
        // if(this.state.imageURL && this.state.canAddImage) {
        //     console.error("Image URL found: " + this.state.imageURL);
        //     this.addPicOrVid(this.state.path);
        //     this.setState({canAddImage: false});
        // }
        /*
        return (
            <Fragment>
                <div className="uploadImage u-flex u-flex-align--center u-margin-top--2">
                    <div>
                        <Button fluid primary><Icon name='camera'/>Upload Video
                            <input type="file" accept="video/*;capture=camcorder" id="proPicUpload" hidden={true} onChange={this.setPicture}/>
                        </Button>
                    </div>
                </div>
            </Fragment>
        );
        */
        return (
            <Fragment>
                <div className="uploadImage u-flex u-flex-align--center u-margin-top--2">
                    <div>
                        <Button primary fluid as="label" htmlFor="proPicUpload" className="u-bg--primaryGradient">
                            <Icon name="camera" className='u-margin-right--0' inverted />
                             Upload Video
                        </Button>
                        <input type="file" accept="video/*;capture=camcorder" id="proPicUpload" hidden={true} onChange={this.setPicture}/>
                    </div>
                </div>
            </Fragment>
        );

    }
}

export default VideoUpload;