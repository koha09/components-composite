const { CATEGORIES_FETCH, CART_ADD, CART_REMOVE } = require("./actionTypes")

export const addCart = (product) => {
    return {
        type: CART_ADD,
        payload: product
    }
}
export const removeCart = (product) => {
    return {
        type: CART_REMOVE,
        payload: product
    }
}

export const fetchCategories = () => {
    return (dispatch) => {
        fetch('/wp-json/constructor/v1/get-categories')
            .then((response) => response.json())
            .then((data) => {
                dispatch({
                    type: CATEGORIES_FETCH,
                    payload: data
                })
            })
    }
}