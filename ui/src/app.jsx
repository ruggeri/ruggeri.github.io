import '@babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Comments from './comments.jsx';
import User from './user';

window.User = User;
if (User.maybeFinishLogin()) {
  console.log("Trying to login...");
} else {
  const commentElement = document.getElementById("comments");
  ReactDOM.render(<Comments />, commentElement);
}
