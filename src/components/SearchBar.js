import _ from 'lodash'
import React, { Component, Fragment } from 'react'
import {Search } from 'semantic-ui-react'
import EventCard from "./EventCard";
import setupAWS from "../AppConfig";
import QL from '../GraphQL';
import EventDescriptionModal from "./EventDescriptionModal";
import ClientModal from "./ClientModal";
import {connect} from "react-redux";
import {fetchClient, fetchEvent, putClientQuery, putEventQuery} from "../redux_helpers/actions/cacheActions";

// setupAWS();

class SearchBarProp extends Component {
    state = {
        error: null,
        isLoading: true,
        eventsLoading: false,
        clientsLoading: false,
        searchResults: [],
        searchQuery: '',
        source: [],
        nextEventQueryToken: null,
        nextClientQueryToken: null,
        eventsLimit: 100,
        clientsLimit: 100,
        selectedResult: null,
        resultModalOpen: false
    };

    componentWillMount() {
        this.resetComponent()
    }

    resetComponent = () => {
        // TODO How to stop any requests already in progress?
        this.setState({ isLoading: false,
            searchResults: [],
            searchQuery: '',
            source: [],
            nextEventQueryToken: null,
            nextClientQueryToken: null,
            clientsLoading: false,
            eventsLoading: false
        });
    };

    loadMoreEventResults(searchQuery) {
        console.log("Starting to loading more client results");
        if (!this.state.eventsLoading) {
            const eventsVariableComparisons = {
                title: "contains",
                access: "eq"
            };
            const eventsVariableValues = {
                title: searchQuery,
                access: "public"
            };
            this.setState({eventsLoading: true});
            // TODO Do we need to get this much from GraphQL?
            QL.queryEvents(["id", "item_type", "title", "goal", "owner", "access", "members"], QL.generateFilter("and",
                eventsVariableComparisons, eventsVariableValues), this.state.eventsLimit, this.state.nextEventQueryToken,
                (data) => {
                    console.log("Received events query: " + JSON.stringify(data));
                    if (data.items && data.items.length) {
                        this.addResults(data.items);
                    }
                    this.setState({
                        nextEventQueryToken: data.nextToken,
                        eventsLoading: false
                    });
                }, (error) => {
                    console.log("query events for search bar has failed");
                    if (error.message) {
                        error = error.message;
                    }
                    console.log(error);
                    this.setState({
                        error: error,
                        nextEventQueryToken: null,
                        eventsLoading: false
                    });
                }, this.props.cache.eventQueries, this.props.putEventQuery);
        }
    }
    loadMoreClientResults(searchQuery) {
        console.log("Starting to loading more client results");
        if (!this.state.clientsLoading) {
            const clientsVariableComparisons = {
                username: "contains",
                name: "contains",
                email: "contains"
            };
            const clientsVariableValues = {
                name: searchQuery,
                username: searchQuery,
                email: searchQuery
            };
            this.setState({clientsLoading: true});
            QL.queryClients(["id", "item_type", "name", "username", "email"], QL.generateFilter("or",
                clientsVariableComparisons, clientsVariableValues), this.state.clientsLimit, this.state.nextClientQueryToken,
                (data) => {
                    console.log("Received clients query: " + JSON.stringify(data));
                    if (data.items && data.items.length) {
                        // if (searchQuery === "Blake") {
                        //     alert(JSON.stringify(data.items));
                        // }
                        this.addResults(data.items);
                    }
                    this.setState({
                        nextClientQueryToken: data.nextToken,
                        clientsLoading: false
                    });
                }, (error) => {
                    console.log("query clients for search bar has failed");
                    if (error.message) {
                        error = error.message;
                    }
                    console.log(error);
                    this.setState({
                        error: error,
                        nextClientQueryToken: null,
                        clientsLoading: false
                    });
                }, this.props.cache.clientQueries, this.props.putClientQuery);
        }
    }
    addResults(items) {
        const results = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item) {
                if (item.hasOwnProperty("item_type")) {
                    var result;
                    if (item.item_type === "Client") {
                        result = {
                            title: item.name,
                            description: item.username,
                            resultcontent: item
                        };
                    }
                    else if (item.item_type === "Event") {
                        result = {
                            title: (item.title),
                            description: item.goal,
                            resultcontent: item
                        };
                    }
                    else {
                        alert("item has item_type of " + item.item_type + " for some reason?");
                        return;
                    }
                    results.push(result);
                }
            }
        }
        this.setState({searchResults: [...this.state.searchResults, ...results]});
    }

    handleResultSelect = (e, { result }) => {
        // alert("This will pop up a modal in the future for result: " + JSON.stringify(result));
        // alert("Popping up result = " + JSON.stringify(result.resultcontent));
        // if (result.resultcontent.item_type === "Client") {
        //     this.props.fetchClient(result.resultcontent.id, ["id", "name", "gender", "birthday", "profileImagePath", "profilePicture"]);
        // }
        // else if (result.resultcontent.item_type === "Event") {
        //     this.props.fetchEvent(result.resultcontent.id, ["time", "time_created", "title", "goal", "members"]);
        // }
        this.setState({result: result.resultcontent, resultModalOpen: true});
    };

    handleSearchChange = (e, { value }) => {
        console.log(value);
        this.resetComponent();
        //this.setState({searchResults: []});
        this.state.searchResults = [];
        this.setState({ searchQuery: value });
        console.log("Handling search change, state = " + JSON.stringify(this.state));
        if (value.length < 1) return;
        this.loadMoreEventResults(value);
        this.loadMoreClientResults(value);
    };

    resultModal() {
        if (!this.state.result) {
            return null;
        }
        const type = this.state.result.item_type;
        if (type === "Client") {
            return(
                <ClientModal open={this.state.resultModalOpen} onClose={this.closeResultModal.bind(this)} clientID={this.state.result.id}/>
            );
        }
        else if (type === "Event") {
            return(
                <EventDescriptionModal open={this.state.resultModalOpen} onClose={this.closeResultModal.bind(this)}
                                       eventID={this.state.result.id}
                />
            );
        }
        else {
            alert("Wrong type inputted! Received " + type);
        }
    }

    openResultModal = () => { this.setState({resultModalOpen: true}); };
    closeResultModal = () => { this.setState({resultModalOpen: false}); };

    render() {
        // TODO Check to see that this is valid to do?
        console.log("Showing " + this.state.searchResults.length + " results");
        const isLoading = (this.state.clientsLoading || this.state.eventsLoading);
        return (
            <Fragment>
                {this.resultModal()}
                <Search
                    fluid
                    size="large"
                    placeholder="Search for Users and Challenges"
                    loading={isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                    results={this.state.searchResults}
                    value={this.state.searchQuery}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    cache: state.cache
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
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarProp);