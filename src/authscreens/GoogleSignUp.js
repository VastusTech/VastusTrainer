import { Auth } from 'aws-amplify';
import React, { Component } from 'react';
import Semantic, { Button, List, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import {googleSignIn} from "../redux_helpers/actions/authActions";

// To federated sign in from Google
/*
So for Google, it will only be a Google Sign up! Then you should sign in with the normal password and stuff
 */
class GoogleSignUp extends React.Component {
    constructor(props) {
        super(props);
        this.signIn = this.signIn.bind(this);
    }

    componentDidMount() {
        const ga = window.gapi && window.gapi.auth2 ? 
            window.gapi.auth2.getAuthInstance() : 
            null;
        if (!ga) this.createScript();
    }

    signIn() {
        const ga = window.gapi.auth2.getAuthInstance();
        ga.signIn().then(
            googleUser => {
                this.props.googleSignIn(googleUser);
                // this.getAWSCredentials(googleUser);
            },
            error => {
                console.error(error);
            }
        );
    }
    


    // async getAWSCredentials(googleUser) {
        // const { id_token, expires_at } = googleUser.getAuthResponse();
        // const profile = googleUser.getBasicProfile();
        // let user = {
        //     email: profile.getEmail(),
        //     name: profile.getName(),
        //     //birthdate: profile.getBirthdays()
        // };
        // const credentials = await Auth.federatedSignIn(
        //     'google',
        //     { token: id_token, expires_at },
        //     user
        // );
        // console.log('credentials', credentials);
    // }

    createScript() {
        // load the Google SDK
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/platform.js';
        script.async = true;
        script.onload = this.initGapi;
        document.body.appendChild(script);
    }

    initGapi() {
        // init the Google SDK client
        const g = window.gapi;
        g.load('auth2', function() {
            g.auth2.init({
                client_id: '308108761903-qfc4dsbnjicjs0dpqao5ofh2c5u2636k.apps.googleusercontent.com',
                // authorized scopes
                scope: 'profile email openid'
            });
        });
    }

    render() {
        return (
            <div>
                <Button fluid color="green" onClick={this.signIn}> <Icon name="google"> </Icon>Google Sign In</Button>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => {
    return {
        googleSignIn: (googleUser) => {
            dispatch(googleSignIn(googleUser));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GoogleSignUp);
