import { combineReducers } from 'redux'
import homePageReducer from './homePageReducer'
import menuReducer from './menuReducer'
import siteReducer from './siteReducer';
import aboutReducer from './aboutReducer'
import blogReducer from './blogReducer'
import blogPostReducer from './blogPostReducer'

const rootReducer = combineReducers({
    blog: blogReducer,
    home: homePageReducer,
    menu: menuReducer,
    post: blogPostReducer,
    site: siteReducer,
    about: aboutReducer,
});

export default rootReducer