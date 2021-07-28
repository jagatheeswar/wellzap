import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  selectUser,
  selectUserType,
  selectUserVerified,
  setUserType,
  setUserVerified,
} from "../../features/userSlice";
import "./Login.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { auth, db } from "../../utils/firebase";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address format")
    .required("Email is required"),
  password: Yup.string()
    .min(3, "Password must be 3 characters at minimum")
    .required("Password is required"),
});

function Login() {
  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);
  const userVerified = useSelector(selectUserVerified);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginUser = (values) => {
    console.log("Logging on ...", values.email, values.password);
    auth
      .signInWithEmailAndPassword(values.email, values.password)
      .then((auth) => {
        db.collection("coaches")
          .where("email", "==", values.email)
          .get()
          .then((snap) => {
            if (!snap.empty) {
              setLoading(true);
              setTimeout(() => {
                dispatch(setUserType("coach"));
                dispatch(login(auth.user.email));
              }, 1000);
            } else {
              db.collection("athletes")
                .where("email", "==", values.email)
                .get()
                .then((snap) => {
                  if (!snap.empty) {
                    setLoading(true);

                    setTimeout(() => {
                      snap.forEach(function (doc) {
                        dispatch(setUserVerified(doc.data().verified));
                      });

                      dispatch(setUserType("athlete"));
                      dispatch(login(auth.user.email));
                    }, 1000);
                  } else {
                    alert("Check your email and password");
                  }
                });
            }
          });
      })
      .catch((e) => alert(e.message));
  };

  function forgotPass() {
    console.log("Clicked on forgot password");
  }

  return (
    <div className="login__container">
      <img />
      <h1>Login</h1>
      <h3>Welcome Back!</h3>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values, { setSubmitting }) => {
          // alert("Form is validated! Submitting the form...");
          values.email = values.email.toLowerCase();
          loginUser(values);
          setSubmitting(false);
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form className="form">
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

            <h6 className="login__heading">Forgot password?</h6>

            <button
              type="submit"
              className="login__button"
              disabled={isSubmitting}
            >
              Login
            </button>
            <h6 className="login__heading">New to Wellzap?</h6>
            <Link className="signup-link" to="/signup">
              Create Account
            </Link>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
