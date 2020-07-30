import React from "react";
import { connect } from "react-redux";
import ThreadTest from "../components/ThreadTest";
import "../assets/scss/threadPage.scss";

class ThreadPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="threadPage">
                <div className="threadPageInner">
                    <ThreadTest />
                </div>
            </div>
        );
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedThreadPage = connect(mapState, actionCreators)(ThreadPage);
export default connectedThreadPage;
