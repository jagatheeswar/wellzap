import React from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import './Signup.css'
import { Avatar } from '@material-ui/core';

function Signup() {

    const SignupSchema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email address format")
          .required("Email is required"),
        password: Yup.string()
          .min(3, "Password must be 3 characters at minimum")
          .required("Password is required"),
      });
    return (
        <div className="signup">
        <h1>Account Creation</h1>
        <Avatar />
        <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={SignupSchema}
        onSubmit={({ setSubmitting }) => {
          alert("Form is validated! Submitting the form...");
          setSubmitting(false);
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
          <div className="form-group">
          <label htmlFor="Name">Name</label>
          <Field
            type="Name"
            name="Name"
            placeholder="Enter Name"
            className= "form-control input-field"
             
          />
          
        </div>
            <h4 className="signup__heading">Are you an Athlete or a Coach?</h4>

            <div className="form-radiogroup">
              <Field 
              name="decision"
              render = {({ field }) => (
                  <>
                  <div className="radio-item">
                  <input 
                  {...field}
                  id="Athlete"
                  value="Athlete"
                  checked={field.value === 'Athlete'}
                  name="type"
                  type="radio"
                  />
                  <label htmlFor="Athlete">Athlete</label>
                  </div>


                  <div className="radio-item">
                  <input 
                  {...field}
                  id="Coach"
                  value="Coach"
                  checked={field.value === 'Coach'}
                  type="radio"
                  />
                  <label htmlFor="Coach">Coach</label>
                  </div>
                  </>
              )}
              />
            </div>

            <h4 className="signup__heading">Gender</h4>


            <div className="form-radiogroup">
            <Field 
            name="decision"
            render = {({ field }) => (
                <>
                <div className="radio-item">
                <input 
                {...field}
                id="Male"
                value="Male"
                checked={field.value === 'Male'}
                name="type"
                type="radio"
                />
                <label htmlFor="Male">Male</label>
                </div>


                <div className="radio-item">
                <input 
                {...field}
                id="Female"
                value="Female"
                checked={field.value === 'Female'}
                type="radio"
                />
                <label htmlFor="Female">Female</label>
                </div>
                </>
            )}
            />
          </div>

          <div className="form-group">
          <label htmlFor="Phone">Phone</label>
          <Field
            type="Phone"
            name="Phone"
            placeholder="Enter Phone Number"
            className= "form-control input-field"
          />
          </div>

          <div className="form-group">
          <label htmlFor="Address">Address</label>
          <Field
            type="Address"
            name="Address"
            placeholder="Enter Address"
            className= "form-control input-field"   
          />
          </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field
                type="email"
                name="email"
                placeholder="Enter email"
                className={`form-control input-field ${
                  touched.email && errors.email ? "is-invalid" : ""
                }`}
              />
              <ErrorMessage
                component="div"
                name="email"
                className="invalid-feedback"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                name="password"
                placeholder="Enter password"
                className={`form-control input-field ${
                  touched.password && errors.password ? "is-invalid" : ""
                }`}
              />
              <ErrorMessage
                component="div"
                name="password"
                className="invalid-feedback"
              />
            </div>

            <button
              type="submit"
              className="signup__button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Please wait..." : "Sign-in"}
            </button>
          </Form>
        )}
      </Formik>
        </div>
    )
}

export default Signup
