import React from 'react'
import ReactDOM from 'react-dom'
import Configurator from './components/Configurator'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore } from 'redux'
import rootReducer from './redux/rootReducer'
import thunk from 'redux-thunk' 
import { fetchCategories } from './redux/actions'

const store = createStore(rootReducer, compose(
        applyMiddleware(thunk)
        //,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        )
    )
store.dispatch(fetchCategories())

ReactDOM.render(
    <Provider store={store}>
        <Configurator/>
    </Provider>,
    document.getElementById('configuration')
)
