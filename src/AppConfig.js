import Amplify from "aws-amplify";

function setupAWS() {
//     var {graphql, buildSchema} = require('graphql');
//
//     let myAppConfig = {
//         // ...
//         'aws_appsync_graphqlEndpoint': "https://ferhxllitvaypgfmlu75ra22su.appsync-api.us-east-1.amazonaws.com/graphql",
//         'aws_appsync_region': 'us-east-1',
//         // If we comment out, this line, then the GraphQL request is actually sent
// //     //'aws_appsync_apiKey': 'da2-2h7e6fjjkffypdg6peqjv7khxa'
//     };
//
// //Amplify.configure(aws_exports)
    Amplify.configure({
        'aws_appsync_authenticationType': 'AMAZON_COGNITO_USER_POOLS',
    });

// Storage.configure({ level: 'private' });

    Amplify.configure({
        API: {
            graphql_endpoint: 'https://ferhxllitvaypgfmlu75ra22su.appsync-api.us-east-1.amazonaws.com/graphql',
            graphql_endpoint_iam_region: 'us-east-1'
        },
        Auth: {

            // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
            identityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222',

            // REQUIRED - Amazon Cognito Region
            region: 'us-east-1',


            // OPTIONAL - Amazon Cognito User Pool ID
            userPoolId: 'us-east-1_t1rvP2wBr',

            // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
            userPoolWebClientId: '124v8f255kaqivbm5bp71s6rej',

            // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
            // mandatorySignIn: false,


            // authenticationFlowType: 'USER_PASSWORD_AUTH'
        },
        Storage: {
            bucket: 'vastusofficial', //REQUIRED -  Amazon S3 bucket
            // region: 'us-east-1', //OPTIONAL -  Amazon service region
            // identityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222', //Specify your identityPoolId for Auth and Unauth access to your bucket;
        }
    });

    // var AWS = require('aws-sdk');
    //
    // AWS.config.update({region: 'us-east-1'});
    // AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222'});
}

export default setupAWS;