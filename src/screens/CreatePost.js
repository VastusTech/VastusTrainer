// import React, { Component } from 'react'
// // import _ from 'lodash';
// import {Grid, Button, Message, Image, Modal, Label, Icon, Form, Container, TextArea, Checkbox, Rating} from 'semantic-ui-react';
// // import CreateEventProp from "./CreateEvent";
// // import VTLogo from "../img/vt_new.svg"
// import {connect} from "react-redux";
// // import Lambda from "../Lambda";
// import {setError} from "../redux_helpers/actions/infoActions";
// import {clearChallengeQuery, fetchChallenge, putChallenge, putChallengeQuery} from "../redux_helpers/actions/cacheActions";
// import ChallengeFunctions from "../databaseFunctions/ChallengeFunctions";
// import PostFunctions from "../databaseFunctions/PostFunctions";
//
// // Take from StackOverflow, nice snippit!
// // https://stackoverflow.com/a/17415677
// Date.prototype.toIsoString = function() {
//     var tzo = -this.getTimezoneOffset(),
//         dif = tzo >= 0 ? '+' : '-',
//         pad = function(num) {
//             var norm = Math.floor(Math.abs(num));
//             return (norm < 10 ? '0' : '') + norm;
//         };
//     return this.getFullYear() +
//         '-' + pad(this.getMonth() + 1) +
//         '-' + pad(this.getDate()) +
//         'T' + pad(this.getHours()) +
//         ':' + pad(this.getMinutes()) +
//         ':' + pad(this.getSeconds()) +
//         dif + pad(tzo / 60) +
//         ':' + pad(tzo % 60);
// };
//
// function arrayRemove(arr, value) {
//     return arr.filter(function(ele){
//         return ele !== value;
//     });
// }
//
// /*type Props = {
//     queryChallenges: any
// }*/
//
// /*
// * Create Post Prop
// *
// * This is the modal for creating events. Every input is in the form of a normal text input.
// * Inputting the time and date utilizes the Semantic-ui Calendar React library which isn't vanilla Semantic.
//  */
// class CreatePostProp extends Component {
//     state = {
//         checked: false,
//         checkedRest: false,
//         isSubmitLoading: false,
//         showModal: false,
//         submitError: "",
//         showSuccessModal: false,
//         showSuccessLabel: false,
//         showSuccessLabelTimer: 0,
//         challengeType: "",
//         // tags: [],
//         // performancePressed: false,
//         // endurancePressed: false,
//         // hiitPressed: false,
//         // strengthPressed: false,
//         restriction: null
//     };
//
//     toggle = () => this.setState({ checked: !this.state.checked });
//     toggleRest = () => this.setState({ checkedRest: !this.state.checkedRest });
//
//     eventState = {
//         title: "",
//         eventDate: null,
//         startTime: CreatePostProp.getNowTimeString(),
//         duration: '60',
//         location: "",
//         time: "",
//         time_created: "",
//         capacity: "",
//         goal: "",
//         prize: "",
//         description: "",
//         access: "public"
//     };
//
//     changeStateText(key, value) {
//         // TODO Sanitize this input
//         // TODO Check to see if this will, in fact, work.!
//         this.eventState[key] = value.target.value;
//         console.log("New " + key + " is equal to " + value.target.value);
//     }
//
//     handleAccessSwitch = () => {
//         if(this.eventState.access === 'public') {
//             this.eventState.access = 'private';
//         }
//         else if (this.eventState.access === 'private') {
//             this.eventState.access = 'public';
//         }
//         else {
//             console.error("Event access should be public or private");
//         }
//     };
//
//     handleRestrictionSwitch = () => {
//         if(this.state.restriction === 'invite') {
//             this.setState({restriction: null});
//         }
//         else {
//             this.setState({restriction: 'invite'});
//         }
//     };
//
//     showRestriction() {
//         if(!this.state.restriction) {
//             return 'unrestricted';
//         }
//         else {
//             return this.state.restriction;
//         }
//     }
//
//     handleTag(tag) {
//         if(tag === "HIIT" && !this.state.hiitPressed) {
//             this.setState({tags: this.state.tags.concat(tag)},
//                 () => console.log(JSON.stringify(this.state.tags)));
//             this.setState({hiitPressed: true});
//         }
//         else if(tag === "Performance" && !this.state.performancePressed) {
//             this.setState({tags: this.state.tags.concat(tag)},
//                 () => console.log(JSON.stringify(this.state.tags)));
//             this.setState({performancePressed: true});
//         }
//         else if(tag === "Endurance" && !this.state.endurancePressed) {
//             this.setState({tags: this.state.tags.concat(tag)},
//                 () => console.log(JSON.stringify(this.state.tags)));
//             this.setState({endurancePressed: true});
//         }
//         else if(tag === "Strength" && !this.state.strengthPressed) {
//             this.setState({tags: this.state.tags.concat(tag)},
//                 () => console.log(JSON.stringify(this.state.tags)));
//             this.setState({strengthPressed: true});
//         }
//         else if(tag === "HIIT" && this.state.hiitPressed) {
//             this.setState({tags: arrayRemove(this.state.tags, tag)},
//                 () => console.log(JSON.stringify(this.state.tags)));
//             this.setState({hiitPressed: false});
//         }
//         else if(tag === "Performance" && this.state.performancePressed) {
//             this.setState({tags: arrayRemove(this.state.tags, tag)},
//                 () => console.log(JSON.stringify(this.state.tags)));
//             this.setState({performancePressed: false});
//         }
//         else if(tag === "Endurance" && this.state.endurancePressed) {
//             this.setState({tags: arrayRemove(this.state.tags, tag)},
//                 () => console.log(JSON.stringify(this.state.tags)));
//             this.setState({endurancePressed: false});
//         }
//         else if(tag === "Strength" && this.state.strengthPressed) {
//             this.setState({tags: arrayRemove(this.state.tags, tag)},
//                 () => console.log(JSON.stringify(this.state.tags)));
//             this.setState({strengthPressed: false});
//         }
//     }
//
//     handleSubmit = () => {
//         // TODO Make sure the dates are well formed?
//         /*
//         const year = parseInt(this.eventState.eventDate.substr(0, 4));
//         const month = parseInt(this.eventState.eventDate.substr(5, 2)) - 1;
//         const day = parseInt(this.eventState.eventDate.substr(8, 2));
//         const hour = parseInt(this.eventState.startTime.substr(0, 2));
//         const minute = parseInt(this.eventState.startTime.substr(3, 2));
//         let startDate = new Date(year, month, day, hour, minute);
//         let endDate = new Date(startDate.getTime() + (60000 * this.eventState.duration));
//         // console.log(endDate.toDateString());
//         // console.log(endDate.getMinutes());
//         // endDate.setMinutes(endDate.getMinutes() + this.eventState.duration);
//         // console.log(endDate.getMinutes());
//         // console.log(endDate.toDateString());
//
//
//
//         const time = startDate.toIsoString() + "_" + endDate.toIsoString();
//         */
//         this.setState({isSubmitLoading: true});
//
//         // TODO Check to see if valid inputs!
//         if (this.eventState.capacity && this.eventState.title && this.eventState.goal) {
//             if (Number.isInteger(+this.eventState.capacity)) {
//                 ChallengeFunctions.createChallengeOptional(this.props.user.id, this.props.user.id, this.eventState.eventDate, this.eventState.capacity,
//                     this.eventState.title, this.eventState.goal, "n/a",
//                     "3", [], this.state.tags, this.eventState.access, this.state.restriction, this.eventState.prize, (data) => {
//                         console.log("Successfully created a challenge!");
//                         //This is the second call
//                         this.props.clearChallengeQuery();
//                         //this.props.queryChallenges();
//                         this.setState({isSubmitLoading: false});
//                         this.closeModal();
//                         this.setState({showSuccessLabel: true});
//                         this.setState({showModal: false});
//                         //this.setState({showSuccessModal: true});
//
//                     }, (error) => {
//                         //console.log(JSON.stringify(error));
//                         this.setState({submitError: "*" + JSON.stringify(error)});
//                         this.setState({isSubmitLoading: false});
//                     });
//                 ChallengeFunctions.createChallengeOptional(this.props.user.id, this.props.user.id, this.eventState.eventDate, this.eventState.capacity,
//                     this.eventState.title, this.eventState.goal, "n/a",
//                     "3", [], this.state.tags, this.eventState.access, this.state.restriction, this.eventState.prize, (data) => {
//                         console.log("Successfully created a challenge!");
//                         //This is the second call
//                         this.props.clearChallengeQuery();
//                         //this.props.queryChallenges();
//                         this.setState({isSubmitLoading: false});
//                         this.closeModal();
//                         this.setState({showSuccessLabel: true});
//                         this.setState({showModal: false});
//                         //this.setState({showSuccessModal: true});
//
//                     }, (error) => {
//                         //console.log(JSON.stringify(error));
//                         this.setState({submitError: "*" + JSON.stringify(error)});
//                         this.setState({isSubmitLoading: false});
//                     });
//             }
//             else {
//                 this.setState({isSubmitLoading: false, submitError: "Capacity needs to be an integer!"});
//             }
//         }
//         else {
//             this.setState({isSubmitLoading: false, submitError: "All fields need to be filled out!"});
//         }
//     };
//
//     handleDurationChange = (e, data) => {
//         this.eventState.duration = data.value;
//         //console.log(this.eventState.duration);
//         // this.setState({
//         //     duration: data.value,
//         // }, () => {
//         //     console.log('value',this.state.duration);
//         // });
//     };
//
//     static getTodayDateString() {
//         // This is annoying just because we need to work with time zones :(
//         const shortestTimeInterval = 5;
//         const date = new Date();
//         date.setMinutes(date.getMinutes() + (shortestTimeInterval - (date.getMinutes() % shortestTimeInterval)));
//         return date.toIsoString().substr(0, 10);
//     }
//
//     static getNowTimeString() {
//         // Sneaking some modular arithmetic in this ;) This is so that the time shown is always a nice lookin' number
//         const shortestTimeInterval = 5;
//         const date = new Date();
//         date.setMinutes(date.getMinutes() + (shortestTimeInterval - (date.getMinutes() % shortestTimeInterval)));
//         return date.toIsoString().substr(11, 5);
//     }
//
//     closeModal = () => {
//         this.setState({ showModal: false })
//     };
//
//     createSuccessModal() {
//         if(this.state.showSuccessModal) {
//             return (
//                 <Modal open={this.state.showSuccessModal}>
//                     <Modal.Header align='center'>Successfully Created Event!</Modal.Header>
//                     <Modal.Content>
//                         <Button fluid negative size="small" onClick={this.closeSuccessModal}>Ok</Button>
//                     </Modal.Content>
//                 </Modal>
//             );
//         }
//     }
//
//     createSuccessLabel() {
//         if(this.state.showSuccessLabel && this.state.showModal) {
//             this.setState({showSuccessLabel: false});
//         }
//         else if(this.state.showSuccessLabel) {
//             return (<Message positive>
//                 <Message.Header>Success!</Message.Header>
//                 <p>
//                     You just created a new Challenge!
//                 </p>
//             </Message>);
//         }
//         else {
//             return null;
//         }
//     }
//
//     closeSuccessModal = () => {
//         this.setState({showSuccessModal: false});
//     };
//
//     displayError() {
//         if(this.state.submitError !== "") {
//             return (<Message negative>
//                 <Message.Header>Sorry!</Message.Header>
//                 <p>{this.state.submitError}</p>
//             </Message>);
//         }
//     }
//
//     render() {
//
//         return (
//             <div>
//                 <Modal closeIcon trigger={<Button primary fluid size="large"> <Icon name='plus' /> Create Post</Button>}>
//                     <Modal.Header align='center'>Post Builder</Modal.Header>
//                     <Modal.Content align='center'>
//                         {/*<Grid>*/}
//                             {/*<Grid.Row>*/}
//                                 {/*<Grid.Column width={8}>*/}
//                                     {/*<Button inverted={this.state.hiitPressed} basic={!this.state.hiitPressed}>*/}
//                                         {/*<Image dark size='medium' src={require('../img/HIIT_icon.png')} onClick={() => {this.handleTag("HIIT")}}/>*/}
//                                         {/*HIIT*/}
//                                     {/*</Button>*/}
//                                 {/*</Grid.Column>*/}
//                                 {/*<Grid.Column width={8}>*/}
//                                     {/*<Button inverted inverted={this.state.strengthPressed} basic={!this.state.strengthPressed}>*/}
//                                         {/*<Image size='medium' src={require('../img/Strength_icon.png')} onClick={() => {this.handleTag("Strength")}}/>*/}
//                                         {/*Strength*/}
//                                     {/*</Button>*/}
//                                 {/*</Grid.Column>*/}
//                             {/*</Grid.Row>*/}
//                             {/*<Grid.Row>*/}
//                                 {/*<Grid.Column width={8}>*/}
//                                     {/*<Button inverted inverted={this.state.performancePressed} basic={!this.state.performancePressed}>*/}
//                                         {/*<Image size='medium' src={require('../img/Performance_icon.png')} onClick={() => {this.handleTag("Performance")}}/>*/}
//                                         {/*Performance*/}
//                                     {/*</Button>*/}
//                                 {/*</Grid.Column>*/}
//                                 {/*<Grid.Column width={8}>*/}
//                                     {/*<Button inverted inverted={this.state.endurancePressed} basic={!this.state.endurancePressed}>*/}
//                                         {/*<Image size='medium' src={require('../img/Endurance_icon.png')} onClick={() => {this.handleTag("Endurance")}}/>*/}
//                                         {/*Endurance*/}
//                                     {/*</Button>*/}
//                                 {/*</Grid.Column>*/}
//                             {/*</Grid.Row>*/}
//                         {/*</Grid>*/}
//
//                         <Container>
//                             <Grid.Row centered>
//                                 <Grid.Column width={2} className="segment centered">
//                                     <Form onSubmit={this.handleSubmit}>
//                                         <Form.Input width={5} label="Title" type="text" name="title" placeholder="Title" onChange={value => this.changeStateText("title", value)}/>
//                                         <div className="field" width={5}>
//                                             <label>End Date & Time</label>
//                                             <input width={5} type="datetime-local" name="challengeDate" onChange={value => this.changeStateText("eventDate", value)}/>
//                                         </div>
//                                         <Form.Input width={5} label="Capacity" type="text" name="capacity" placeholder="Number of allowed attendees... " onChange={value => this.changeStateText("capacity", value)}/>
//                                         <Form.Input width={5} label="Goal" type="text" name="goal" placeholder="Criteria the victor is decided on..." onChange={value => this.changeStateText("goal", value)}/>
//                                         <Form.Input width={5} label="Prize" type="text" name="prize" placeholder="Prize for winning the event..." onChange={value => this.changeStateText("prize", value)}/>
//                                         {/*<Form.Field>
//                                             <div className="field" width={5}>
//                                                 <label>Difficulty</label>
//                                                 <Rating icon='star' defaultRating={1} maxRating={3} />
//                                             </div>
//                                         </Form.Field>*/}
//                                         <Form.Field width={12}>
//                                             <Checkbox toggle onClick={this.handleAccessSwitch} onChange={this.toggle} checked={this.state.checked} label={this.eventState.access} />
//                                         </Form.Field>
//                                         <Form.Field width={12}>
//                                             <Checkbox toggle onClick={this.handleRestrictionSwitch} onChange={this.toggleRest} checked={this.state.checkedRest} label={this.showRestriction()} />
//                                         </Form.Field>
//                                         <div>{this.displayError()}{this.createSuccessLabel()}</div>
//                                     </Form>
//                                 </Grid.Column>
//                             </Grid.Row>
//                         </Container>
//                     </Modal.Content>
//                     <Modal.Actions>
//                         <Button loading={this.state.isSubmitLoading} disabled={this.state.isSubmitLoading} primary size="big" type='button' onClick={() => { this.handleSubmit()}}>Submit</Button>
//                     </Modal.Actions>
//                 </Modal>
//                 {this.createSuccessLabel()}</div>
//         );
//     }
// }
//
// const mapStateToProps = (state) => ({
//     user: state.user,
//     info: state.info,
//     cache: state.cache
// });
//
// const mapDispatchToProps = (dispatch) => {
//     return {
//         setError: (error) => {
//             dispatch(setError(error));
//         },
//         fetchChallenge: (id, variablesList) => {
//             dispatch(fetchChallenge(id, variablesList));
//         },
//         putChallenge: (event) => {
//             dispatch(putChallenge(event));
//         },
//         putChallengeQuery: (queryString, queryResult) => {
//             dispatch(putChallengeQuery(queryString, queryResult));
//         },
//         clearChallengeQuery: () => {
//             dispatch(clearChallengeQuery());
//         }
//     }
// };
//
// export default connect(mapStateToProps, mapDispatchToProps)(CreatePostProp);

