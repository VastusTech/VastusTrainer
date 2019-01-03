import React, {Component, Fragment} from 'react'
import _ from 'lodash';
import {Grid, Button, Message, Image, Modal, Card, Icon, Form, Container, TextArea, Checkbox, Header} from 'semantic-ui-react';
import { Storage } from 'aws-amplify';
import {connect} from "react-redux";
import {setError} from "../redux_helpers/actions/infoActions";
import {
    fetchPost,
    clearChallengeQuery,
    fetchChallenge,
    putChallenge,
    putChallengeQuery,
    clearPostQuery,
    putPost,
    putPostQuery
} from "../redux_helpers/actions/cacheActions";
import PostFunctions from "../databaseFunctions/PostFunctions";
import {Player} from "video-react";

// Take from StackOverflow, nice snippit!
// https://stackoverflow.com/a/17415677
Date.prototype.toIsoString = function() {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
};

function arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele !== value;
    });

}

/*type Props = {
    queryChallenges: any
}*/

/*
* Create Event Prop
*
* This is the modal for creating events. Every input is in the form of a normal text input.
* Inputting the time and date utilizes the Semantic-ui Calendar React library which isn't vanilla Semantic.
 */
class CreatePostProp extends Component {
    state = {
        checked: false,
        checkedRest: false,
        isSubmitLoading: false,
        showModal: false,
        submitError: "",
        showSuccessModal: false,
        showSuccessLabel: false,
        showSuccessLabelTimer: 0,
        description: "",
        title: "",
        access: "public",
        picturesLoading: false,
        videosLoading: false,
        pictures: [],
        videos: [],
        tempPictureURLs: [],
        tempVideoURLs: [],

    };

    toggle = () => this.setState({ checked: !this.state.checked });
    toggleRest = () => this.setState({ checkedRest: !this.state.checkedRest });

    changeStateText(key, value) {
        // TODO Sanitize this input
        // TODO Check to see if this will, in fact, work.!
        this.state[key] = value.target.value;
        console.log("New " + key + " is equal to " + value.target.value);
    }

    handleAccessSwitch = () => {
        if(this.state.access === 'public') {
            this.setState({access: 'private'});
        }
        else if (this.state.access === 'private') {
            this.setState({access: 'public'});
        }
        else {
            console.error("Event access should be public or private");
        }
    };

    getPictures() {
        const pictures = {};
        for (let i = 0; i < this.state.pictures.length; i++) {
            pictures["pictures/" + i] = this.state.pictures[i];
        }
        if (this.state.pictures.length > 0) {
            return pictures;
        }
        return null;
    }

    getVideos() {
        const videos = {};
        for (let i = 0; i < this.state.videos.length; i++) {
            videos["videos/" + i] = this.state.videos[i];
        }
        if (this.state.videos.length > 0) {
            return videos;
        }
        return null;
    }

    setVideo = (event) => {
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
    };

    setPicture = (event) => {
        const index = this.state.pictures.length;
        this.state.pictures.push(event.target.files[0]);
        const path = "/" + this.props.user.id + "/temp/pictures/" + index;
        Storage.put(path, event.target.files[0], { contentType: "video/*;image/*" })
            .then(() => {
                Storage.get(path).then((url) => {
                    this.state.tempPictureURLs.push(url);
                    this.setState({});
                }).catch((error) => {
                    console.error(error);
                })
            }).catch((error) => {
            console.error(error);
        });
        this.setState({});
    };

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

    displayCurrentVideo() {
        if (this.state.tempVideoURLs && this.state.tempVideoURLs.length > 0) {
            //alert("Running cur video");
            return(
                <Player>
                    <source src={this.state.tempVideoURLs[0]} type="video/mp4"/>
                </Player>
            );
        }
        return null;
    }

    displayCurrentImage() {
        if (this.state.tempPictureURLs && this.state.tempPictureURLs.length > 0) {
            //alert("Running cur image");
            return(
                <Image src={this.state.tempPictureURLs[0]} />
            );
        }
        return null;
    }

