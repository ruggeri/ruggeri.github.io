import $ from 'jquery';
import xss from 'xss';
import showdown from 'showdown';
import React from 'react';

// Relies on highlight.js being loaded on the side.

class Comment extends React.PureComponent {
  constructor(props) {
    super(props);

    this.converter = new showdown.Converter();
    this.textRef = React.createRef();
  }

  componentDidMount() {
    $(this.textRef.current).find('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  }

  render() {
    const { author_name, text } = this.props.comment;
    const html = this.converter.makeHtml(text);

    return (
      <div className="card mb-3">
        <div className="card-body">
          <div className="card-text" dangerouslySetInnerHTML={{__html: xss(html)}} ref={this.textRef} />
        </div>

        <div className="card-footer text-muted">
          {xss(author_name)}
        </div>
      </div>
    );
  }
}

export default Comment;
