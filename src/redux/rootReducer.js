import { combineReducers } from "redux";
import { CART_ADD, CART_REMOVE, CATEGORIES_FETCH } from "./actionTypes";

const categoryReducer = (state=[],action) => {
    if(action.type === CATEGORIES_FETCH){
        return action.payload
    }
    return state
}
const cartReducer = (state=[],action) => {
    switch(action.type){
        case CART_ADD: 
            return [...state, action.payload]
        case CART_REMOVE:
            return state.filter((it) => it.name !== action.payload.name)
        default:
            return state
    }
}
export default combineReducers(
    {
        categories: categoryReducer,
        cart: cartReducer
    }
)