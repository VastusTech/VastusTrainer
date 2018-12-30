import React, { Component } from 'react';
import Semantic, { Modal, Button, Form, Message, Dimmer, Loader, Popup, Divider } from 'semantic-ui-react';
// import Amplify, { Auth } from 'aws-amplify';
// import Lambda from '../Lambda';
// import appConfig from '../AppConfig';
import {closeSignUpModal, confirmSignUp, openSignUpModal, signUp} from "../redux_helpers/actions/authActions";
import { connect } from "react-redux";
import {clearError, setError} from "../redux_helpers/actions/infoActions";

// appConfig();

class SignUpModal extends Component {
    constructor(props) {
        super(props);
        // this.authenticate = this.props.authenticate.bind(this);
    }

    authState = {
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        gender: "",
        birthday: "",
        email: "",
        confirmationCode: "",
    };

    changeStateText(key, value) {
        this.authState[key] = value.target.value;
        console.log("New " + key + " is equal to " + value.target.value);
    }

    handleCreateButton() {
        // console.log("Setting state with isConfirming is true");
        // TODO Do extra checking for the specifications of the account!
        if (this.fieldsAreFilledCorrectly()) {
            this.props.signUp(this.authState.username, this.authState.password, this.authState.name, this.authState.gender,
                    this.authState.birthday, this.authState.email);
        }
    }

    fieldsAreFilledCorrectly() {
        // console.log("Setting state with isConfirming is true");
        // TODO Do extra checking for the specifications of the account!
        if (this.authState.username && this.authState.password && this.authState.confirmPassword && this.authState.name &&
            this.authState.birthday && this.authState.gender && this.authState.email) {
            if (this.authState.password !== this.authState.confirmPassword) {
                this.props.setError(new Error("Password and confirm password do not match!"));
            }
            else if (!this.authState.email.includes("@") || !this.authState.email.includes(".")) {
                this.props.setError(new Error("Email needs to be properly formed!"));
            }
            else if (this.authState.username.includes(" ")) {
                this.props.setError(new Error("Username cannot contain spaces!"));
            }
            // Password checking: minLength = 8, needs a number, a lowercase letter, and an uppercase letter
            else if (!SignUpModal.properlyFormedPassword(this.authState.password)) {
                this.props.setError(new Error("Password must be longer than 8 characters, must need a number, a lower case letter, and an upper case letter"));
            }
            else {
                return true;
            }
        }
        else {
            this.props.setError(new Error("All fields need to be filled in!"));
        }
        return false;
    }

    static properlyFormedPassword(password) {
        return (password.length > 8 && /\d/.test(password) && (password.toUpperCase() !== password) && (password.toLowerCase() !== password));
    }

    handleConfirmButton() {
        // TODO Is there a chance that the username could be lost here?
        if (this.authState.confirmationCode) {
            this.props.confirmSignUp(this.authState.username, this.authState.confirmationCode);
        }
        else {
            this.props.setError(new Error("Confirmation code cannot be empty"));
        }
    }

    handleCancelButton() {
        // TODO Have a confirmation like are you sure ya wanna close?
        this.props.clearError();
        this.props.closeSignUpModal();
    }

    render() {
        function errorMessage(error) {
            if (error && error.message) {
                // console.log(JSON.stringify(error));
                return (
                    <Modal.Description>
                        <Message color='red'>
                            <h1>Error!</h1>
                            <p>{error.message}</p>
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

        if (this.props.auth.confirmingSignUp) {
            return(
                <div>
                    <Modal open={this.props.auth.signUpModalOpen} onClose={() => (false)} trigger={<Button fluid color='red' onClick={this.props.openSignUpModal.bind(this)} inverted> Sign Up </Button>} size='tiny'>
                        {loadingProp(this.props.info.isLoading)}
                        <Modal.Header>Check your email to confirm the sign up!</Modal.Header>
                        {errorMessage(this.props.info.error)}
                        <Modal.Actions>
                            <div>
                                <Form>
                                    <label>Confirmation Code</label>
                                    <Form.Input type="text" name="confirmationCode" placeholder=" XXXXXX " onChange={value => this.changeStateText("confirmationCode", value)}/>
                                </Form>
                            </div>
                            <div>
                                <Button onClick={this.handleConfirmButton.bind(this)} color='blue'>Confirm Your Account</Button>
                            </div>
                        </Modal.Actions>
                    </Modal>
                </div>
            );
        }
        return(
            <Modal open={this.props.auth.signUpModalOpen} trigger={<Button size="large" fluid inverted onClick={this.props.openSignUpModal.bind(this)}> Sign Up </Button>} size='tiny'>
                {loadingProp(this.props.info.isLoading)}
                <Modal.Header>Create Account to Join</Modal.Header>
                {errorMessage(this.props.info.error)}
                <Modal.Actions style={{borderTop: 'none'}}>
                    <Form>
                        <Form.Input type="text" iconPosition='left' icon='user' name="username" placeholder="Username" onChange={value => this.changeStateText("username", value)}/>
                        <Popup position="left center" trigger={<Form.Input iconPosition='left' icon='lock' type="password" name="password" placeholder="Password" onChange={value => this.changeStateText("password", value)}/>}>
                            Password must be at least 8 characters long, contains lower and upper case letters, contain at least one number!
                        </Popup>
                        {/* <Form.Input type="password" label="Password" name="password" placeholder="Password" onChange={value => this.changeStateText("password", value)}/> */}
                        <Form.Input type="password" iconPosition='left' icon='lock' name="confirmPassword" placeholder="Confirm Password" onChange={value => this.changeStateText("confirmPassword", value)}/>
                        <Divider />
                        <Form.Input type="text" iconPosition='left' icon='user circle' name="name" placeholder="Name" onChange={value => this.changeStateText("name", value)}/>
                        <Form.Input type="text" iconPosition='left' icon='male' name="gender" placeholder="Gender" onChange={value => this.changeStateText("gender", value)}/>
                        <Divider />
                        <Form.Input type="date" iconPosition='left' icon='calendar alternate outline' name="birthdate" onChange={value => this.changeStateText("birthday", value)}/>
                        <Form.Input type="text" iconPosition='left' icon='mail' name="email" placeholder="Email" onChange={value => this.changeStateText("email", value)}/>
                        <div className="u-flex u-flex-justify--space-between u-padding-y--2 u-margin-top--2">
                            <Button negative onClick={this.handleCancelButton.bind(this)}>Cancel</Button>
                            <Button positive color='green' onClick={this.handleCreateButton.bind(this)}>Create</Button>
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
        signUp: (username, password, name, gender, birthday, email) => {
            dispatch(signUp(username, password, name, gender, birthday, email));
        },
        confirmSignUp: (username, confirmationCode) => {
            dispatch(confirmSignUp(username, confirmationCode));
        },
        setError: (error) => {
            dispatch(setError(error));
        },
        clearError: () => {
            dispatch(clearError());
        },
        openSignUpModal: () => {
            dispatch(openSignUpModal());
        },
        closeSignUpModal: () => {
            dispatch(closeSignUpModal());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpModal);
