import { numPrefix } from "./Constants";

const ItemType = {
    Client: "Client",
    Trainer: "Trainer",
    Gym: "Gym",
    Workout: "Workout",
    Review: "Review",
    Event: "Event",
    Invite: "Invite",
};

export function getItemTypeFromID(id) {
    const prefix = id.substring(0, numPrefix);
    const itemTypeKeys = Object.keys(ItemType);
    for (let i = 0; i < itemTypeKeys.length; i++) {
        const type = itemTypeKeys[i];
        if (prefix === (type.substring(0, numPrefix).toUpperCase())) {
            return type;
        }
    }
    return null;
}

export default ItemType;