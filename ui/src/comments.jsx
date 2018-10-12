import React from 'react';
import CommentForm from './comment_form.jsx';
import Config from './config.js';

class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: []
    };
  }

  async componentDidMount() {
    const url = `${Config.BASE_URL}?entry_id=${entryId}`;
    const responseBody = await (await fetch(url, { cors: true })).json();
    console.log(responseBody)
    
    this.setState({
      comments: responseBody.comments
    });
  }

  render() {
    const commentEls = this.state.comments.map(
      c => <li key={c.comment_id}>{c.text}</li>
    );

    return (
      <div>
        <h1>Comments are cool!</h1>

        <CommentForm />

        <ul>
          {commentEls}
        </ul>
      </div>
    );
  }
}

export default Comments;
