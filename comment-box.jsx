/**
 * @jsx React.DOM
 */
var request = superagent;
// The above declaration must remain intact at the top of the script.
var CommentModel = Backbone.Model.extend({

});
var Comments = Backbone.Collection.extend({
  model: CommentModel,
  url: 'comments.json',
  initialize: function() {
    this.fetch();
  },
});
var comments = new Comments;

var CommentBoxMixin = {
  handleCommentSubmit: function(data) {
    var comment = new CommentModel;
    comment.set({
      author: data.author,
      text: data.text
    });
    this.props.comments.add(comment);
  },
  getInitialState: function() {
    return {data: [], layout: false};
  },
  componentWillMount: function() {
    var self = this;
    this.props.comments.on('all', function() {
      self.setState({data: self.props.comments.models});
    });
  }
};
var CommentBoxStandard = React.createClass({
  mixins: [CommentBoxMixin],
  render: function() {
    return (
      <div className="commentBox row">
        <div className="col-md-4">
          <h1>DICKBOX</h1>
          <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        </div>
        <div className="col-md-8">
          <CommentList data={this.state.data} />
        </div>
      </div>
    );
  }
})
var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return <Comment author={comment.attributes.author}>{comment.attributes.text}</Comment>;
    });
    return (
      <table className="commentList table">
        <thead>
          <th>Name</th>
          <th>Comment</th>
        </thead>
        <tbody>
          {commentNodes}
        </tbody>
      </table>
    );
  }
});
var CommentForm = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim(),
      text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return false;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return false;
  },
  derp: function() {
    alert("HI");
    return false;
  },
  render: function() {
    return (
      <form className="commentForm" role="form" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input className="form-control" type="text" placeholder="Your Name" ref="author" />
        </div>
        <div className="form-group">
          <textarea className="form-control" type="text" placeholder="Spit it out..." ref="text" />
        </div>
        <input className="btn btn-default" type="submit" value="Post" />
      </form>
    );
  }
});
var converter = new Showdown.converter();
var Comment = React.createClass({
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <tr className="comment">
        <th className="commentAuthor">
          {this.props.author}
        </th>
        <td className="commentText" dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </tr>
    );
  }
});
React.initializeTouchEvents();
React.renderComponent(
  <CommentBoxStandard comments={comments} />,
  document.getElementById('content')
);
React.renderComponent(
  <CommentBoxStandard comments={comments} />,
  document.getElementById('content2')
);