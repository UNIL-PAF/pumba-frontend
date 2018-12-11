import { AppContainer } from 'react-hot-loader'
import { createBrowserHistory } from 'history'
import React from 'react';
import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import './styles/index.css';
import './styles/App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import rootReducer from './reducers'
import {connectRouter, routerMiddleware} from "connected-react-router";

const history = createBrowserHistory()

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
    connectRouter(history)(rootReducer),
    composeEnhancer(
        applyMiddleware(
            routerMiddleware(history),
            thunk
        ),
    ),
)

const render = () => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <App history={history} />
            </Provider>
        </AppContainer>,
        document.getElementById('root')
    )
}

render()

registerServiceWorker();

// Hot reloading
if (module.hot) {
    // Reload components
    module.hot.accept('./App', () => {
        render()
    })

    // Reload reducers
    module.hot.accept('./reducers', () => {
        store.replaceReducer(connectRouter(history)(rootReducer))
    })
}
