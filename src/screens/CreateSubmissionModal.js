import React, { Component, Fragment } from "react";
import { Modal, Message, Button, Card, Icon } from "semantic-ui-react";
import ClientCard from "../components/ClientCard";
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
class CreateSubmissionModal extends Component {
    state = {
        challengeID: null,
        isSubmitLoading: false,
        picturesLoading: false,
        videosLoading: false,
        pictures: [],
        videos: [],
        tempPictureURLs: [],
        tempVideoURLs: [],
    };

    constructor(props) {
        super(props);
        this.handleSubmitButton = this.handleSubmitButton.bind(this);
        this.setVideo = this.setVideo.bind(this);
        this.displayCurrentVideo = this.displayCurrentVideo.bind(this);
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
        PostFunctions.createSubmission(this.props.user.id, this.props.user.id, this.state.challengeID, "Submission", this.getPicturePaths(), this.getVideoPaths(), (returnValue) => {
            this.setState({picturesLoading: (this.state.pictures.length > 0), videosLoading: (this.state.videos.length > 0)});
            console.log(JSON.stringify(returnValue));
            const id = returnValue.data;
            let numPicturesLoaded = 0;
            let picturesLength = this.state.pictures.length;
            for (let i = 0; i < picturesLength; i++) {
                const picturePath = "/" + id + "/pictures/" + i;
                Storage.put(picturePath, this.state.pictures[i], { contentType: "video/*;image/*" }).then((result) => {
                    numPicturesLoaded++;
                    if (numPicturesLoaded >= picturesLength) {
                        this.state.picturesLoading = false;
                        if (!this.state.videosLoading) {
                            finishHandler();
                        }
                    }
                }).catch((error) => {
                    numPicturesLoaded++;
                    if (numPicturesLoaded >= picturesLength) {
                        this.state.picturesLoading = false;
                        if (!this.state.videosLoading) {
                            finishHandler();
                        }
                    }
                });
            }
            let numVideosLoaded = 0;
            let videosLength = this.state.videos.length;
            for (let i = 0; i < videosLength; i++) {
                Storage.put(id + "/videos/" + i, this.state.videos[i], { contentType: "video/*;image/*" }).then((result) => {
                    numVideosLoaded++;
                    if (numVideosLoaded >= videosLength) {
                        this.state.videosLoading = false;
                        if (!this.state.picturesLoading) {
                            finishHandler();
                        }
                    }
                }).catch((error) => {
                    numVideosLoaded++;
                    if (numVideosLoaded >= videosLength) {
                        this.state.videosLoading = false;
                        if (!this.state.picturesLoading) {
                            finishHandler();
                        }
                    }
                });
            }
            // Storage.put(id + "/")
        }, (error) => {
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
            this.setState({isSubmitLoading: false});
        });
    }

    displayCurrentVideo() {
        if (this.state.tempVideoURLs && this.state.tempVideoURLs.length > 0) {
            return(
                <Player>
                    <source src={this.state.tempVideoURLs[0]} type="video/mp4"/>
                </Player>
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
                    {this.displayCurrentVideo()}
                    <Fragment>
                        <div className="uploadImage u-flex u-flex-align--center u-margin-top--2">
                            <div>
                                <Button primary fluid as="label" htmlFor="proPicUpload" className="u-bg--primaryGradient">
                                    <Icon name="camera" className='u-margin-right--0' inverted />
                                    Upload Video
                                </Button>
                                <input type="file" accept="video/*;capture=camcorder" id="proPicUpload" hidden={true} onChange={this.setVideo}/>
                            </div>
                        </div>
                    </Fragment>
                </Modal.Content>
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
