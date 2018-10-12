import '@babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Comments from './comments.jsx';

const commentElement = document.getElementById("comments");
ReactDOM.render(<Comments />, commentElement);