import _ from 'lodash'
import React, { Component, Fragment } from 'react'
import {Search } from 'semantic-ui-react'
// import EventCard from "./EventCard";
// import setupAWS from "../AppConfig";
import QL from '../GraphQL';
import EventDescriptionModal from "./EventDescriptionModal";
// import ChallengeDescrip
import ClientModal from "./ClientModal";
import {connect} from "react-redux";
import {fetchClient, fetchEvent, putClientQuery, putEventQuery, fetchChallenge, putChallengeQuery} from "../redux_helpers/actions/cacheActions";
import {newSearch, loadMoreResults} from "../redux_helpers/actions/searchActions";
import {switchReturnItemType} from "../logic/ItemType";
import ChallengeDescriptionModal from "./ChallengeDescriptionModal";

// setupAWS();

class SearchBarProp extends Component {
    state = {
        error: null,
        isLoading: false,
        minimumSearchResults: 6,
        // eventsLoading: false,
        // clientsLoading: false,
        // searchResults: [],
        // searchQuery: '',
        // source: [],
        // nextEventQueryToken: null,
        // nextClientQueryToken: null,
        // eventsLimit: 100,
        // clientsLimit: 100,
        selectedResult: null,
        result: null,
        resultModal: null,
        resultModalOpen: false
    };

    constructor(props) {
        super(props);
        this.handleResultSelect = this.handleResultSelect.bind(this);
        this.openResultModal = this.openResultModal.bind(this);
        this.closeResultModal = this.closeResultModal.bind(this);
    }

    componentWillMount() {
        // this.resetComponent()
    }

    // resetComponent = () => {
    //     // TODO How to stop any requests already in progress?
    //     this.setState({ isLoading: false,
    //         searchResults: [],
    //         searchQuery: '',
    //         source: [],
    //         nextEventQueryToken: null,
    //         nextClientQueryToken: null,
    //         clientsLoading: false,
    //         eventsLoading: false
    //     });
    // };
    //
    // loadMoreEventResults(searchQuery) {
    //     console.log("Starting to loading more client results");
    //     if (!this.state.eventsLoading) {
    //         const filter = QL.generateFilter({
    //             and: [{
    //                 or: [{
    //                     title: {
    //                         contains: "$searchQuery"
    //                     }
    //                 },{
    //                     description: {
    //                         contains: "$searchQuery"
    //                     }
    //                 }]
    //             },{
    //                 access: {
    //                     eq: "$access"
    //                 }
    //             }]
    //         }, {
    //             searchQuery,
    //             access: "public"
    //         });
    //         this.setState({eventsLoading: true});
    //         // TODO Do we need to get this much from GraphQL?
    //         QL.queryEvents(["id", "item_type", "title", "owner", "access", "members"], filter, this.state.eventsLimit, this.state.nextEventQueryToken,
    //             (data) => {
    //                 console.log("Received events query: " + JSON.stringify(data));
    //                 if (data.items && data.items.length) {
    //                     this.addResults(data.items);
    //                 }
    //                 this.setState({
    //                     nextEventQueryToken: data.nextToken,
    //                     eventsLoading: false
    //                 });
    //             }, (error) => {
    //                 console.log("query events for search bar has failed");
    //                 if (error.message) {
    //                     error = error.message;
    //                 }
    //                 console.log(error);
    //                 this.setState({
    //                     error: error,
    //                     nextEventQueryToken: null,
    //                     eventsLoading: false
    //                 });
    //             }, this.props.cache.eventQueries, this.props.putEventQuery);
    //     }
    // }
    // loadMoreClientResults(searchQuery) {
    //     console.log("Starting to loading more client results");
    //     if (!this.state.clientsLoading) {
    //         const filter = QL.generateFilter({
    //             or: [
    //                 {
    //                     username: {
    //                         contains: "$searchQuery"
    //                     }
    //                 },
    //                 {
    //                     name: {
    //                         contains: "$searchQuery"
    //                     }
    //                 },
    //                 {
    //                     email: {
    //                         contains: "$searchQuery"
    //                     }
    //                 }
    //             ]
    //         }, {
    //             searchQuery
    //         });
    //         this.setState({clientsLoading: true});
    //         QL.queryClients(["id", "item_type", "name", "username", "email"], filter, this.state.clientsLimit, this.state.nextClientQueryToken,
    //             (data) => {
    //                 console.log("Received clients query: " + JSON.stringify(data));
    //                 if (data.items && data.items.length) {
    //                     // if (searchQuery === "Blake") {
    //                     //     console.log(JSON.stringify(data.items));
    //                     // }
    //                     this.addResults(data.items);
    //                 }
    //                 this.setState({
    //                     nextClientQueryToken: data.nextToken,
    //                     clientsLoading: false
    //                 });
    //             }, (error) => {
    //                 console.log("query clients for search bar has failed");
    //                 if (error.message) {
    //                     error = error.message;
    //                 }
    //                 console.log(error);
    //                 this.setState({
    //                     error: error,
    //                     nextClientQueryToken: null,
    //                     clientsLoading: false
    //                 });
    //             }, this.props.cache.clientQueries, this.props.putClientQuery);
    //     }
    // }
    // addResults(items) {
    //     const results = [];
    //     for (let i = 0; i < items.length; i++) {
    //         const item = items[i];
    //         if (item) {
    //             if (item.hasOwnProperty("item_type")) {
    //                 var result;
    //                 if (item.item_type === "Client") {
    //                     result = {
    //                         title: item.name,
    //                         description: item.username,
    //                         resultcontent: item
    //                     };
    //                 }
    //                 else if (item.item_type === "Event") {
    //                     result = {
    //                         title: (item.title),
    //                         description: item.goal,
    //                         resultcontent: item
    //                     };
    //                 }
    //                 else {
    //                     console.log("item has item_type of " + item.item_type + " for some reason?");
    //                     return;
    //                 }
    //                 results.push(result);
    //             }
    //         }
    //     }
    //     this.setState({searchResults: [...this.state.searchResults, ...results]});
    // }

