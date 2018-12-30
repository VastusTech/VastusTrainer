import React, { Component } from 'react';
import './App.css';
import Tabs from './screens/Tabs.js';
import {Menu, Container, Sticky} from "semantic-ui-react";
import { Auth } from 'aws-amplify';
import SearchBarProp from "./components/SearchBar";
import { connect } from "react-redux";
import {logOut} from "./redux_helpers/actions/authActions";
import QL from "./GraphQL";
// import {  } from "./redux_helpers/actions/userActions";

/**
* Auth App
*
* This file contains the general outline of the app in a grid based format.
 */
class AuthApp extends Component {
    // handleStickyRef = stickyRef => this.setState({ stickyRef })

    //This displays the search bar, log out button, and tab system inside of the grid.
    render() {
        // const { stickyRef } = this.state;

        return (
            <div className="App">
                <Menu borderless inverted vertical fluid widths={1} fixed="top">
                    <Menu.Item>
                        <Container>
                            <SearchBarProp />
                        </Container>
                    </Menu.Item>
                </Menu>
                <Tabs />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => {
    return {
        logOut: () => {
            dispatch(logOut());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthApp);

// TODO What's the point of this right now?
// uploadFile = (evt) => {
//     const file = evt.target.files[0];
//     const name = file.name;
//
//     Storage.put(name, file).then(() => {
//         this.setState({ file: name });
//     })
// };
