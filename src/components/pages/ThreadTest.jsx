import React, { useState } from "react";
import { connect } from "react-redux";
import { boxActions } from "../../actions";

const ThreadTest = ({ createThread, addModerator, postMessage }) => {

    const [member, setMember] = useState("");
    const [message, setMessage] = useState("");
    return (
        <section className="threadTest">
            <button
                onClick={async e => {
                    await createThread();
                }}
            >
                Create Thread
            </button>
            <input
                type="text"
                placeholder="address/DID"
                value={member}
                onChange={e => setMember(e.target.value)}
            />
            <button
                onClick={async e => {
                    await addModerator(member);
                    setMember("")
                }}
            >
                Add moderator
            </button>
            <input
                type="text"
                placeholder="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
            />
            <button
                onClick={async e => {
                    await postMessage(message);
                    setMessage("")
                }}
            >
                Post message
            </button>
        </section>
    );
};

function mapState(state) {
    return {};
}

const actionCreators = {
    createThread: boxActions.createThread,
    addModerator: boxActions.addModerator,
    postMessage: boxActions.postMessage
};

const connectedThreadTest = connect(
    mapState,
    actionCreators
)(ThreadTest);

export default connectedThreadTest;
