import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

//When I need to learn more about Routing to pages I can look here
//https://github.com/reactjs/react-router-tutorial/tree/master/lessons/03-navigating-with-link

// OR
// var result = sass.renderSync({
//   data: './styles/App.css'
// });

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
