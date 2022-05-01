import {applyMiddleware, combineReducers, createStore} from "redux";
import reducer from "./reducers/auth";
import thunk from "redux-thunk";

const RootReducers = combineReducers({
    reducer
})

export const store = createStore(RootReducers, applyMiddleware(thunk))
