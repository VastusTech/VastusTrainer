import { API, graphqlOperation} from 'aws-amplify';
import { ifDebug } from "./Constants";
import _ from 'lodash';
import ItemType, {switchReturnItemType} from "./logic/ItemType";

class GraphQL {
    static getFetchIDFunction(itemType) {
        return switchReturnItemType(itemType, GraphQL.getClient, GraphQL.getTrainer, GraphQL.getGym, GraphQL.getWorkout, GraphQL.getReview,
            GraphQL.getEvent, GraphQL.getChallenge, GraphQL.getInvite, GraphQL.getPost, "GraphQL get Fetch function function not implemented");
    }
    static getFetchUsernameFunction(itemType) {
        return switchReturnItemType(itemType, GraphQL.getClientByUsername, GraphQL.getTrainerByUsername, GraphQL.getGymByUsername,
            null, null, null, null, null, null, "GraphQL get Fetch Username function function not implemented");
    }
    static getBatchFetchIDFunction(itemType) {
        return switchReturnItemType(itemType, GraphQL.getClients, GraphQL.getTrainers, GraphQL.getGyms, GraphQL.getWorkouts,
            GraphQL.getReviews, GraphQL.getEvents, GraphQL.getChallenges, GraphQL.getInvites, GraphQL.getPosts,
            "GraphQL get Batch Fetch function function not implemented");
    }
    static getQueryFunction(itemType) {
        return switchReturnItemType(itemType, GraphQL.queryClients, GraphQL.queryTrainers, GraphQL.queryGyms, GraphQL.queryWorkouts,
            GraphQL.queryReviews, GraphQL.queryEvents, GraphQL.queryChallenges, GraphQL.queryInvites, GraphQL.queryPosts,
            "GraphQL get Query function function not implemented");
    }
    static getClient(id, variableList, successHandler, failureHandler) {
        GraphQL.execute(GraphQL.constructQuery("GetClient", "getClient", {id: id}, variableList),
            "getClient", successHandler, failureHandler);
    }
    static getClientByUsername(username, variableList, successHandler, failureHandler) {
        GraphQL.execute(GraphQL.constructQuery("GetClientByUsername", "getClientByUsername", {username: username}, variableList),
            "getClientByUsername", successHandler, failureHandler);
    }
    static getTrainer(id, variableList, successHandler, failureHandler) {
        GraphQL.execute(GraphQL.constructQuery("GetTrainer", "getTrainer", {id: id}, variableList),
            "getTrainer", successHandler, failureHandler);
    }
    static getTrainerByUsername(username, variableList, successHandler, failureHandler) {
        GraphQL.execute(GraphQL.constructQuery("GetTrainerByUsername", "getTrainerByUsername", {username: username}, variableList),
            "getTrainerByUsername", successHandler, failureHandler);
    }
    static getGym(id, variableList, successHandler, failureHandler) {
        GraphQL.execute(GraphQL.constructQuery("GetGym", "getGym", {id: id}, variableList),
            "getGym", successHandler, failureHandler);
    }
    static getGymByUsername(username, variableList, successHandler, failureHandler) {
        GraphQL.execute(GraphQL.constructQuery("GetGymByUsername", "getGymByUsername", {username: username}, variableList),
            "getGymByUsername", successHandler, failureHandler);
    }
    static getWorkout(id, variableList, successHandler, failureHandler) {
        GraphQL.execute(GraphQL.constructQuery("GetWorkout", "getWorkout", {id: id}, variableList),
            "getWorkout", successHandler, failureHandler);
    }
    static getReview(id, variableList, successHandler, failureHandler) {
        GraphQL.execute(GraphQL.constructQuery("GetReview", "getReview", {id: id}, variableList),
            "getReview", successHandler, failureHandler);
    }
    static getEvent(id, variableList, successHandler, failureHandler) {
        // console.log("ay lmao pt. 2");
        GraphQL.execute(GraphQL.constructQuery("GetEvent", "getEvent", {id: id}, variableList),
            "getEvent", successHandler, failureHandler);
    }
    static getChallenge(id, variableList, successHandler, failureHandler) {
        // console.log("ay lmao pt. 2");
        GraphQL.execute(GraphQL.constructQuery("GetChallenge", "getChallenge", {id: id}, variableList),
            "getChallenge", successHandler, failureHandler);
    }
    static getInvite(id, variableList, successHandler, failureHandler) {
        GraphQL.execute(GraphQL.constructQuery("GetInvite", "getInvite", {id: id}, variableList),
            "getInvite", successHandler, failureHandler);
    }
    static getPost(id, variableList, successHandler, failureHandler) {
        GraphQL.execute(GraphQL.constructQuery("GetPost", "getPost", {id: id}, variableList),
            "getPost", successHandler, failureHandler);
    }
    static getGroup(id, variableList, successHandler, failureHandler) {
        GraphQL.execute(GraphQL.constructQuery("GetGroup", "getGroup", {id: id}, variableList),
            "getGroup", successHandler, failureHandler);
    }
    static getComment(id, variableList, successHandler, failureHandler) {
        GraphQL.execute(GraphQL.constructQuery("GetComment", "getComment", {id: id}, variableList),
            "getComment", successHandler, failureHandler);
    }
    static getSponsor(id, variableList, successHandler, failureHandler) {
        GraphQL.execute(GraphQL.constructQuery("GetSponsor", "getSponsor", {id: id}, variableList),
            "getSponsor", successHandler, failureHandler);
    }
    static getClients(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test GraphQL so that GraphQL error will pop up!
            console.log("Be prepared to have some IDs returned in the unretrieved Items list!!!!");
        }
        const idList = GraphQL.generateIDList(ids);
        GraphQL.execute(GraphQL.constructQuery("GetClients", "getClients", null, variableList, idList, true),
            "getClients", successHandler, failureHandler);
    }
    static getTrainers(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test GraphQL so that GraphQL error will pop up!
            console.log("Be prepared to have some IDs returned in the unretrieved Items list!!!!");
        }
        const idList = GraphQL.generateIDList(ids);
        GraphQL.execute(GraphQL.constructQuery("GetTrainers", "getTrainers", null, variableList, idList, true),
            "getTrainers", successHandler, failureHandler);
    }
    static getGyms(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test GraphQL so that GraphQL error will pop up!
            console.log("Be prepared to have some IDs returned in the unretrieved Items list!!!!");
        }
        const idList = GraphQL.generateIDList(ids);
        GraphQL.execute(GraphQL.constructQuery("GetGyms", "getGyms", null, variableList, idList, true),
            "getGyms", successHandler, failureHandler);
    }
    static getWorkouts(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test GraphQL so that GraphQL error will pop up!
            console.log("Be prepared to have some IDs returned in the unretrieved Items list!!!!");
        }
        const idList = GraphQL.generateIDList(ids);
        GraphQL.execute(GraphQL.constructQuery("GetWorkouts", "getWorkouts", null, variableList, idList, true),
            "getWorkouts", successHandler, failureHandler);
    }
    static getReviews(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test GraphQL so that GraphQL error will pop up!
            console.log("Be prepared to have some IDs returned in the unretrievedItems list!!!!");
        }
        const idList = GraphQL.generateIDList(ids);
        GraphQL.execute(GraphQL.constructQuery("GetReviews", "getReviews", null, variableList, idList, true),
            "getReviews", successHandler, failureHandler);
    }
    static getEvents(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test GraphQL so that GraphQL error will pop up!
            console.log("Be prepared to have some IDs returned in the unretrievedItems list!!!!");
        }
        const idList = GraphQL.generateIDList(ids);
        GraphQL.execute(GraphQL.constructQuery("GetEvents", "getEvents", null, variableList, idList, true),
            "getEvents", successHandler, failureHandler);
    }
    static getChallenges(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test GraphQL so that GraphQL error will pop up!
            console.log("Be prepared to have some IDs returned in the unretrievedItems list!!!!");
        }
        const idList = GraphQL.generateIDList(ids);
        GraphQL.execute(GraphQL.constructQuery("GetChallenges", "getChallenges", null, variableList, idList, true),
            "getChallenges", successHandler, failureHandler);
    }
    static getInvites(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test GraphQL so that GraphQL error will pop up!
            console.log("Be prepared to have some IDs returned in the unretrievedItems list!!!!");
        }
        const idList = GraphQL.generateIDList(ids);
        GraphQL.execute(GraphQL.constructQuery("GetInvites", "getInvites", null, variableList, idList, true),
            "getInvites", successHandler, failureHandler);
    }
    static getPosts(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test GraphQL so that GraphQL error will pop up!
            console.log("Be prepared to have some IDs returned in the unretrievedItems list!!!!");
        }
        const idList = GraphQL.generateIDList(ids);
        GraphQL.execute(GraphQL.constructQuery("GetPosts", "getPosts", null, variableList, idList, true),
            "getPosts", successHandler, failureHandler);
    }
    static getGroups(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test GraphQL so that GraphQL error will pop up!
            console.log("Be prepared to have some IDs returned in the unretrievedItems list!!!!");
        }
        const idList = GraphQL.generateIDList(ids);
        GraphQL.execute(GraphQL.constructQuery("GetGroups", "getGroups", null, variableList, idList, true),
            "getGroups", successHandler, failureHandler);
    }
    static getComments(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test GraphQL so that GraphQL error will pop up!
            console.log("Be prepared to have some IDs returned in the unretrievedItems list!!!!");
        }
        const idList = GraphQL.generateIDList(ids);
        GraphQL.execute(GraphQL.constructQuery("GetComments", "getComments", null, variableList, idList, true),
            "getComments", successHandler, failureHandler);
    }
    static getSponsors(ids, variableList, successHandler, failureHandler) {
        if (ids && ids.length > 100) {
            // TODO Make sure we actually test GraphQL so that GraphQL error will pop up!
            console.log("Be prepared to have some IDs returned in the unretrievedItems list!!!!");
        }
        const idList = GraphQL.generateIDList(ids);
        GraphQL.execute(GraphQL.constructQuery("GetSponsors", "getSponsors", null, variableList, idList, true),
            "getSponsors", successHandler, failureHandler);
    }
    static queryClients(variableList, filter, limit, nextToken, successHandler, failureHandler, queryClientCache, putCacheQueryClient) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        GraphQL.execute(GraphQL.constructQuery("QueryClients", "queryClients", inputVariables, variableList, filter, false, true),
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
        GraphQL.execute(GraphQL.constructQuery("QueryTrainers", "queryTrainers", inputVariables, variableList, filter, false, true),
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
        GraphQL.execute(GraphQL.constructQuery("QueryGyms", "queryGyms", inputVariables, variableList, filter, false, true),
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
        GraphQL.execute(GraphQL.constructQuery("QueryWorkouts", "queryWorkouts", inputVariables, variableList, filter, false, true),
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
        GraphQL.execute(GraphQL.constructQuery("QueryReviews", "queryReviews", inputVariables, variableList, filter, false, true),
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
        GraphQL.execute(GraphQL.constructQuery("QueryEvents", "queryEvents", inputVariables, variableList, filter, false, true),
            "queryEvents", successHandler, failureHandler, queryEventCache, putCacheQueryEvent);
    }
    static queryChallenges(variableList, filter, limit, nextToken, successHandler, failureHandler, queryEventCache, putCacheQueryEvent) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        GraphQL.execute(GraphQL.constructQuery("QueryChallenges", "queryChallenges", inputVariables, variableList, filter, false, true),
            "queryChallenges", successHandler, failureHandler, queryEventCache, putCacheQueryEvent);
    }
    static queryInvites(variableList, filter, limit, nextToken, successHandler, failureHandler, queryInviteCache, putCacheQueryInvite) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        GraphQL.execute(GraphQL.constructQuery("QueryInvites", "queryInvites", inputVariables, variableList, filter, false, true),
            "queryInvites", successHandler, failureHandler, queryInviteCache, putCacheQueryInvite);
    }
    static queryPosts(variableList, filter, limit, nextToken, successHandler, failureHandler, queryPostCache, putCacheQueryPost) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        GraphQL.execute(GraphQL.constructQuery("QueryPosts", "queryPosts", inputVariables, variableList, filter, false, true),
            "queryPosts", successHandler, failureHandler, queryPostCache, putCacheQueryPost);
    }
    static queryGroups(variableList, filter, limit, nextToken, successHandler, failureHandler, queryGroupCache, putCacheQueryGroup) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        GraphQL.execute(GraphQL.constructQuery("QueryGroups", "queryGroups", inputVariables, variableList, filter, false, true),
            "queryGroups", successHandler, failureHandler, queryGroupCache, putCacheQueryGroup);
    }
    static queryComments(variableList, filter, limit, nextToken, successHandler, failureHandler, queryCommentCache, putCacheQueryComment) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        GraphQL.execute(GraphQL.constructQuery("QueryComments", "queryComments", inputVariables, variableList, filter, false, true),
            "queryComments", successHandler, failureHandler, queryCommentCache, putCacheQueryComment);
    }
    static querySponsors(variableList, filter, limit, nextToken, successHandler, failureHandler, querySponsorCache, putCacheQuerySponsor) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        GraphQL.execute(GraphQL.constructQuery("QuerySponsors", "querySponsors", inputVariables, variableList, filter, false, true),
            "querySponsors", successHandler, failureHandler, querySponsorCache, putCacheQuerySponso);
    }

    /**
     *
     * @param filterJSON The filter in JSON format using $ in front of variable names, and using and, or, and not to consolidate
     * @param variableValues The exact values for the variables in the JSON
     * @example
     *      const filter = generateFilter({
     *          and: [
     *              {
     *                  ifCompleted: {
     *                      eq: $ifCompleted
     *                  }
     *              },
     *              {
     *                  or: [
     *                      {
     *                          access: {
     *                              eq: "$access"
     *                          }
     *                      },
     *                      {
     *                          friends: {
     *                              contains: "$id"
     *                          }
     *                      }
     *                  ]
     *              }
     *          ]
     *      },{
     *          ifCompleted: false,
     *          access: public,
     *          id: GraphQL.props.user.id
     *      });
     */
    static generateFilter(filterJSON, variableValues) {
        return {
            // Add the parameter value and also take out all the quotation marks from the JSON
            parameterString: "filter: " + JSON.stringify(filterJSON).replace(/['"]+/g, ''),
            parameters: variableValues
        }
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
    // TODO GraphQL only supports input String! regular types. Reason to change?
    // TODO Make GraphQL more resilient to an empty filter?
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
        // console.log(queryString);
        if (queryCache && queryCache[queryString]) {
            // console.log("Received query from the cache");
            console.log("Received the query from the cache");
            // console.log(JSON.stringify(queryCache[queryString]));
            successHandler(queryCache[queryString]);
        }
        else {
            console.log("Sending ql = " + query.query + "\nWith variables = " + JSON.stringify(query.variables));
            if (ifDebug) {
                console.log("Sending ql = " + query.query + "\nWith variables = " + JSON.stringify(query.variables));
            }
            API.graphql(graphqlOperation(query.query, query.variables)).then((data) => {
                console.log("GraphQL operation succeeded!");
                if (!data.data || !data.data[queryFunctionName]) {
                    console.log("Object returned nothing!!! Something wrong?");
                    // failureHandler("Object had returned null");
                    successHandler(null);
                    return;
                }
                // console.log("Returned!");
                console.log("Returned: " + JSON.stringify(data.data[queryFunctionName]));
                if (ifDebug) {
                    console.log("Returned: " + JSON.stringify(data.data[queryFunctionName]));
                }
                // console.log(JSON.stringify(queryCache));
                if (putQuery) {
                    // console.log("Putting the query in!");
                    putQuery(queryString, data.data[queryFunctionName]);
                }
                successHandler(data.data[queryFunctionName]);
            }).catch((error) => {
                console.log("GraphQL operation failed...");
                if (error.message) {
                    error = error.message;
                }
                console.log(JSON.stringify(error));
                failureHandler(error);
            });
        }
    }
}

export default GraphQL;
