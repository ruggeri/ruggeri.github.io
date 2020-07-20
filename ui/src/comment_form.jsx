import classNames from 'classnames';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import API from './api.js';
import Comment from './comment.jsx';

class CommentForm extends React.Component {
  constructor(props) {
    super(props);
  }

  async submitForm(formValues) {
    API.submitComment(formValues.commentText);
  }

  renderPreview(formValues) {
    let previewComment = {
      author_github_login: this.props.user.githubLogin,
      author_github_name: this.props.user.githubName,
      text: formValues.commentText,
    };

    if (!previewComment.text) {
      return null;
    }

    return <Comment comment={previewComment} isPreview/>;
  }

  render() {
    return (
      <Formik
        initialValues={{ commentText: "" }}

        validate={values => {
          let errors = {};
          if (values.commentText.length < 5) {
            errors.commentText = "Please provide a longer comment text.";
          }

          return errors;
        }}

        onSubmit={async (values, { resetForm, setSubmitting }) => {
          await this.submitForm(values);
          resetForm();
          setSubmitting(false);
        }}
      >
        {({ errors, isSubmitting, isValid, touched, values }) => (
          <div>
            <Form>
              <div className="form-group">
                <label htmlFor="commentText" className="form-control-label">Comment Text</label>
                <Field
                  component={CustomTextareaComponent}
                  name="commentText"
                  className={classNames({"form-control": true, "is-invalid": errors.commentText && touched.commentText })} />
                <ErrorMessage name="commentText" component="div" className="invalid-feedback"/>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isValid }
                className={classNames({ "btn": true, "btn-primary": isValid, "btn-secondary": !isValid })}>
                Create comment!
              </button>
            </Form>

            {this.renderPreview(values)}
          </div>
        )}
      </Formik>
    );
  }
}

const CustomTextareaComponent = ({
  field,
  form,
  ...props
}) => (
    <TextareaAutosize type="text" {...field} {...props} />
);

export default CommentForm;
