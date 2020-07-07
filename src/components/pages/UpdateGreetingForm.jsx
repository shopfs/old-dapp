import React, { useState } from "react";
import { connect } from "react-redux";
import { contractActions } from "../../actions";

const UpdateGreetingForm = ({ setGreeting, afterSubmit }) => {
    const [greeting, setGreetingText] = useState("");

    return (
        <section>
            <input
                type="text"
                placeholder="new greeting"
                value={greeting}
                onChange={e => setGreetingText(e.target.value)}
            />
            <button
                onClick={async e => {
                    await setGreeting(greeting);
                    afterSubmit();
                }}
            >
                Update Greeting
            </button>
        </section>
    );
};

function mapState(state) {
    return {};
}

const actionCreators = {
    setGreeting: contractActions.setGreeting
};

const connectedUpdateGreetingForm = connect(
    mapState,
    actionCreators
)(UpdateGreetingForm);

export default connectedUpdateGreetingForm;
