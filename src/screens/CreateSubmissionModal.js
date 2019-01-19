import React, { Component } from "react";
import { Modal, Message, Button, Grid, Icon } from "semantic-ui-react";
import { Storage } from 'aws-amplify';
import { Player } from "video-react";
import { connect } from "react-redux";
import PostFunctions from "../databaseFunctions/PostFunctions";

type Props = {
    open: boolean,
    onClose: any,
    challengeID: string
};

/**
 * Takes in open, onClose, and challengeID
 */
class CreateSubmissionModal extends Component<Props> {
    state = {
        challengeID: null,
        isSubmitLoading: false,
        picturesLoading: false,
        videosLoading: false,
        pictures: [],
        videos: [],
        tempPictureURLs: [],
        tempVideoURLs: [],
        notifySubmission: false
    };

    constructor(props) {
        super(props);
        this.handleSubmitButton = this.handleSubmitButton.bind(this);
        this.setVideo = this.setVideo.bind(this);
        this.displayVideo = this.displayVideo.bind(this);
    }

    componentDidMount() {
        this.setState({challengeID: this.props.challengeID})
    }

    componentWillReceiveProps(newProps, nextContext) {
        if (this.props.challengeID !== newProps.challengeID) {
            this.setState({challengeID: newProps.challengeID});
        }
    }

    getChallengeAttribute(attribute) {
        if (this.state.challengeID) {
            const challenge = this.props.cache.events[this.state.challengeID];
            if (challenge) {
                return challenge[attribute];
            }
        }
        return null;
    }

    createSubmission(finishHandler) {
        const pictures = {};
        const videos = {};
        for (let i = 0; i < this.state.pictures.length; i++) {
            pictures["pictures/" + i] = this.state.pictures[i];
        }
        for (let i = 0; i < this.state.videos.length; i++) {
            videos["videos/" + i] = this.state.videos[i];
        }
        console.log(JSON.stringify(pictures) + " vids: " + JSON.stringify(videos));
        PostFunctions.createSubmission(this.props.user.id, this.props.user.id, this.state.challengeID, "Submission", pictures, videos, finishHandler, (error) => {
            console.error(error);
        });
    }

    getPicturePaths() {
        const picturePaths = [];
        console.log("Pictures: " + this.state.pictures.length);
        for (let i = 0; i < this.state.pictures.length; i++) {
            const path = "pictures/" + i;
            picturePaths.push(path);
            console.log("Added: " + path);
        }
        if (picturePaths.length > 0) {
            return picturePaths;
        }
        return null;
    }

    getVideoPaths() {
        const videoPaths = [];
        console.log("Videos: " + this.state.videos.length);
        for (let i = 0; i < this.state.videos.length; i++) {
            const path = "videos/" + i;
            videoPaths.push(path);
            console.log("Added: " + path);
        }
        if (videoPaths.length > 0) {
            return videoPaths;
        }
        return null;
    }

    setVideo(event) {
        const index = this.state.videos.length;
        this.state.videos.push(event.target.files[0]);
        const path = "/" + this.props.user.id + "/temp/videos/" + index;
        Storage.put(path, event.target.files[0], { contentType: "video/*;image/*" })
            .then(() => {
                Storage.get(path).then((url) => {
                    this.state.tempVideoURLs.push(url);
                    this.setState({});
                }).catch((error) => {
                    console.error(error);
                })
            }).catch((error) => {
            console.error(error);
        });
        this.setState({});
    }

    handleSubmitButton() {
        this.setState({isSubmitLoading: true});
        this.createSubmission(() => {
            this.setState({isSubmitLoading: false, notifySubmission: true});
        });
    }

    displaySubmission() {
        if(this.state.notifySubmission) {
            return (
                <Message positive>
                    <Message.Header>Success!</Message.Header>
                    <p>
                        You submitted a video to the challenge!
                    </p>
                </Message>
            );
        }
    }

    displayVideo() {
        if (this.state.tempVideoURLs && this.state.tempVideoURLs.length > 0) {
            return(
                <div>
                    <Player>
                        <source src={this.state.tempVideoURLs[0]} type="video/mp4"/>
                    </Player>
                </div>
            );
        }
        return null;
    }


    // This should show a modal that
    render() {

        if (this.props.info.isLoading) {
            return (
                <Modal dimmer='blurring' open={this.props.open} onClose={this.props.onClose.bind(this)}>
                    <Message>Loading...</Message>
                </Modal>
            );
        }
        return(
            <Modal centered open={this.props.open} onClose={this.props.onClose.bind(this)} closeIcon>
                <Modal.Header className="u-bg--bg">Create A Submission</Modal.Header>
                <Modal.Content className="u-bg--bg">
                    {this.displayVideo()}
                    <Grid centered>
                        <div className="uploadImage u-flex u-flex-align--center u-margin-top--2">
                            <div>
                                <Button primary fluid as="label" htmlFor="proPicUpload" className="u-bg--primaryGradient">
                                    <Icon name="camera" className='u-margin-right--0' inverted />
                                    Upload Video
                                </Button>
                                <input type="file" accept="video/*;capture=camcorder" id="proPicUpload" hidden={true} onChange={this.setVideo}/>
                            </div>
                        </div>
                    </Grid>
                </Modal.Content>
                <div>{this.displaySubmission()}</div>
                <Button primary fluid loading={this.state.isSubmitLoading} disabled={this.state.isSubmitLoading} onClick={this.handleSubmitButton}>Submit</Button>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info,
    cache: state.cache
});

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateSubmissionModal);
