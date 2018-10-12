import React from 'react';
import CommentForm from './comment_form.jsx';
import API from './api.js';

class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: []
    };
  }

  componentDidMount() {
    API.listenForComments((comments) => {
      // Copy and sort.
      comments = comments.slice();
      comments.sort((a, b) => a.created_at > b.created_at);

      this.setState({
        comments,
      });
    });

    API.fetchComments();
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
