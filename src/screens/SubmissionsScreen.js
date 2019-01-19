import React, { Component, Fragment } from 'react';
import {List, Icon, Message, Dropdown, Label} from "semantic-ui-react";
import PostCard from "../components/PostCard";
import connect from "react-redux/es/connect/connect";
import {fetchPost, fetchChallenge} from "../redux_helpers/actions/cacheActions";

type Props = {
    challengeID: string
};

class SubmissionsScreen extends Component<Props> {
    state = {
        isLoading: false,
        challengeID: null,
        loadedPostIDs: [],
        sentRequest: false,
        challengeMembers: [{key: 0, text: 'All', value: 'all'}],
        memberSelected: 'all',
        alreadyInDropdown: false,
        firstPosts: [],
        lastPosts: [],
        largestUserPost: 0
    };

    // _isMounted = true;
    //
    // channelName = "persisted:" + this.props.challengeChannel + "_VideoFeed";
    //channelName = this.props.challengeChannel;

    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
        this.getChallengeAttribute = this.getChallengeAttribute.bind(this);
        this.getLoading = this.getLoading.bind(this);
        this.getName = this.getName.bind(this);
        this.getPostAttribute = this.getPostAttribute.bind(this);
        this.compare = this.compare.bind(this);
    }

    componentDidMount() {
        // console.log("cdm");
        if (this.state.challengeID !== this.props.challengeID) {
            this.state.challengeID = this.props.challengeID;
            // this.setState({challengeID: this.props.challengeID});
        }
        this.update(this.props);
    }

    componentWillReceiveProps(newProps, nextContext) {
        // console.log("cwrp");
        if (this.state.challengeID !== this.props.challengeID) {
            this.state.challengeID = this.props.challengeID;
            // this.setState({challengeID: this.props.challengeID});
        }
        this.update(newProps);
    }

    update(props) {
        // TODO Change this if we want to actually be able to do something while it's loading
        if (this.getChallengeAttribute("id")) {
            // console.log("Updating!");
            const submissions = this.getChallengeAttribute("submissions");
            if (!this.state.sentRequest && submissions && submissions.length > 0) {
                this.state.isLoading = true;
                this.state.sentRequest = true;
                for (let i = 0; i < submissions.length; i++) {
                    // console.log("Fetching: " + submissions[i]);
                    props.fetchPost(submissions[i], ["id", "time_created", "by", "item_type", "postType", "about", "description", "videoPaths", "picturePaths"],
                        (post) => {
                            // console.log("Returned a value! Post: " + JSON.stringify(post));
                            if (post && post.id) {
                                for(let i = 0; i < this.state.challengeMembers.length; i++) {
                                    if(this.state.challengeMembers[i].value === post.by) {
                                        this.setState({alreadyInDropdown: true});
                                    }
                                    /*if(this.state.lastPosts.indexOf(post.by) === -1) {
                                        this.setState({lastPosts: [...this.state.lastPosts, post.id]})
                                    }
                                    else {
                                        let lastPostTemp = this.state.lastPosts;
                                        lastPostTemp[this.state.lastPosts.indexOf(post.by)]
                                    }*/
                                }
                                if(!this.state.alreadyInDropdown) {
                                    this.setState({
                                        challengeMembers: [...this.state.challengeMembers, {
                                            key: (i + 1),
                                            value: post.by,
                                            text: this.getName(post.by)
                                        }], firstPosts: [...this.state.firstPosts, post.id]
                                    });
                                }
                                else {
                                    let lastPostTemp = this.state.lastPosts;

                                    //if(!this.state.firstPosts.includes(post.id))
                                    //lastPostTemp[this.state.lastPosts.indexOf(post.id)] = post.id
                                }
                                //this.setState({challengeMembers: curChalMems.push({key: (i+1), value: post.by, text: this.getName(post.by)})});
                                //alert("List of options: " + JSON.stringify(this.state.challengeMembers));
                                this.state.loadedPostIDs.push(post.id);
                                this.setState({isLoading: false, alreadyInDropdown: false});
                            }
                        })
                }
            }
        }
    }

    getName(id) {
        if (id) {
            if (this.props.cache.clients[id]) {
                return this.props.cache.clients[id].name
            }
            else if (this.props.cache.trainers[id]) {
                return this.props.cache.trainers[id].name
            }
            // else if (!this.props.info.isLoading) {
            //     this.props.fetchClient(owner, ["name"]);
            // }
        }
        return null;
    }

    getPostAttribute(postID, attribute) {
        if (postID) {
            let post = this.props.cache.posts[postID];
            if (post) {
                if (attribute.substr(attribute.length - 6) === "Length") {
                    attribute = attribute.substr(0, attribute.length - 6);
                    if (post[attribute] && post[attribute].length) {
                        return post[attribute].length;
                    }
                    else {
                        return 0;
                    }
                }
                return post[attribute];
            }
        }
        else {
            return null;
        }
    }

    getChallengeAttribute(attribute) {
        if (this.state.challengeID) {
            let challenge = this.props.cache.challenges[this.state.challengeID];
            if (challenge) {
                if (attribute.substr(attribute.length - 6) === "Length") {
                    attribute = attribute.substr(0, attribute.length - 6);
                    if (challenge[attribute] && challenge[attribute].length) {
                        return challenge[attribute].length;
                    }
                    else {
                        return 0;
                    }
                }
                return challenge[attribute];
            }
        }
        else {
            return null;
        }
    }

    getLoading() {
        if (this.state.isLoading) {
            return (
                <Message icon>
                    <Icon name='spinner' size="small" loading />
                    <Message.Content>
                        <Message.Header>
                            Loading...
                        </Message.Header>
                    </Message.Content>
                </Message>
            )
        }
        return null;
    }

    compare(a, b) {
        const timeCreatedA = this.getPostAttribute(a, "time_created");
        const timeCreatedB = this.getPostAttribute(b, "time_created");

        //(timeCreatedA + " THIS IS IN THE MIDDLE FOR VISIBILITY " + timeCreatedB);

        let comparison = 0;
        if (timeCreatedA > timeCreatedB) {
            comparison = 1;
        } else if (timeCreatedA < timeCreatedB) {
            comparison = -1;
        }
        return comparison;
    }

    handleFilterChange = (e, data) => {
        this.setState({memberSelected: data.value});
    };

    displayFirst() {
        if (this.state.memberSelected !== 'all') {
            return (<Label size='large' as='a' color='purple'>
                First
            </Label>);
        }
    }

    displayLast() {
        if(this.state.memberSelected !== 'all') {
            return (<Label size='large' as='a' color='purple'>
                Latest
            </Label>);
        }
    }

    render() {
        function rows(postIDs, memberSelected, getPostAttribute, compare, firstPosts, lastPosts, challengeMembers) {
            const row = [];
            const rowProps = [];
            let here = this;
            for (const key in postIDs) {
                if (postIDs.hasOwnProperty(key)) {
                    //console.log(JSON.stringify(events[key]));
                    row.push(
                        postIDs[key]
                    );
                    row.sort(compare).reverse();
                }
            }
            // row.sort(function(a,b){return b.time_created.localeCompare(a.time_created)});
            // alert(JSON.stringify(postIDs));
            for (const key in row) {
                //alert(getPostAttribute(row[key], "by"));
                if (memberSelected === 'all' || memberSelected === getPostAttribute(row[key], "by")) {
                    if (row.hasOwnProperty(key) === true) {
                        /*if(firstPosts.includes(row[key])) {
                            rowProps.push(
                                <List.Item key={key}>
                                    <PostCard postID={row[key]} first={true} last={false}/>
                                </List.Item>
                            );
                        }
                        /*
                        if(lastPosts.includes(row[key])) {
                            rowProps.push(
                                <List.Item key={key}>
                                    <PostCard postID={row[key]} first={false} last={true}/>
                                </List.Item>
                            );
                        }
                        else {*/
                        rowProps.push(
                            <List.Item key={key}>
                                <PostCard postID={row[key]}/>
                            </List.Item>
                        );
                    }
                }
            }

            return rowProps;
        }
        return (
            <Fragment>
                {/*alert(JSON.stringify(this.state.challengeMembers))*/}
                <Dropdown fluid selection inverted placeholder='all' defaultValue={this.state.challengeMembers[0]} options={this.state.challengeMembers} onChange={this.handleFilterChange}/>
                {/*console.error("Comment screen render user: " + this.props.curUser)*/}
                {this.getLoading()}
                {/* TODO: This should be removed and replaced at the ChallengeDescriptionModal */}
                {/* <VideoUpload handleAddComment={this.handleAddComment} curUser={this.props.curUser} curUserID={this.props.curUserID}
                                challengeChannel={this.channelName}/> */}
                {this.displayLast()}
                {rows(this.state.loadedPostIDs, this.state.memberSelected, this.getPostAttribute, this.compare, this.state.firstPosts, this.state.lastPosts, this.state.challengeMembers)}
                {this.displayFirst()}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info,
    cache: state.cache
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchChallenge: (id, variableList, dataHandler) => {
            dispatch(fetchChallenge(id, variableList, dataHandler));
        },
        fetchPost: (id, variableList, dataHandler) => {
            dispatch(fetchPost(id, variableList, dataHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionsScreen);