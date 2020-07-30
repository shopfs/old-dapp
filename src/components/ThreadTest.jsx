import React, { useState } from "react";
import { connect } from "react-redux";
import { boxActions } from "../../actions";

const ThreadTest = ({
    createThread,
    createConfidentialThread,
    addModerator,
    postMessage,
    joinThread,
    getPosts,
    data
}) => {
    const [threadName, setThreadName] = useState("");
    const [member, setMember] = useState("");
    const [orbitdbAddress, setOrbitdbAddress] = useState("");
    const [message, setMessage] = useState("");
    const { posts } = data;
    return (
        <section className="threadTest">
            <div>
                <input
                    type="text"
                    placeholder="threadName"
                    value={threadName}
                    onChange={e => setThreadName(e.target.value)}
                />
                <button
                    onClick={async e => {
                        await createThread(threadName);
                        await getPosts();
                        setThreadName("");
                    }}
                >
                    Create Public Thread
                </button>
                <button
                    onClick={async e => {
                        await createConfidentialThread(threadName);
                        await getPosts();
                        setThreadName("");
                    }}
                >
                    Create Confidential Thread
                </button>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="orbitdbAddress"
                    value={orbitdbAddress}
                    onChange={e => setOrbitdbAddress(e.target.value)}
                />
                <button
                    onClick={async e => {
                        await joinThread(orbitdbAddress);
                        setOrbitdbAddress("");
                        await getPosts();
                    }}
                >
                    Join Thread
                </button>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="address/DID"
                    value={member}
                    onChange={e => setMember(e.target.value)}
                />
                <button
                    onClick={async e => {
                        await addModerator(member);
                        setMember("");
                    }}
                >
                    Add moderator
                </button>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
                <button
                    onClick={async e => {
                        await postMessage(message);
                        setMessage("");
                        await getPosts();
                    }}
                >
                    Post message
                </button>
            </div>
            <div>
                {posts &&
                    posts.map(post => <p key={post.postId}>{post.message}</p>)}
            </div>
        </section>
    );
};

function mapState(state) {
    const { data } = state.box;
    return { data };
}

const actionCreators = {
    createThread: boxActions.createThread,
    createConfidentialThread: boxActions.createConfidentialThread,
    joinThread: boxActions.joinThread,
    addModerator: boxActions.addModerator,
    postMessage: boxActions.postMessage,
    getPosts: boxActions.getPosts
};

const connectedThreadTest = connect(mapState, actionCreators)(ThreadTest);

export default connectedThreadTest;
