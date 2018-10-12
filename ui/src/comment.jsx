import xss from 'xss';
import showdown from 'showdown';
import React from 'react';

class Comment extends React.PureComponent {
  constructor(props) {
    super(props);

    this.converter = new showdown.Converter();
  }

  render() {
    const { author_name, text } = this.props.comment;
    const html = this.converter.makeHtml(text);

    return (
      <div className="card mb-3">
        <div className="card-body">
          <div className="card-text" dangerouslySetInnerHTML={{__html: xss(html)}} />
        </div>

        <div className="card-footer text-muted">
          {xss(author_name)}
        </div>
      </div>
    );
  }
}

export default Comment;
