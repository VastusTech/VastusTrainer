import Amplify, { API, Auth } from 'aws-amplify';
import {withAuthenticator } from 'aws-amplify-react';
import aws_exports from './aws-exports';
import * as AWS from "aws-sdk";
/// Configure AWS SDK for JavaScript
AWS.config.update({region: 'REGION'});
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'IDENTITY_POOL_ID'});

// Prepare to call Lambda function
var lambda = new AWS.Lambda({region: 'REGION', apiVersion: '2015-03-31'});