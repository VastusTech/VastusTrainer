import React, {Component, Fragment} from "react";
import { connect } from "react-redux";
import {Popup, List, Header, Divider, Segment, Grid, Form, Button} from "semantic-ui-react";
import {switchReturnItemType} from "../logic/ItemType";
import ClientCard from "../components/ClientCard";
import EventCard from "../components/EventCard";
import ChallengeCard from "../components/ChallengeCard";
import PostCard from "../components/PostCard";
import {disableSearchBar, enableSearchBar} from "../redux_helpers/actions/searchActions";

// This is going to be for every search functionality we really want.
// We'll have a filter section and a search bar

/*
This will be mainly a search bar filled with search results and then also a "type" section to indicate which types
should be included in the search. Then a filter section for what you want to check for.

       ( Search...                       O_)
       (    Type    )       (    Filter    )

       (               Result              )
       (               Result              )
       (               Result              )
       (               Result              )
                        ...

This'll be pretty weird though because we already have the search bar prop up above... Maybe this wou

Okay so the things we will want to use this for is...
    * To be able to search for things more carefully that aren't just Trainers and Challenges
    *

Assumptions:
    * Very soon, we will have just the posts be the feed and you view them chronologically (?)
    * We will also have the Profile view for all of your stuff including friends, challenges, profile picture
    * Also have leaderboard for things like viewing who has the most wins, who did the most events, who was in the best
    *       groups, who contributed most to the community.
    * We will have this search screen ...... which we are inquiring the use of right now
    * We will have the Notifications screen, so we can view invites, requests, friend requests ...
    * Finally, we already will have a search bar for all of the viewable clients/trainers/events/challenges?
        * It might actually make sense to start with just searching for Clients and Trainers...
        *       Maybe even just Trainers (and gyms?)

What is this missing?
    * We will still want to search for challenges and events individually
        * (Have categories that you can turn on and off.)
    * We may want to turn off/on the attributes that we search using the searchQuery
        * (This will be adjusting the major OR statement after the primary AND statement
    * Search with only a specific value (i.e only unrestricted challenges / only newChallenge posts)
        * (This will add a value to the primary AND statement to force it to be true.)
    * Search for things created after... / people who are older than...
        * (We can search for things lesser than / greater than certain values. Combine this and dateTime values)
    * Search for things that contain
Use Cases:

 */

class SearchScreen extends Component {
    state = {

    };

    filterState = {

    };

    changeStateText(key, value) {
        this.filterState[key] = value.target.value;
        console.log("new " + key + " is equal to " + value.target.value);
    }

    componentWillMount() {
        this.props.disableSearchBar();
    }

    componentWillUnmount() {
        this.props.enableSearchBar();
    }

    getFormattedResults() {
        const results = [];
        for (let i = 0; i < this.props.search.results.length; i++) {
            const result = this.props.search.results[i];
            const item_type = result.item_type;
            results.push(
                <List.Item>
                    {switchReturnItemType(item_type,
                    <ClientCard rank={i} clientID={result.id}/>,
                    null,
                    null,
                    null,
                    null,
                    <EventCard eventID={result.id}/>,
                    <ChallengeCard challengeID={result.id}/>,
                    null,
                    <PostCard postID={result.id}/>,
                        "Result type not implemented!")}
                </List.Item>
            );
        }
        return results;
    }

    render() {
        return(
            <Fragment>
                <Grid columns={2}>
                    <Grid.Column className="ui one column stackable center aligned page grid">
                        <Form>
                            <Form.Input type="text" iconPosition='left' icon='user' name="username" placeholder="Username" onChange={value => this.changeStateText("username", value)}/>
                            <Popup position="left center" trigger={<Form.Input iconPosition='left' icon='lock' type="password" name="password" placeholder="Password" onChange={value => this.changeStateText("password", value)}/>}>
                                Password must be at least 8 characters long, contains lower and upper case letters, contain at least one number!
                            </Popup>
                            {/* <Form.Input type="password" label="Password" name="password" placeholder="Password" onChange={value => this.changeStateText("password", value)}/> */}
                            <Form.Input type="password" iconPosition='left' icon='lock' name="confirmPassword" placeholder="Confirm Password" onChange={value => this.changeStateText("confirmPassword", value)}/>
                            <Divider />
                            <Form.Input type="text" iconPosition='left' icon='user circle' name="name" placeholder="Name" onChange={value => this.changeStateText("name", value)}/>
                            <Form.Input type="text" iconPosition='left' icon='male' name="gender" placeholder="Gender" onChange={value => this.changeStateText("gender", value)}/>
                            <Divider />
                            <Form.Input type="date" iconPosition='left' icon='calendar alternate outline' name="birthdate" onChange={value => this.changeStateText("birthday", value)}/>
                            <Form.Input type="text" iconPosition='left' icon='mail' name="email" placeholder="Email" onChange={value => this.changeStateText("email", value)}/>
                            <div className="u-flex u-flex-justify--space-between u-padding-y--2 u-margin-top--2">
                                <Button negative onClick={this.handleCancelButton.bind(this)}>Cancel</Button>
                                <Button positive color='green' onClick={this.handleCreateButton.bind(this)}>Create</Button>
                            </div>
                        </Form>
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle' >
                        <List>
                            {this.getFormattedResults()}
                        </List>
                    </Grid.Column>
                </Grid>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache,
    info: state.info,
    search: state.search
});

const mapDispatchToProps = (dispatch) => {
    return {
        enableSearchBar: () => {
            dispatch(enableSearchBar());
        },
        disableSearchBar: () => {
            dispatch(disableSearchBar());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);