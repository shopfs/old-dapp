import { alertActions } from "./";
import { contractConstants } from "../constants";
import { contractService } from "../services";

export const contractActions = {
    clean,
    getGreeting,
    setGreeting
};

function clean() {
    return dispatch => {
        dispatch({
            type: contractConstants.CLEAN
        });
    };
}

function getGreeting() {
    return async (dispatch, getState) => {
        dispatch(started());
        let greeting;
        try {
            const { account, contract } = getState().web3;
            greeting = await contractService.getGreeting(contract, account);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Getting Greeting"));
            return;
        }
        dispatch(result({ data: { greeting } }));

        return greeting;
    };
}

function setGreeting(greeting) {
    return async (dispatch, getState) => {
        dispatch(started());
        let data;
        try {
            const { account, contract } = getState().web3;
            data = await contractService.setGreeting(
                contract,
                account,
                greeting
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Setting Greeting"));
            return;
        }
        if (!data.error) {
            dispatch(alertActions.success("Successfully Set Greeting"));
            dispatch(done());
        } else {
            dispatch(failure(data.error));
            dispatch(
                alertActions.error("Error Setting Greeting: " + data.error)
            );
        }
    };
}

function started() {
    return {
        type: contractConstants.STARTED
    };
}

function done() {
    return {
        type: contractConstants.DONE
    };
}

function cleanSelected(result) {
    return {
        type: contractConstants.CLEAN_SELECTED,
        ...result
    };
}

function result(result) {
    return {
        type: contractConstants.RESULT,
        ...result
    };
}

function failure(error) {
    return {
        type: contractConstants.ERROR,
        error
    };
}