    handleSubmit = () => {

        this.setState({isSubmitLoading: true});

        // TODO Check to see if valid inputs!
        if (this.state.description) {
            PostFunctions.createNormalPost(this.props.user.id, this.props.user.id, this.state.description, this.state.access, this.getPictures(), this.getVideos(), (returnValue) => {
                alert("Successfully Created Post!");
                alert(JSON.stringify(returnValue));
            }, (error) => {
                console.error(error);
            });
            //     PostFunctions.createNormalPost(this.props.user.id, this.props.user.id, this.state.description, this.state.access, this.getPicturePaths(), this.getVideoPaths(), (returnValue) => {
            //         alert("Successfully Created Post!");
            //         alert(JSON.stringify(returnValue));
            //         const id = returnValue.data;
            //         let numPicturesLoaded = 0;
            //         let picturesLength = this.state.pictures.length;
            //         for (let i = 0; i < picturesLength; i++) {
            //             const picturePath = id + "/pictures/" + i;
            //             Storage.put(picturePath, this.state.pictures[i], { contentType: "video/*;image/*" }).then((result) => {
            //                 numPicturesLoaded++;
            //                 alert(result);
            //                 if (numPicturesLoaded >= picturesLength) {
            //                     this.setState({videosLoading: false});
            //                 }
            //             }).catch((error) => {
            //                 numPicturesLoaded++;
            //                 alert(error);
            //                 if (numPicturesLoaded >= picturesLength) {
            //                     this.setState({videosLoading: false});
            //                 }
            //             });
            //         }
            //         let numVideosLoaded = 0;
            //         let videosLength = this.state.videos.length;
            //         for (let i = 0; i < videosLength; i++) {
            //             Storage.put(id + "/videos/" + i, this.state.videos[i], { contentType: "video/*;image/*" }).then((result) => {
            //                 numVideosLoaded++;
            //                 alert(result);
            //                 if (numVideosLoaded >= videosLength) {
            //                     this.setState({videosLoading: false});
            //                 }
            //             }).catch((error) => {
            //                 numVideosLoaded++;
            //                 alert(error);
            //                 if (numVideosLoaded >= videosLength) {
            //                     this.setState({videosLoading: false});
            //                 }
            //             });
            //         }
            //         // Storage.put(id + "/")
            //         this.setState({isSubmitLoading: false});
            //         this.setState({showSuccessLabel: true});
            //         this.setState({showModal: false});
            //     }, (error) => {
            //         console.error(error);
            //         this.setState({submitError: "*" + JSON.stringify(error)});
            //         this.setState({isSubmitLoading: false});
            //     });
            // }
            // else {
            //     this.setState({isSubmitLoading: false, submitError: "All fields need to be filled out!"});
            // }
        }
    };

    closeModal = () => {
        this.setState({ showModal: false })
    };

    createSuccessLabel() {
        if(this.state.showSuccessLabel && this.state.showModal) {
            this.setState({showSuccessLabel: false});
        }
        else if(this.state.showSuccessLabel) {
            return (<Message positive>
                <Message.Header>Success!</Message.Header>
                <p>
                    You just created a new post!
                </p>
            </Message>);
        }
        else {
            return null;
        }
    }

    closeSuccessModal = () => {
        this.setState({showSuccessModal: false});
    };

    displayError() {
        if(this.state.submitError !== "") {
            return (<Message negative>
                <Message.Header>Sorry!</Message.Header>
                <p>{this.state.submitError}</p>
            </Message>);
        }
    }

    render() {

        return (
            <div align='center'>
                <Header align='center'>Write New Post</Header>
                <div align='center'>
                    <Container align='center'>
                        <Grid centered>
                        <Grid.Row>
                            <Grid.Column width={12} className="segment centered" align='center'>
                                <Form align='center' onSubmit={this.handleSubmit}>
                                    <TextArea fluid label="Description" type="text" name="description" placeholder="Write post description here..." onChange={value => this.changeStateText("description", value)}/>
                                    {/*<Form.Field>
                                        <div className="field" width={5}>
                                            <label>Difficulty</label>
                                            <Rating icon='star' defaultRating={1} maxRating={3} />
                                        </div>
                                    </Form.Field>*/}
                                    <Form.Field width={12}>
                                        <Checkbox toggle onClick={this.handleAccessSwitch} onChange={this.toggle} checked={this.state.checked} label={this.state.access} />
                                    </Form.Field>
                                    <div>{this.displayError()}{this.createSuccessLabel()}</div>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                        </Grid>
                    </Container>
                    <Card align='center'>
                        <Card.Header align='center' className="u-bg--bg">Add photo or video to post</Card.Header>
                        <div align='center' className="u-bg--bg">
                            {this.displayCurrentVideo()}
                            {this.displayCurrentImage()}
                            <Fragment align='center'>
                                <div className="uploadImage u-flex u-flex-align--center u-margin-top--2" align='center'>
                                    <div floated="center">
                                        <Button primary fluid as="label" htmlFor="vidUpload" className="u-bg--primaryGradient">
                                            <Icon name="camera" className='u-margin-right--0' inverted />
                                            Upload Video
                                        </Button>
                                        <input type="file" accept="video/*;capture=camcorder" id="vidUpload" hidden={true} onChange={this.setVideo}/>
                                    </div>
                                </div>
                                <div className="uploadImage u-flex u-flex-align--center u-margin-top--2" align='center'>
                                    <div floated="center">
                                        <Button primary fluid as="label" htmlFor="picUpload" className="u-bg--primaryGradient">
                                            <Icon name="camera" className='u-margin-right--0' inverted />
                                            Upload Photo
                                        </Button>
                                        <input type="file" accept="image/*;capture=camcorder" id="picUpload" hidden={true} onChange={this.setPicture}/>
                                    </div>
                                </div>
                            </Fragment>
                        </div>
                        <div>{this.displaySubmission()}</div>
                    </Card>
                </div>
                <Button loading={this.state.isSubmitLoading} disabled={this.state.isSubmitLoading} primary size="big" type='button' onClick={() => { this.handleSubmit()}}>Submit</Button>
                {this.createSuccessLabel()}
            </div>
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
        setError: (error) => {
            dispatch(setError(error));
        },
        fetchPost: (id, variablesList) => {
            dispatch(fetchPost(id, variablesList));
        },
        putPost: (event) => {
            dispatch(putPost(event));
        },
        putPostQuery: (queryString, queryResult) => {
            dispatch(putPostQuery(queryString, queryResult));
        },
        clearPostQuery: () => {
            dispatch(clearPostQuery());
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePostProp);
