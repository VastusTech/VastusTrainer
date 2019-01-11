import Amplify from "aws-amplify";

function setupAWS() {
    Amplify.configure({
        'aws_appsync_graphqlEndpoint': 'https://ferhxllitvaypgfmlu75ra22su.appsync-api.us-east-1.amazonaws.com/graphql',
        'aws_appsync_region': 'us-east-1',
        'aws_appsync_authenticationType': 'AWS_IAM',
    });
    Amplify.configure({
        Auth: {
            // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
            identityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222',
            // REQUIRED - Amazon Cognito Region
            region: 'us-east-1',
            // OPTIONAL - Amazon Cognito User Pool ID
            userPoolId: 'us-east-1_G46oxH6g9',
            // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
            userPoolWebClientId: '1umvfrkvtm4hv8u5a1qqseq38p',
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
}

export default setupAWS;