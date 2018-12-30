import React, { Component, Fragment } from 'react';
import {Button, Input, Label, Icon} from "semantic-ui-react";
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
        let name = this.props.curUser + "_videoLink";

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
        return (
        	<Fragment>
            <form onSubmit={this.addComment} className='u-margin-top--2'>
                <Input type='text' action fluid className="textarea" name="comment" placeholder="Write Message...">
                    <input />
                    <Button as='label' for='proPicUpload'  >
                        <Icon name='camera' size = "Large"/>
                        <input type="file" accept="video/*;capture=camcorder" id="proPicUpload" hidden='true' onChange={this.setPicture}/>
                    </Button>
                    <Button primary>Send</Button>
                </Input> 
            </form>
            </Fragment>
        );
    }
}

export default VideoUpload;