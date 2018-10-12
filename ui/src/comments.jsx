import React from 'react';
import Comment from './/comment.jsx';
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
      // Copy and sort in reverse order.
      comments = comments.slice();
      comments.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        } else if (a.created_at == b.created_at) {
          return 0;
        } else {
          return +1;
        }
      });

      this.setState({
        comments,
      });
    });

    API.fetchComments();
  }

  render() {
    const commentEls = this.state.comments.map(
      c => <Comment comment={c} key={c.comment_id} />
    );

    return (
      <div>
        <h1>Comments</h1>

        <CommentForm />

        <div>
          {commentEls}
        </div>
      </div>
    );
  }
}

export default Comments;