    handleResultSelect = (e, { result }) => {
        // console.log("This will pop up a modal in the future for result: " + JSON.stringify(result));
        // console.log("Popping up result = " + JSON.stringify(result.resultcontent));
        // if (result.resultcontent.item_type === "Client") {
        //     this.props.fetchClient(result.resultcontent.id, ["id", "name", "gender", "birthday", "profileImagePath", "profilePicture"]);
        // }
        // else if (result.resultcontent.item_type === "Event") {
        //     this.props.fetchEvent(result.resultcontent.id, ["time", "time_created", "title", "goal", "members"]);
        // }
        // this.setState({resultModal: this.resultModal(result.resultcontent)});
        this.setState({result: result.resultcontent});
        this.setState({resultModalOpen: true});
    };

    handleSearchChange = (e, { value }) => {
        console.log(value);
        this.retrieveSearchResults(value);
        // this.resetComponent();
        //this.setState({searchResults: []});
        // this.state.searchResults = [];
        // this.setState({ searchQuery: value });
        // console.log("Handling search change, state = " + JSON.stringify(this.state));
        // if (value.length < 1) return;
        // this.loadMoreEventResults(value);
        // this.loadMoreClientResults(value);
    };

    retrieveSearchResults(searchQuery) {
        this.setState({isLoading: true});
        this.props.newSearch(searchQuery, (data) => {
            if (data && data.length) {
                if (data.length < this.state.minimumSearchResults && !this.props.search.ifFinished) {
                    this.retrieveMoreResults(searchQuery, data);
                }
                else {
                    this.setState({isLoading: false});
                }
            }
            else {
                this.setState({isLoading: false});
            }
        });
    }

    retrieveMoreResults(searchQuery, results) {
        // console.log("Retrieving more results!");
        this.props.loadMoreResults(searchQuery, (data) => {
            results.push(...data);
            if (results.length < this.state.minimumSearchResults && !this.props.search.ifFinished) {
                // console.log("Grabbing more results: numResults = " + results.length + ", ifFinished = " + this.props.search.ifFinished);
                this.retrieveMoreResults(searchQuery, results);
            }
            else {
                this.setState({isLoading: false});
            }
        })
    }

