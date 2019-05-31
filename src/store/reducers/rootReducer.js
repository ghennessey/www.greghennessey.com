import { combineReducers } from 'redux'
import homePageReducer from './homePageReducer'
import menuReducer from './menuReducer'
import siteReducer from './siteReducer';
import aboutReducer from './aboutReducer'
import blogReducer from './blogReducer'

const rootReducer = combineReducers({
    blog: blogReducer,
    home: homePageReducer,
    menu: menuReducer,
    site: siteReducer,
    about: aboutReducer,
});

export default rootReducer