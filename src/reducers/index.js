import {applyMiddleware, combineReducers, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import userReducer from "./userReducer";
import trackReducer from "./trackReducer";

const rootReducer = combineReducers({
    user: userReducer,
    tracks: trackReducer,
})

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))