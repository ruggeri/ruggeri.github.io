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
    const { author_name, text, created_at } = this.props.comment;
    const html = this.converter.makeHtml(text);

    return (
      <div className="card mb-3">
        <div className="card-body">
          <div className="card-text" dangerouslySetInnerHTML={{__html: xss(html)}} ref={this.textRef} />
        </div>

        <div className="card-footer text-muted">
          {xss(author_name)}

          <span className="float-right">{this.props.isPreview ? "(preview)" : created_at }</span>
        </div>
      </div>
    );
  }
}

export default Comment;
