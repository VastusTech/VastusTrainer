// import AWSConfig from "./AppConfig";
import * as AWS from "aws-sdk";
import {ifDebug} from "./Constants";

// TODO Use this instead?
// AWSConfig();

/// Configure AWS SDK for JavaScript
AWS.config.update({region: 'us-east-1'});
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222'});

// Prepare to call Lambda function
let lambda = new AWS.Lambda({region: 'us-east-1', apiVersion: '2015-03-31'});

class Lambda {
    // All the basic CRUD Functions with my own personally defined JSONs
    // TODO Is there a case where we would need specify action yet?
    static create(fromID, itemType, createRequest, successHandler, failureHandler) {
        this.invokeDatabaseLambda({
            fromID: fromID,
            action: "CREATE",
            itemType: itemType,
            [("create" + itemType + "Request")]: createRequest,
        }, successHandler, failureHandler);
    }
    static updateSetAttribute(fromID, objectID, objectItemType, attributeName, attributeValue, successHandler, failureHandler) {
        this.invokeDatabaseLambda({
            fromID: fromID,
            action: "UPDATESET",
            itemType: objectItemType,
            identifiers: [ objectID ] ? objectID != null : [],
            attributeName: attributeName,
            attributeValues: [
                attributeValue
            ]
        }, successHandler, failureHandler);
    }
    static updateAddToAttribute(fromID, objectID, objectItemType, attributeName, attributeValue, successHandler, failureHandler) {
        this.invokeDatabaseLambda({
            fromID,
            action: "UPDATEADD",
            itemType: objectItemType,
            identifiers: [
                objectID
            ],
            attributeName,
            attributeValues: [
                attributeValue
            ],
        }, successHandler, failureHandler);
    }
    static updateRemoveFromAttribute(fromID, objectID, objectItemType, attributeName, attributeValue, successHandler, failureHandler) {
        this.invokeDatabaseLambda({
            fromID,
            action: "UPDATEREMOVE",
            itemType: objectItemType,
            identifiers: [
                objectID
            ],
            attributeName,
            attributeValues: [
                attributeValue
            ],
        }, successHandler, failureHandler);
    }
    static delete(fromID, objectID, objectItemType, successHandler, failureHandler) {
        this.invokeDatabaseLambda({
            fromID,
            action: "DELETE",
            itemType: objectItemType,
            identifiers: [
                objectID
            ],
        }, successHandler, failureHandler)
    }
    static invokeDatabaseLambda(payload, successHandler, failureHandler) {
        this.invokeLambda("VastusDatabaseLambdaFunction", payload, successHandler, failureHandler);
    }
    static invokePaymentLambda(payload, successHandler, failureHandler) {
        this.invokeLambda("VastusPaymentLambdaFunction", payload, successHandler, failureHandler);
    }
    static invokeFirebaseLambda(payload, successHandler, failureHandler) {
        this.invokeLambda("VastusFirebaseTokenFunction", payload, successHandler, failureHandler);
    }
    static invokeLambda(functionName, payload, successHandler, failureHandler) {
        console.log("Sending lambda payload: " + JSON.stringify(payload));
        if (ifDebug) {
            alert("Sending lambda payload: " + JSON.stringify(payload));
        }
        lambda.invoke({
            FunctionName : functionName,
            Payload: JSON.stringify(payload)
        }, (error, data) => {
            if (error) {
                console.error(error);
                console.error("Lambda failure: " + JSON.stringify(error));
                if (ifDebug) { alert("Lambda failure: " + JSON.stringify(error))}
                if (failureHandler) { failureHandler(error); }
            } else if (data.Payload) {
                //console.log(data.Payload);
                const payload = JSON.parse(data.Payload);
                if (payload.errorMessage) {
                    console.error("Bad payload!: " + JSON.stringify(payload));
                    console.error(payload.errorMessage);
                    alert("Bad payload!: " + JSON.stringify(payload));
                    if (failureHandler) { failureHandler(payload.errorMessage); }
                }
                else {
                    console.log("Successfully invoked lambda function!");
                    if (ifDebug) {
                        alert("Successful Lambda, received " + JSON.stringify(payload));
                    }
                    if (successHandler) { successHandler(payload); }
                }
            }
            else {
                console.error("Weird error: payload returned with nothing...");
                if (failureHandler) { failureHandler("Payload returned with null"); }
            }
        });
    }
}

export default Lambda;