import React, { Component } from 'react'
import { List, Message } from 'semantic-ui-react';
import ClientCard from "./ClientCard";
import { connect } from "react-redux";
import {fetchItem} from "../redux_helpers/actions/cacheActions";
import Spinner from "./Spinner";
import {getItemTypeFromID, switchHandleItemType, switchReturnItemType} from "../logic/ItemType";
import TrainerCard from "./TrainerCard";
import EventCard from "./EventCard";
import ChallengeCard from "./ChallengeCard";
import PostCard from "./PostCard";

type Props = {
    ids: [string],
    noObjectsMessage: string,
    acceptedItemTypes?: [string],
    sortFunction?: any
}

class DatabaseObjectList extends Component<Props> {
    state = {
        isLoading: true,
        ids: null,
        objects: [],
        marker: 0
    };

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.ids && this.state.ids !== newProps.ids) {
            // alert("received ids = " + JSON.stringify(newProps.ids));
            this.setState({marker: this.state.marker + 1, isLoading: true, ids: newProps.ids, objects: []}, () => {
                const marker = this.state.marker;
                const addObject = (object) => {
                    if (marker === this.state.marker) {
                        if (object) {
                            this.state.objects.push(object);
                        }
                        this.setState({isLoading: false});
                    }
                };
                for (let i = 0; i < newProps.ids.length; i++) {
                    const id = newProps.ids[i];
                    const itemType = getItemTypeFromID(id);
                    if (!newProps.acceptedItemTypes || newProps.acceptedItemTypes.includes(itemType)) {
                        const variableList = switchReturnItemType(itemType,
                            ["id", "name", "friends", "challengesWon", "scheduledEvents", "profileImagePath", "profilePicture"],
                            ["id", "name", "gender", "birthday", "profileImagePath", "profilePicture", "profileImagePaths"],
                            null, null, null,
                            ["id", "title", "time", "time_created", "owner", "members", "capacity"],
                            ["id", "title", "endTime", "time_created", "owner", "members", "capacity", "difficulty"],
                            null,
                            ["id", "time_created", "by", "item_type", "postType", "about", "description", "videoPaths", "picturePaths"],
                            null, null, null, null,
                            "Get variable list from item type not implemented!");
                        this.props.fetchItem(itemType, id, variableList, addObject);
                    }
                }
            });
        }
    }

    render() {
        function objectComponents(objects, sortFunction) {
            const objectList = [...objects];
            const components = [];
            if (sortFunction) {
                objectList.sort(sortFunction);
            }
            for (const key in objectList) {
                if (objectList.hasOwnProperty(key)) {
                    const id = objectList[key].id;
                    const itemType = objectList[key].item_type;
                    const rank = parseInt(key) + 1;
                    components.push(
                        <List.Item key={key}>
                            {switchReturnItemType(itemType,
                                <ClientCard rank={rank} clientID={id}/>,
                                <TrainerCard rank={rank} trainerID={id}/>,
                                null,
                                null,
                                null,
                                <EventCard eventID={id}/>,
                                <ChallengeCard challengeID={id}/>,
                                null,
                                <PostCard postID={id}/>,
                                null,
                                null,
                                null,
                                null,
                                "Get database object list object not implemented for item type"
                            )}
                        </List.Item>
                    );
                    components.push(switchReturnItemType())
                }
            }
            return components;
        }
        if (this.props.isLoading) {
            return(
                <Spinner/>
            )
        }
        if (this.state.objects.length > 0) {
            return(
                <List relaxed verticalAlign="middle">
                    {objectComponents(this.state.objects, this.props.sortFunction)}
                </List>
            );
        }
        else {
            return(
                <Message>{this.props.noObjectsMessage}</Message>
            );
        }
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchItem: (itemType, id, variableList, dataHandler, failureHandler) => {
            dispatch(fetchItem(itemType, id, variableList, dataHandler, failureHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DatabaseObjectList);
