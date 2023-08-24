import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const RegistrationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  // Add additional client-specific fields and validation here
});

function Registration() {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('/api/register', values); // Adjust the API endpoint

      if (response.status === 201) {
        // Registration successful, you can show a success message
        console.log('Registration successful');
        resetForm();
      } else {
        // Handle other status codes or errors
        console.error('Registration failed');
      }
    } catch (error) {
      // Handle network errors or other issues
      console.error('Error:', error);
    }

    setSubmitting(false);
  };

  return (
    <div>
      <h2>Registration</h2>
      <Formik
        initialValues={{
          email: '',
          password: '',
          // Add initial values for additional fields here
        }}
        validationSchema={RegistrationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="email">Email</label>
              <Field type="text" name="email" />
              <ErrorMessage name="email" component="div" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" />
            </div>
            {/* Add additional fields and error messages here */}
            <div>
              <button type="submit" disabled={isSubmitting}>
                Register
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Registration;
