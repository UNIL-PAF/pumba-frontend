import { combineReducers } from 'redux'
import loadProteinReducer from './loadProtein'

const rootReducer = combineReducers({
    loadProtein: loadProteinReducer,
})

export default rootReducer
