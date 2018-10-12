import classNames from 'classnames';
import API from './api.js';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const PLACEHOLDER_NAMES = [
  "Leonhard Euler",
  "Emmy Noether",
  "Srinivasa Ramanujan",
];

class CommentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      placeholderName: PLACEHOLDER_NAMES[Math.floor(Math.random() * PLACEHOLDER_NAMES.length)],
    }
  }

  async submitForm(comment) {
    API.submitComment(comment);
  }

  render() {
    return (
      <Formik
        initialValues={{ author_name: "", text: "" }}

        validate={values => {
          let errors = {};
          if (!values.author_name) {
            errors.author_name = "Please provide an author name.";
          }
          if (values.text.length < 5) {
            errors.text = "Please provide a longer comment text.";
          }

          return errors;
        }}

        onSubmit={async (values, { resetForm, setSubmitting }) => {
          await this.submitForm(values);
          resetForm();
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, isValid, errors, touched }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="author_name" className="form-control-label">Author Name</label>
              <Field
                type="text"
                name="author_name"
                className={classNames({ "form-control": true, "is-invalid": errors.author_name && touched.author_name })}
                placeholder={this.state.placeholderName} />
              <ErrorMessage name="author_name" component="div" className="invalid-feedback"/>
            </div>

            <div className="form-group">
              <label htmlFor="text" className="form-control-label">Comment Text</label>
              <Field
                component="textarea"
                name="text"
                className={classNames({"form-control": true, "is-invalid": errors.text && touched.text })} />
              <ErrorMessage name="text" component="div" className="invalid-feedback"/>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValid }
              className={classNames({ "btn": true, "btn-primary": isValid, "btn-secondary": !isValid })}>
              Create comment!
            </button>
          </Form>
        )}
      </Formik>
    );
  }
}

export default CommentForm;
