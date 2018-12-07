import { API, graphqlOperation} from 'aws-amplify';
import { ifDebug } from "./Constants";
import _ from 'lodash';

class GraphQL {
    static getClient(id, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetClient", "getClient", {id: id}, variableList),
            "getClient", successHandler, failureHandler);
    }
    static getClientByUsername(username, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetClientByUsername", "getClientByUsername", {username: username}, variableList),
            "getClientByUsername", successHandler, failureHandler);
    }
    static getTrainer(id, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetTrainer", "getTrainer", {id: id}, variableList),
            "getTrainer", successHandler, failureHandler);
    }
    static getTrainerByUsername(username, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetTrainerByUsername", "getTrainerByUsername", {username: username}, variableList),
            "getTrainerByUsername", successHandler, failureHandler);
    }
    static getGym(id, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetGym", "getGym", {id: id}, variableList),
            "getGym", successHandler, failureHandler);
    }
    static getGymByUsername(username, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetGymByUsername", "getGymByUsername", {username: username}, variableList),
            "getGymByUsername", successHandler, failureHandler);
    }
    static getWorkout(id, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetWorkout", "getWorkout", {id: id}, variableList),
            "getWorkout", successHandler, failureHandler);
    }
    static getReview(id, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetReview", "getReview", {id: id}, variableList),
            "getReview", successHandler, failureHandler);
    }
    static getEvent(id, variableList, successHandler, failureHandler) {
        // alert("ay lmao pt. 2");
        this.execute(this.constructQuery("GetEvent", "getEvent", {id: id}, variableList),
            "getEvent", successHandler, failureHandler);
    }
    static getInvite(id, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetInvite", "getInvite", {id: id}, variableList),
            "getInvite", successHandler, failureHandler);
    }
    static getClients(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test this so that this error will pop up!
            alert("Be prepared to have some IDs returned in the unretrievedItems list!!!!");
        }
        const idList = this.generateIDList(ids);
        this.execute(this.constructQuery("GetClients", "getClients", null, variableList, idList, true),
            "getClients", successHandler, failureHandler);
    }
    static getTrainers(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test this so that this error will pop up!
            alert("Be prepared to have some IDs returned in the unretrievedItems list!!!!");
        }
        const idList = this.generateIDList(ids);
        this.execute(this.constructQuery("GetTrainers", "getTrainers", null, variableList, idList, true),
            "getTrainers", successHandler, failureHandler);
    }
    static getGyms(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test this so that this error will pop up!
            alert("Be prepared to have some IDs returned in the unretrievedItems list!!!!");
        }
        const idList = this.generateIDList(ids);
        this.execute(this.constructQuery("GetGyms", "getGyms", null, variableList, idList, true),
            "getGyms", successHandler, failureHandler);
    }
    static getWorkouts(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test this so that this error will pop up!
            alert("Be prepared to have some IDs returned in the unretrievedItems list!!!!");
        }
        const idList = this.generateIDList(ids);
        this.execute(this.constructQuery("GetWorkouts", "getWorkouts", null, variableList, idList, true),
            "getWorkouts", successHandler, failureHandler);
    }
    static getReviews(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test this so that this error will pop up!
            alert("Be prepared to have some IDs returned in the unretrievedItems list!!!!");
        }
        const idList = this.generateIDList(ids);
        this.execute(this.constructQuery("GetReviews", "getReviews", null, variableList, idList, true),
            "getReviews", successHandler, failureHandler);
    }
    static getEvents(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test this so that this error will pop up!
            alert("Be prepared to have some IDs returned in the unretrievedItems list!!!!");
        }
        const idList = this.generateIDList(ids);
        this.execute(this.constructQuery("GetEvents", "getEvents", null, variableList, idList, true),
            "getEvents", successHandler, failureHandler);
    }
    static getInvites(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test this so that this error will pop up!
            alert("Be prepared to have some IDs returned in the unretrievedItems list!!!!");
        }
        const idList = this.generateIDList(ids);
        this.execute(this.constructQuery("GetInvites", "getInvites", null, variableList, idList, true),
            "getInvites", successHandler, failureHandler);
    }
    static queryClients(variableList, filter, limit, nextToken, successHandler, failureHandler, queryClientCache, putCacheQueryClient) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        this.execute(this.constructQuery("QueryClients", "queryClients", inputVariables, variableList, filter, false, true),
            "queryClients", successHandler, failureHandler, queryClientCache, putCacheQueryClient);
    }
    static queryTrainers(variableList, filter, limit, nextToken, successHandler, failureHandler, queryTrainerCache, putCacheQueryTrainer) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        this.execute(this.constructQuery("QueryTrainers", "queryTrainers", inputVariables, variableList, filter, false, true),
            "queryTrainers", successHandler, failureHandler, queryTrainerCache, putCacheQueryTrainer);
    }
    static queryGyms(variableList, filter, limit, nextToken, successHandler, failureHandler, queryGymCache, putCacheQueryGyms) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        this.execute(this.constructQuery("QueryGyms", "queryGyms", inputVariables, variableList, filter, false, true),
            "queryGyms", successHandler, failureHandler, queryGymCache, putCacheQueryGyms);
    }
    static queryWorkouts(variableList, filter, limit, nextToken, successHandler, failureHandler, queryWorkoutCache, putCacheQueryWorkout) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        this.execute(this.constructQuery("QueryWorkouts", "queryWorkouts", inputVariables, variableList, filter, false, true),
            "queryWorkouts", successHandler, failureHandler, queryWorkoutCache, putCacheQueryWorkout);
    }
    static queryReviews(variableList, filter, limit, nextToken, successHandler, failureHandler, queryReviewCache, putCacheQueryReview) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        this.execute(this.constructQuery("QueryReviews", "queryReviews", inputVariables, variableList, filter, false, true),
            "queryReviews", successHandler, failureHandler, queryReviewCache, putCacheQueryReview);
    }
    static queryEvents(variableList, filter, limit, nextToken, successHandler, failureHandler, queryEventCache, putCacheQueryEvent) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        this.execute(this.constructQuery("QueryEvents", "queryEvents", inputVariables, variableList, filter, false, true),
            "queryEvents", successHandler, failureHandler, queryEventCache, putCacheQueryEvent);
    }
    static queryInvites(variableList, filter, limit, nextToken, successHandler, failureHandler, queryInviteCache, putCacheQueryInvite) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        this.execute(this.constructQuery("QueryInvites", "queryInvites", inputVariables, variableList, filter, false, true),
            "queryInvites", successHandler, failureHandler, queryInviteCache, putCacheQueryInvite);
    }

    // TODO Eventually make this work better to allow for more intelligent queries
    // TODO This function is going to be how to filter any query
    // TODO include "not"? Also should we make it more flexible so like and { not { or ...
    /**
     * This is to construct a filter object that we can put into any queryObjects function
     * @param cohesionOperator Either "and" or "or", depending on how we want to mix the operation
     * @param variableComparisons The object that determines how we compare the variable { variableName: comparisonFunction }
     *    The comparison function is string in {"ne","eq","le","lt","ge","gt","contains","notContains","between","beginsWith"}
     * @param variableValues The object that determines what value we compare the variable with { variableName: variableValue }
     * @returns {{parameterString: string, parameters: parameters}}
     */
    static generateFilter(cohesionOperator, variableComparisons, variableValues) {
        var parameterString = 'filter: {\n        ' + cohesionOperator + ': [\n';
        var parameters = {};
        for (let variableName in variableComparisons) {
            parameterString += '            {\n                ';
            parameterString += variableName + ': {\n';
            parameterString += '                    ';
            // alert(variableComparisons.hasOwnProperty(variableName));
            const comparison = variableComparisons[variableName];
            const valueName = variableName + comparison;
            const value = variableValues[variableName];
            parameters[valueName] = value;
            parameterString += comparison + ': $' + valueName + '\n';
            parameterString += '                }\n            }\n';
        }
        parameterString += '        ]\n    }';
        return {
            parameterString: parameterString,
            parameters: parameters
        };
    }
    static generateIDList(ids) {
        let idListString = "ids: [";
        const parameters = {};
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const idName = "id" + i;
            parameters[idName] = id;
            idListString += ("$" + idName + ", ");
        }
        idListString += "]";
        return {
            parameterString: idListString,
            parameters: parameters
        }
    }
    // TODO This only supports input String! regular types. Reason to change?
    static constructQuery(queryName, queryFunction, inputVariables, outputVariables, filter = null, ifBatch = false, ifQuery = false) {
        let query = '';
        var finalInputVariables;
        if (filter) {
            finalInputVariables = {...inputVariables, ...filter.parameters};
        }
        else {
            finalInputVariables = inputVariables;
        }
        var ifFirst = true;
        query += 'query ' + queryName;
        if (!_.isEmpty(finalInputVariables)) {
            query += '(';
            for (let variable in finalInputVariables) {
                if (!ifFirst) {
                    query += ", ";
                }
                query += '$' + variable + ': ';
                if (variable === "limit") {
                    query += 'Int';
                }
                else if (variable === "ids") {
                    query += '[String]!';
                }
                else {
                    query += 'String!';
                }
                ifFirst = false;
            }
            query += ')';
        }
        query += ' {\n    ' + queryFunction;
        ifFirst = true;
        if (!_.isEmpty(inputVariables) || filter) {
            query += '(';
            if (filter) {
                query += filter.parameterString;
            }
            for (let variable in inputVariables) {
                if (!ifFirst || filter) {
                    query += ', ';
                }
                query += variable + ": $" + variable;
            }
            query += ')';
        }
        query += ' {\n';
        if (ifQuery || ifBatch) {
            query += '        items {\n';
        }
        for (let i in outputVariables) {
            if (ifQuery || ifBatch) {
                query += '    ';
            }
            query += '        ' + outputVariables[i] + '\n';
        }
        if (ifQuery) {
            query += '        }\n        nextToken\n';
        }
        else if (ifBatch) {
            query += '        }\n        unretrievedItems {\n            id\n        }\n';
        }
        query += '    }\n}';

        return {
            query: query,
            variables: finalInputVariables
        };
    }
    static async execute(query, queryFunctionName, successHandler, failureHandler, queryCache, putQuery) {
        const queryString = JSON.stringify(query.query) + JSON.stringify(query.variables);
        // alert(queryString);
        if (queryCache && queryCache[queryString]) {
            // alert("Received query from the cache");
            console.log("Received the query from the cache");
            // alert(JSON.stringify(queryCache[queryString]));
            successHandler(queryCache[queryString]);
        }
        else {
            if (ifDebug) {
                alert("Sending ql = " + query.query + "\nWith variables = " + JSON.stringify(query.variables));
            }
            API.graphql(graphqlOperation(query.query, query.variables)).then((data) => {
                console.log("GraphQL operation succeeded!");
                if (!data.data || !data.data[queryFunctionName]) {
                    console.log("Object returned nothing");
                    failureHandler("Object had returned null");
                }
                // alert("Returned!");
                if (ifDebug) {
                    alert("Returned: " + JSON.stringify(data.data[queryFunctionName]));
                }
                // alert(JSON.stringify(queryCache));
                if (putQuery) {
                    // alert("Putting the query in!");
                    putQuery(queryString, data.data[queryFunctionName]);
                }
                successHandler(data.data[queryFunctionName]);
            }).catch((error) => {
                console.log("GraphQL operation failed...");
                if (error.message) {
                    error = error.message;
                }
                alert(JSON.stringify(error));
                failureHandler(error);
            });
        }
    }
}

export default GraphQL;
