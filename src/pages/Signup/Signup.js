import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Signup.css";
import { Avatar } from "@material-ui/core";
import { db, auth } from "../../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  login,
  setUserVerified,
  setUserType,
} from "../../features/userSlice";
import { useHistory } from "react-router";

function Signup() {
  const [isLoading, setisLoading] = useState(false);
  const [error, seterror] = useState(false);
  const [pin, setPin] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const phoneRegExp =
    /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid nk email address format")
      .required("Email is required"),
    password: Yup.string()
      .min(3, "Password must be 3 characters at minimum")
      .required("Password is required"),
    phone: Yup.string()
      .matches(phoneRegExp, "Phone number is not valid")
      //.min(3, "Password must be 3 characters at minimum")
      .required("Phone number is required"),
    height: Yup.string()
      .matches(/^[0-9\b]+$/, "Phone number is not valid")
      //.min(3, "Password must be 3 characters at minimum")
      .required("Phone number is required"),
    weight: Yup.string()
      .matches(/^[0-9\b]+$/, "Phone number is not valid")
      //.min(3, "Password must be 3 characters at minimum")
      .required("Phone number is required"),
  });
  return (
    <div className="signup">
      <h1>Account Creation</h1>
      <Avatar />
      <Formik
        initialValues={{
          email: "",
          password: "",
          password2: "",
          name: "",
          phone: "",
          address: "",
          date: "",
          gender: "",
          userType: "",
          height: 0,
          weight: 0,
        }}
        validationSchema={SignupSchema}
        onSubmit={(values) => {
          alert("Form is validated! Submitting the form...");
          console.log(values);
          if (values.userType === "athlete") {
            console.log(2);

            auth
              .createUserWithEmailAndPassword(values.email, values.password)
              .then((auth) => {
                console.log(1);
                dispatch(login(auth.user.email));
                dispatch(setUserType("athlete"));
                dispatch(setUserVerified(false));

                db.collection("athletes")
                  .add({
                    name: values.name,
                    phone: values.phone,
                    email: values.email,
                    gender: values.gender,
                    dob: values.date,
                    address: values.address,
                    imageUrl: "",
                    sports: [],
                    verified: false,
                    height: values.height,
                    weight: values.weight,
                    completedWorkouts: 0,
                    averageWorkoutTime: 0,
                    goalsMet: 0,
                    diet: {
                      name: "weight maintainance",
                      carbs: 3.5 * values.weight,
                      protein: 1.5 * values.weight,
                      fat: 1 * values.weight,
                      calories:
                        4 * 3.5 * values.weight +
                        4 * 1.5 * values.weight +
                        9 * 1 * values.weight,
                    },

                    listOfAthletes: [],
                  })
                  .then(() => {
                    history.push("/");
                  })
                  .catch((e) => {
                    console.log(e);
                  });

                //history.push("CoachFlow");
                //navigation.navigate("CoachInfo");

                //dispatch(setUserDetails(auth.user));
                setisLoading(false);
                alert("created");
              })

              .catch((e) => {
                setisLoading(false);
                seterror(true);
                console.log(e);
                alert(e.message);
              });
          }

          if (values.userType === "coach") {
            auth
              .createUserWithEmailAndPassword(values.email, values.password)
              .then((auth) => {
                db.collection("coaches").add({
                  name: values.name,
                  phone: values.phone,
                  email: values.email,
                  gender: values.gender,
                  dob: values.date,
                  address: values.address,
                  pin: pin,
                  imageUrl: "",
                  sports: [],
                  videolink: "https://meet.jit.si/wellzap-" + pin,
                  listOfAthletes: [],
                });

                db.collection("counter")
                  .doc("nPT9xINm51aJYqU3UOqI")
                  .update({
                    count: pin + 1,
                  });
                dispatch(login(auth.user.email));
                dispatch(setUserType("coach"));
                history.push("/");
                //navigation.navigate("CoachInfo");

                //dispatch(setUserDetails(auth.user));
              })
              .catch((e) => {
                seterror(e.message);
                alert(e.message);
              });
          }
          //   setisLoading(true);
          //   console.log(values);
          //   // alert("Form is validated! Submitting the form...");
          //   auth

          //
        }}
      >
        {({ touched, errors, isSubmitting, values }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="Name">Name</label>
              <Field
                type="name"
                name="name"
                placeholder="Enter Name"
                className="form-control input-field"
              />
            </div>
            <h4 className="signup__heading">Are you an Athlete or a Coach?</h4>

            <div className="form-radiogroup">
              <Field
                name="decision"
                render={({ field }) => (
                  <>
                    <div className="radio-item">
                      <input
                        {...field}
                        id="athlete"
                        value="athlete"
                        // checked={field.value === "Athlete"}
                        name="userType"
                        type="radio"
                      />
                      <label htmlFor="Athlete">Athlete</label>
                    </div>

                    <div className="radio-item">
                      <input
                        {...field}
                        id="coach"
                        value="coach"
                        // checked={field.value === "Coach"}
                        type="radio"
                        name="userType"
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
                render={({ field }) => (
                  <>
                    <div className="radio-item">
                      <input
                        {...field}
                        id="Male"
                        value="Male"
                        // checked={field.value === "Male"}
                        name="gender"
                        type="radio"
                      />
                      <label htmlFor="Male">Male</label>
                    </div>

                    <div className="radio-item">
                      <input
                        {...field}
                        id="Female"
                        value="Female"
                        // checked={field.value === "Female"}
                        type="radio"
                        name="gender"
                      />
                      <label htmlFor="Female">Female</label>
                    </div>
                  </>
                )}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <Field
                type="phone"
                name="phone"
                placeholder="Enter Phone Number"
                className="form-control input-field"
              />
              {touched.phone && errors.phone}
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <Field
                type="address"
                name="address"
                placeholder="Enter Address"
                className="form-control input-field"
              />
            </div>
            {values.userType == "athlete" && (
              <div className="form-group">
                <label htmlFor="height">Height</label>
                <Field
                  type="height"
                  name="height"
                  placeholder="Enter Height"
                  className="form-control input-field"
                />
                {touched.height && errors.height}

                <label htmlFor="weight">Weight</label>
                <Field
                  type="weight"
                  name="weight"
                  placeholder="Enter Weight"
                  className="form-control input-field"
                />
                {touched.weight && errors.weight}
              </div>
            )}

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
              onClick={() => {
                console.log(values);
              }}
            >
              {isSubmitting ? "Please wait..." : "SignUp"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Signup;
