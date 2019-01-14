import React, { Component, Fragment } from 'react';
import {Button, Input, Label, Icon} from "semantic-ui-react";
import { Storage } from 'aws-amplify';
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import connect from "react-redux/es/connect/connect";
import Lambda from "../Lambda";
import defaultProfilePicture from "../img/roundProfile.png";
import MessageFunctions from "../databaseFunctions/MessageFunctions";
import {addMessageToBoard} from "../redux_helpers/actions/messageActions";

type Props = {
    board: string
}

class CommentBox extends Component<Props> {
    state = {
        board: null,
        imagePath: '',
        imageURL: '',
        sentRequest: false,
        canAddImage: true,
        sendLoading: false
    };

    constructor(props) {
        super(props);
        this.addComment = this.addComment.bind(this);
        this.addPicture = this.addPicture.bind(this);
        this.addVideo = this.addVideo.bind(this);
        this.setPictureOrVideo = this.setPictureOrVideo.bind(this);
        // this.addPicOrVid = this.addPicOrVid.bind(this);
        // this.setPicture = this.setPicture.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.board !== this.state.board) {
            this.state.board = newProps.board;
        }
        // if (newProps.user && this.props.user && newProps.user.id !== this.props.user.id) {
        //     this.resetState();
        // }
        //console.error("Comment User: " + JSON.stringify(this.props));
    }

    addComment(e) {
        // Prevent the default behaviour of form submit
        e.preventDefault();

        // Get the value of the comment box
        // and make sure it not some empty strings
        let comment = e.target.elements.comment.value.trim();

        // Make sure name and comment boxes are filled
        if (comment) {
            this.setState({sendLoading: true});
            MessageFunctions.createTextMessage(this.props.user.id, this.props.user.id, this.props.user.name, this.state.board, comment, () => {
                console.log("Successfully sent message!");
                this.setState({sendLoading: false});
            }, (error) => {
                console.error("Failed to send message! Error = " + JSON.stringify(error));
                this.setState({sendLoading: false});
            });

            // Clear input fields
            e.target.elements.comment.value = '';
        }
    }

    addPicture(picture) {
        this.setState({sendLoading: true});
        MessageFunctions.createPictureMessage(this.props.user.id, this.props.user.id, this.props.user.name, this.state.board,
            picture, "picture", () => {
                this.setState({sendLoading: false});
                console.log("Successfully created picture message!");
            }, (error) => {
                this.setState({sendLoading: false});
                console.error("FAILED ADDING PICTURE. ERROR = " + JSON.stringify(error));
            })
    }

    addVideo(video) {
        this.setState({sendLoading: true});
        MessageFunctions.createVideoMessage(this.props.user.id, this.props.user.id, this.props.user.name, this.state.board,
            video, "video", () => {
                this.setState({sendLoading: false});
                console.log("Successfully created video message!");
            }, (error) => {
                this.setState({sendLoading: false});
                console.error("FAILED ADDING VIDEO. ERROR = " + JSON.stringify(error));
            })
    }

    setPictureOrVideo(event) {
        const file = event.target.files[0];
        const fileType = file["type"];
        const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
        const validVideoTypes = ["video/mp4", "video/mv4", "video/avi", "video/mpg"];
        if (validImageTypes.includes(fileType)) {
            this.addPicture(file);
        }
        else if (validVideoTypes.includes(fileType)) {
            this.addVideo(file);
        }
        else {
            alert("PROBLEMATIC FILE TYPE = " + fileType);
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
                            <input type="file" accept="video/*;capture=camcorder" id="proPicUpload" hidden='true' onChange={this.setPictureOrVideo}/>
                        </Button>
                        <Button loading={this.state.sendLoading} primary>Send</Button>
                    </Input>
                </form>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    message: state.message
});

const mapDispatchToProps = (dispatch) => {
    return {
        addMessageToBoard: (board, message) => {
            dispatch(addMessageToBoard(board, message));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentBox);