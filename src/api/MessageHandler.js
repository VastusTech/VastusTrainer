// import Lambda from "./Lambda";
// import QL from "./GraphQL";

/*
Messages:

New Table: Messages
    ( board, id, time_created, from, type, message )

    Things we need to be able to do on it.
        * Query for messages a message "board"
            * Query on the time_created index so that we get the most recent messages first
        * Create a new message "board"
        * Add a message to a message board
        * Find a board from the people who are involved in it.
            * TODO WE SHOULD SORT THE LIST OF IDs ALPHABETICALLY SO THAT IT'S DETERMINISTIC
        *
 */

class MessageHandler {
    /*
    There are three kinds of boards.
    * Direct Message boards (id_id where the ids are the two ids in the chat, in alphabetical order.)
    * Group Message board (id_id_id_... where the ids are the participants, in alphabetical order.)
    * Challenge Message board (id where id is the id of the Challenge.)
    * Event Message board (id where id is the id of the Event.)
    * ???? More use cases than this? ????
     */
    static getBoard(ids) {
        // TODO Do some checking?
        let board = "";
        // Sort the ids alphabetically
        ids.sort((a, b) => {
            if (a > b) {
                return 1;
            }
            else if (a < b) {
                return -1;
            }
            return 0;
        });
        for (let i = 0; i < ids.length; i++) {
            if (i !== 0) {
                board += "_";
            }
            board += ids[i];
        }
        return board;
    }
    static sendMessage(board, from, type, message) {
    }
    static getMessage(board, id) {
    }
}

export default MessageHandler;
