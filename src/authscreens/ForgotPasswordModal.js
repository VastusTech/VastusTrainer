import React, { Component } from 'react';
import { Modal, Button, Grid, Form, Message, Dimmer, Loader } from 'semantic-ui-react';
import Amplify, { Auth } from 'aws-amplify';
import {
    closeForgotPasswordModal,
    confirmForgotPassword,
    forgotPassword, openForgotPasswordModal,
    openSignUpModal
} from "../redux_helpers/actions/authActions";
import { connect } from "react-redux";
import {setError} from "../redux_helpers/actions/infoActions";

class ForgotPasswordModal extends Component {
    authState = {
        username: "",
        confirmationCode: "",
        newPassword: "",
        confirmNewPassword: ""
    };

    // state = {
    //     isConfirming: false,
    //     isLoading: false,
    //     error: null
    // };

    // vastusForgotPassword(successHandler, failureHandler) {
    //     // TODO Check to see if the input fields are put in correctly
    //     this.setState({isLoading: true});
    //     Auth.forgotPassword(this.authState.username).then((data) => {
    //         console.log("Successfully forgot the password! :)");
    //         console.log(data);
    //         this.setState({isLoading: false});
    //         successHandler(data);
    //     }).catch((error) => {
    //         console.log("Failed to forget the password (just like how I failed to forget the day my dad left me)");
    //         if (error.message) {
    //             error = error.message
    //         }
    //         console.log(error);
    //         this.setState({isLoading: false});
    //         failureHandler(error);
    //     });
    // }

    // vastusForgetPasswordSubmit(successHandler, failureHandler) {
    //     // TODO Check to see if the input fields are put  in correctly
    //     if (this.authState.newPassword !== this.authState.confirmNewPassword) {
    //         console.log("Failed to make a new password :(");
    //         console.log("Passwords did not match");
    //         failureHandler("The Passwords do not match");
    //     }
    //     this.setState({isLoading: true});
    //     Auth.forgotPasswordSubmit(this.authState.username, this.authState.confirmationCode, this.authState.newPassword).then(function(data) {
    //         console.log("Successfully made a new password");
    //         console.log(data);
    //         this.setState({isLoading: false});
    //         successHandler(data);
    //     }).catch(function(error) {
    //         console.log("Failed to make a new password :(");
    //         if (error.message) {
    //             error = error.message
    //         }
    //         console.log(error);
    //         this.setState({isLoading: false});
    //         failureHandler(error);
    //     });
    // }

    changeStateText(key, value) {
        // TODO Sanitize this input
        // TODO Check to see if this will, in fact, work.!
        // inspect(value);
        this.authState[key] = value.target.value;
        console.log("New " + key + " is equal to " + value.target.value);
    }

    handleSubmitButton() {
        // this.vastusForgotPassword((user) => {
        //     this.setState({isConfirming: true, error: null});
        // }, (error) => {
        //     this.setState({error: error});
        // });
        this.props.forgotPassword(this.authState.username);
    }

    handleConfirmButton() {
        if (this.authState.newPassword !== this.authState.confirmNewPassword) {
            console.log("Failed to make a new password :(");
            console.log("Passwords did not match");
            this.props.setError(new Error("Password and confirm password do not match!"));
        }
        else if (!(this.authState.username && this.authState.confirmationCode && this.authState.newPassword && this.authState.confirmNewPassword)) {
            this.props.setError(new Error("All fields need to be filled in!"));
        }
        else {
            this.props.confirmForgotPassword(this.authState.username, this.authState.confirmationCode, this.authState.newPassword);
        }
    }

    handleCancelButton() {
        // TODO Have a are you sure? thing attached to this
        // this.setState({error: null, isConfirming: false});
        this.props.closeForgotPasswordModal();
    }

    render() {
        function errorMessage(error) {
            if (error) {
                // if (error.errorMessage) {
                //     error = error.errorMessage;
                // }
                return (
                    <Modal.Description>
                        <Message color='red'>
                            <h1>Error!</h1>
                            <p>{JSON.stringify(error)}</p>
                        </Message>
                    </Modal.Description>
                );
            }
        }
        function loadingProp(isLoading) {
            if (isLoading) {
                return (
                    <Dimmer active>
                        <Loader/>
                    </Dimmer>
                );
            }
            return null;
        }

        if (this.props.auth.confirmingForgotPassword) {
            return(
                <Modal open={this.props.auth.forgotPasswordModalOpen} onClose={() => (false)} trigger={<Button onClick={this.props.openForgotPasswordModal.bind(this)}>Forgot Password?</Button>}size='tiny'>
                    {loadingProp(this.props.info.isLoading)}
                    <Modal.Header>Confirm your email and choose your new password!</Modal.Header>
                    {errorMessage(this.props.info.error)}
                    <Modal.Content>
                        <p>Enter your username to retrieve your information</p>
                    </Modal.Content>
                    <Modal.Actions style={{borderTop: 'none'}}>
                        <Form>
                            <Form.Input type="text" label="Confirmation Code from your Email" name="confirmationCode" placeholder="XXXXXX" onChange={value => this.changeStateText("confirmationCode", value)}/>
                            <Form.Input type="password" label="New Password" name="newPassword" placeholder="new password" onChange={value => this.changeStateText("newPassword", value)}/>
                            <Form.Input type="password" name="confirmNewPassword" placeholder="confirm new password" onChange={value => this.changeStateText("confirmNewPassword", value)}/>
                            <div className="u-flex u-flex-justify--space-between u-padding-y--2 u-margin-top--2">
                                <Button negative onClick={this.handleCancelButton.bind(this)}>Cancel</Button>
                                <Button positive color='green' onClick={this.handleConfirmButton.bind(this)}>Confirm</Button>
                            </div>
                        </Form>
                    </Modal.Actions>
                </Modal>
            );
        }
        return(
            <Modal open={this.props.auth.forgotPasswordModalOpen} onClose={() => (false)} trigger={<Button size="large" fluid inverted onClick={this.props.openForgotPasswordModal.bind(this)}>Forgot Password?</Button>}size='tiny'>
                {loadingProp(this.props.info.isLoading)}
                <Modal.Header style={{borderBottom: 'none'}}>Forgot Password?</Modal.Header>
                {errorMessage(this.props.info.error)}
                <Modal.Content>
                    <p>Enter your username to retrieve your information</p>
                </Modal.Content>
                <Modal.Actions style={{borderTop: 'none'}}>
                    <Form>
                        <Form.Input type="text" name="username" placeholder="username" onChange={value => this.changeStateText("username", value)}/>
                        <div className="u-flex u-flex-justify--space-between u-padding-y--2 u-margin-top--2">
                            <Button negative onClick={this.handleCancelButton.bind(this)}>Cancel</Button>
                            <Button positive color='green' onClick={this.handleSubmitButton.bind(this)}>Submit</Button>
                        </div>
                    </Form>
                </Modal.Actions>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        forgotPassword: (username) => {
            dispatch(forgotPassword(username));
        },
        confirmForgotPassword: (username, confirmationCode, newPassword) => {
            dispatch(confirmForgotPassword(username, confirmationCode, newPassword));
        },
        setError: (error) => {
            dispatch(setError(error));
        },
        openForgotPasswordModal: () => {
            dispatch(openForgotPasswordModal());
        },
        closeForgotPasswordModal: () => {
            dispatch(closeForgotPasswordModal());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordModal);
