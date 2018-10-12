import '@babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

class Comments extends React.Component {
  constructor() {
    super();

    this.state = {
      comments: []
    };
  }

  async componentDidMount() {
    const url = "https://7n5x5r84kc.execute-api.us-west-2.amazonaws.com/production/comments?post_id=1234";
    const responseBody = await (await fetch(url, { cors: true })).json();
    console.log(responseBody)
    
    this.setState({
      comments: responseBody.comments
    });
  }

  render() {
    const commentEls = this.state.comments.map(c => <li key={c.comment_id}>{c.text}</li>);
    return (
      <div>
        <h1>Comments are cool!</h1>

        <ul>
          {commentEls}
        </ul>
      </div>
    );
  }
}

const commentElement = document.getElementById("comments");

ReactDOM.render(<Comments />, commentElement);
