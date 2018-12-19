import React, { Component } from 'react';
import { connect } from 'react-redux';
import Amplify, { Auth, Analytics } from 'aws-amplify';
import SignInPage from './authscreens/SignInPage';

class UnauthApp extends Component {
    // This defines the passed function for use
    authenticate = (user) => {};

    constructor(props) {
        super(props);
        // this.authenticate = this.props.authenticate.bind(this);
    }

    // async componentDidMount() {
    //     // StatusBar.setHidden(true);
    //     try {
    //         //console.log(JSON.stringify(this.props));
    //         const user = await Auth.currentAuthenticatedUser();
    //         this.setState({ user, isLoading: false })
    //     } catch (err) {
    //         this.setState({ isLoading: false })
    //     }
    // }

    // async componentWillReceiveProps(nextProps) {
    //     //try {
    //         //console.log(JSON.stringify(nextProps));
    //         //console.log(JSON.stringify(this.props));
    //         //const user = await Auth.currentAuthenticatedUser();
    //         //this.setState({ user })
    //     // } catch (err) {
    //     //     this.setState({ user: {} })
    //     // }
    // }

    render() {
        // Maybe this would be to have a sort of advertisement for our website?
        return (
            <SignInPage/>
        );
    }
}

// const mapStateToProps = state => ({
//     auth: state.auth
// });

export default UnauthApp;

