import * as AWS from "aws-sdk";
import {ifDebug} from "../logic/Constants";
import {consoleLog, consoleError} from "../logic/DebuggingHelper";

/// Configure AWS SDK for JavaScript
AWS.config.update({region: 'us-east-1'});
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222'});

// Prepare to call Lambda function
let lambda = new AWS.Lambda({region: 'us-east-1', apiVersion: '2015-03-31'});

/**
 * This is the static class that allows us to invoke the AWS Lambda function using the predefined JSON structure.
 */
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
            identifiers: [
                objectID
            ],
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
    static ping(successHandler, failureHandler) {
        this.invokeDatabaseLambda({
            action: "PING"
        }, successHandler, failureHandler);
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
        consoleLog("Sending lambda payload: " + JSON.stringify(payload));
        if (ifDebug) {
            console.log("Sending lambda payload: " + JSON.stringify(payload));
        }
        lambda.invoke({
            FunctionName : functionName,
            Payload: JSON.stringify(payload)
        }, (error, data) => {
            if (error) {
                consoleError(error);
                consoleError("Lambda failure: " + JSON.stringify(error));
                if (ifDebug) { console.log("Lambda failure: " + JSON.stringify(error))}
                if (failureHandler) { failureHandler(error); }
            } else if (data.Payload) {
                //consoleLog(data.Payload);
                const payload = JSON.parse(data.Payload);
                if (payload.errorMessage) {
                    consoleError("Bad payload!: " + JSON.stringify(payload));
                    consoleError(payload.errorMessage);
                    console.log("Bad payload!: " + JSON.stringify(payload));
                    if (failureHandler) { failureHandler(payload.errorMessage); }
                }
                else {
                    consoleLog("Successfully invoked lambda function!");
                    if (ifDebug) {
                        console.log("Successful Lambda, received " + JSON.stringify(payload));
                    }
                    if (successHandler) { successHandler(payload); }
                }
            }
            else {
                consoleError("Weird error: payload returned with nothing...");
                if (failureHandler) { failureHandler("Payload returned with null"); }
            }
        });
    }
}

export default Lambda;