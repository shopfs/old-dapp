import { combineReducers } from "redux";
import { alert } from "./alert.reducer";
import { web3 } from "./web3.reducer";
import { box } from "./3box.reducer";
import { daemon } from "./daemon.reducer";
import { contract } from "./contract.reducer";

const appReducer = combineReducers({
    alert,
    web3,
	box,
	daemon,
    contract
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;
