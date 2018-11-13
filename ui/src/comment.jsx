import $ from 'jquery';
import { DateTime } from 'luxon';
import React from 'react';
import showdown from 'showdown';
import xss from 'xss';

// Relies on highlight.js being loaded on the side.

class Comment extends React.PureComponent {
  constructor(props) {
    super(props);

    this.converter = new showdown.Converter();
    this.textRef = React.createRef();
  }

  highlight() {
    $(this.textRef.current).find('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  }

  componentDidMount() {
    this.highlight();
  }

  componentDidUpdate() {
    this.highlight();
  }

  render() {
    const { author_github_name, author_github_login, text, created_at } = this.props.comment;
    const author_name = author_github_name ? author_github_name : author_github_login;

    const html = this.converter.makeHtml(text);

    const datestring = DateTime.fromISO(created_at).toLocal().toFormat("ccc, d LLL yyyy hh:mm a");

    return (
      <div className="card mb-3">
        <div className="card-body">
          <div className="card-text" dangerouslySetInnerHTML={{__html: xss(html)}} ref={this.textRef} />
        </div>

        <div className="card-footer text-muted">
          {xss(author_name)}

          <span className="float-right">{this.props.isPreview ? "(preview)" : datestring }</span>
        </div>
      </div>
    );
  }
}

export default Comment;
