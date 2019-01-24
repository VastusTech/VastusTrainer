import React, { Component } from 'react';
import Amplify, { Auth, Analytics } from 'aws-amplify';
import { inspect } from 'util';
import Semantic, {  Image,  Container, Reveal, Label, Segment, Grid, Divider, Transition, Button } from 'semantic-ui-react';
import { connect } from "react-redux";
import {logOut} from "../redux_helpers/actions/authActions";
import SignInPage from './SignInPage';
import ForgotPasswordModal from "./ForgotPasswordModal";
import Logo from '../vastuscomponents/img/the_logo.svg';

const transition = 'browse';

class OpeningScreen extends Component {
 
 	state = { visible: true };
 	toggleVisibility = () => this.setState({ visible: !this.state.visible });

    render() {
    	const { visible } = this.state;
		return(
  			<Transition visible={visible} animation='scale' duration={500}>
				<Container className='login-form'>
    	 			<Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            			<Grid.Column style={{ maxWidth: 475 }}>
							<Segment raised padded inverted>
    	 						<Image src={Logo} size = 'tiny' centered/>
    	 							<h2>VASTUS</h2>
    	 							<h2>The 21st Century Standard of Fitness</h2>
    	 							<Divider/>
    	 							<h3>Build Communities</h3>
    	 							<h3>Curate Fitness Goals</h3>
    	 							<h3>Spread Your Brand</h3>
    	 							<Button content={visible ? 'Start Your Journey' : 'Start Your Journey'} onClick={this.toggleVisibility} color = 'purple' size = 'massive'/>
							</Segment>
						</Grid.Column>
					</Grid>
				</Container>
			</Transition>
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

export default connect(mapStateToProps, mapDispatchToProps)(OpeningScreen);