import React, {Component, Fragment} from 'react'
import _ from 'lodash';
import {Grid, Button, Message, Image, Modal, Card, Icon, Form, Container, TextArea, Checkbox, Rating} from 'semantic-ui-react';
import { Storage } from 'aws-amplify';
import {connect} from "react-redux";
import {setError} from "../redux_helpers/actions/infoActions";
import fetchPost, {
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

    getPicturePaths = () => {
        const picturePaths = [];
        console.log("Pictures: " + this.state.pictures.length);
        for (let i = 0; i < this.state.pictures.length; i++) {
            const path = "pictures/" + i;
            picturePaths.push(path);
            alert("Added: " + path);
        }
        if (picturePaths.length > 0) {
            return picturePaths;
        }
        return null;
    }

    getVideoPaths = () => {
        const videoPaths = [];
        console.log("Videos: " + this.state.videos.length);
        for (let i = 0; i < this.state.videos.length; i++) {
            const path = "videos/" + i;

            videoPaths.push(path);
            alert("Added: " + path);
        }
        if (videoPaths.length > 0) {
            return videoPaths;
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
        this.getPicturePaths();
        this.getVideoPaths();
        if (this.state.description) {
            PostFunctions.createNormalPost(this.props.user.id, this.props.user.id, this.state.description, this.state.access, this.getPicturePaths(), this.getVideoPaths(), (returnValue) => {
                alert("Successfully Created Post!");
                alert(JSON.stringify(returnValue));
                const id = returnValue.data;
                let numPicturesLoaded = 0;
                let picturesLength = this.state.pictures.length;
                for (let i = 0; i < picturesLength; i++) {
                    const picturePath = id + "/pictures/" + i;
                    Storage.put(picturePath, this.state.pictures[i], { contentType: "video/*;image/*" }).then((result) => {
                        numPicturesLoaded++;
                        alert(result);
                        if (numPicturesLoaded >= picturesLength) {
                            this.setState({videosLoading: false});
                        }
                    }).catch((error) => {
                        numPicturesLoaded++;
                        alert(error);
                        if (numPicturesLoaded >= picturesLength) {
                            this.setState({videosLoading: false});
                        }
                    });
                }
                let numVideosLoaded = 0;
                let videosLength = this.state.videos.length;
                for (let i = 0; i < videosLength; i++) {
                    Storage.put(id + "/videos/" + i, this.state.videos[i], { contentType: "video/*;image/*" }).then((result) => {
                        numVideosLoaded++;
                        alert(result);
                        if (numVideosLoaded >= videosLength) {
                            this.setState({videosLoading: false});
                        }
                    }).catch((error) => {
                        numVideosLoaded++;
                        alert(error);
                        if (numVideosLoaded >= videosLength) {
                            this.setState({videosLoading: false});
                        }
                    });
                }
                // Storage.put(id + "/")
                this.setState({isSubmitLoading: false});
                this.setState({showSuccessLabel: true});
                this.setState({showModal: false});
            }, (error) => {
                console.error(error);
                this.setState({submitError: "*" + JSON.stringify(error)});
                this.setState({isSubmitLoading: false});
            });
        }
        else {
            this.setState({isSubmitLoading: false, submitError: "All fields need to be filled out!"});
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
            <div>
                <Modal closeIcon trigger={<Button primary fluid size="large"> <Icon name='plus' /> Make New Post</Button>}>
                    <Modal.Header align='center'>Write New Post</Modal.Header>
                    <Modal.Content align='center'>
                        <Container>
                            <Grid.Row centered>
                                <Grid.Column width={2} className="segment centered">
                                    <Form onSubmit={this.handleSubmit}>
                                        <TextArea width={5} label="Description" type="text" name="description" placeholder="Write post description here..." onChange={value => this.changeStateText("description", value)}/>
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
                        </Container>
                        <Card>
                            <Card.Header className="u-bg--bg">Add photo or video to post</Card.Header>
                            <Modal.Content className="u-bg--bg">
                                {this.displayCurrentVideo()}
                                {this.displayCurrentImage()}
                                <Fragment>
                                    <div className="uploadImage u-flex u-flex-align--center u-margin-top--2">
                                        <div>
                                            <Button primary fluid as="label" htmlFor="vidUpload" className="u-bg--primaryGradient">
                                                <Icon name="camera" className='u-margin-right--0' inverted />
                                                Upload Video
                                            </Button>
                                            <input type="file" accept="video/*;capture=camcorder" id="vidUpload" hidden={true} onChange={this.setVideo}/>
                                        </div>
                                    </div>
                                    <div className="uploadImage u-flex u-flex-align--center u-margin-top--2">
                                        <div>
                                            <Button primary fluid as="label" htmlFor="picUpload" className="u-bg--primaryGradient">
                                                <Icon name="camera" className='u-margin-right--0' inverted />
                                                Upload Photo
                                            </Button>
                                            <input type="file" accept="image/*;capture=camcorder" id="picUpload" hidden={true} onChange={this.setPicture}/>
                                        </div>
                                    </div>
                                </Fragment>
                            </Modal.Content>
                            <div>{this.displaySubmission()}</div>
                        </Card>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button loading={this.state.isSubmitLoading} disabled={this.state.isSubmitLoading} primary size="big" type='button' onClick={() => { this.handleSubmit()}}>Submit</Button>
                    </Modal.Actions>
                </Modal>
                {this.createSuccessLabel()}</div>
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
