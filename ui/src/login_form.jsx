import classnames from 'classnames';
import React from 'react';
import User from './user.js';

class LoginForm extends React.Component {
  beginLogin() {
    User.beginLogin();
  }

  render() {
    return (
      <div>
        <button
          className={classnames('btn', 'btn-primary', 'mb-3')}
          onClick={this.beginLogin}>
          Login via Github to leave a comment!
        </button>
      </div>
    );
  }
}

export default LoginForm;
