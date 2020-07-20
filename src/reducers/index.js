import { combineReducers } from "redux";
import { alert } from "./alert.reducer";
import { web3 } from "./web3.reducer";
import { box } from "./3box.reducer";
import { user } from "./user.reducer";

const appReducer = combineReducers({
    alert,
    web3,
	box,
    user
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;
