import ThreeBoxComments from "3box-comments-react";
import { getThreadName } from "../helpers";
import { boxConstants } from "../constants";
import { connect } from "react-redux";
import React from "react";

const Comments = ({ fileId, metadataHash, box, account }) => {
    return (
        <ThreeBoxComments
            spaceName={boxConstants.SPACE_NAME}
            threadName={getThreadName(fileId, metadataHash)}
            adminEthAddr={boxConstants.ADMIN_ACCOUNT}
            box={box}
            currentUserAddr={account}
            showCommentCount={10}
            useHovers={true}
            userProfileURL={address =>
                `{window.location.protocol}//${window.location.host}/users/${address}`
            }
        />
    );
};

function mapState(state) {
    const { box } = state.box;
    const { account } = state.web3;
    return { box, account };
}

const actionCreators = {};

const connectedComments = connect(mapState, actionCreators)(Comments);

export default connectedComments;