    resultModal(result) {
        if (!result) {
            return null;
        }
        const type = result.item_type;
        // if (this.state.toOpenResultModal) {
        //     this.setState({toOpenResultModal: false, resultModalOpen: true});
        // }
        if (type === "Client") {
            return(
                <ClientModal open={this.state.resultModalOpen} onClose={this.closeResultModal} clientID={result.id}/>
            );
        }
        else if (type === "Event") {
            return(
                <EventDescriptionModal open={this.state.resultModalOpen} onClose={this.closeResultModal}
                                       eventID={result.id}
                />
            );
        }
        else if (type === "Challenge") {
            return(
                <ChallengeDescriptionModal open={this.state.resultModalOpen} onClose={this.closeResultModal} challengeID={result.id}/>
        )
        }
        else {
            console.log("Wrong type inputted! Received " + type);
        }
    }

    getFormattedResults() {
        const formattedResults = [];
        if (this.props.search.searchBarEnabled) {
            const results = this.props.search.results;
            const resultTitles = [];
            for (const i in results) {
                if (results.hasOwnProperty(i)) {
                    const result = results[i];
                    if (result.hasOwnProperty("item_type") && result.item_type) {
                        let formattedResult = switchReturnItemType(result.item_type,
                            { // Client
                                title: result.name,
                                description: result.username,
                                resultcontent: result
                            },
                            null,
                            null,
                            null,
                            null,
                            { // Event
                                title: (result.title),
                                description: result.goal,
                                resultcontent: result
                            },
                            { // Challenge
                                title: (result.title),
                                description: result.description,
                                resultcontent: result
                            },
                            null,
                            null);

                        if (formattedResult) {
                            // TODO Insertsort this? By what basis though?
                            while (formattedResult.title && resultTitles.includes(formattedResult.title)) {
                                const len = formattedResult.title.length;
                                // alert(JSON.stringify(resultTitles));
                                // alert(formattedResult.title + "~ -3: " + formattedResult.title[len - 3] + ", -1: " + formattedResult.title[len - 1]);
                                if (formattedResult.title[len - 3] === "(" && formattedResult.title[len - 1] === ")") {
                                    let num = parseInt(formattedResult.title[len - 2]);
                                    num++;
                                    formattedResult.title = formattedResult.title.substr(0, len - 3) + "(" + num + ")";
                                    // formattedResult.title[len - 2] = num;
                                }
                                else {
                                    formattedResult.title += " (2)";
                                }
                            }
                            // alert(formattedResult.title + " is not in " + JSON.stringify(resultTitles));
                            formattedResults.push(formattedResult);
                            resultTitles.push(formattedResult.title);
                        }
                    }
                }
            }
        }
        // alert(formattedResults.length);
        return formattedResults;
    }

    openResultModal = () => { this.setState({resultModalOpen: true}); };
    closeResultModal = () => { this.setState({resultModalOpen: false}); };

    render() {
        // TODO Check to see that this is valid to do?
        // console.log("Showing " + this.state.searchResults.length + " results");
        // const isLoading = (this.state.clientsLoading || this.state.eventsLoading);
        // console.log(this.props.search.results.length);
        return (
            <Fragment>
                {this.resultModal(this.state.result)}
                <Search
                    fluid
                    size="large"
                    placeholder="Search for Users and Challenges"
                    loading={this.state.isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 1000, { leading: true })}
                    results={this.getFormattedResults()}
                    value={this.props.search.searchQuery}
                    showNoResults={this.props.search.searchBarEnabled}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    cache: state.cache,
    search: state.search
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchClient: (id, variablesList) => {
            dispatch(fetchClient(id, variablesList));
        },
        fetchEvent: (id, variablesList) => {
            dispatch(fetchEvent(id, variablesList));
        },
        putClientQuery: (queryString, queryResult) => {
            dispatch(putClientQuery(queryString, queryResult));
        },
        putEventQuery: (queryString, queryResult) => {
            dispatch(putEventQuery(queryString, queryResult));
        },
        newSearch: (queryString, dataHandler) => {
            dispatch(newSearch(queryString, dataHandler));
        },
        loadMoreResults: (queryString, dataHandler) => {
            dispatch(loadMoreResults(queryString, dataHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarProp);