import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Notification from "../../Components/Notifications/Notification";
import {
  selectUser,
  selectUserData,
  selectUserType,
  setUserData,
  selectUserVerified,
  setUserVerified,
  logout,
} from "../../features/userSlice";
import { db, auth } from "../../utils/firebase";
import Header from "../../Components/Header/Header";
import firebase from "firebase";
import "./Profile.css";

import { useHistory } from "react-router";
import CloseIcon from "@material-ui/icons/Close";

import moment from "moment";
import { Dialog, Grid } from "@material-ui/core";

function AthleteOnBoarding(props) {
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();
  const userVerified = useSelector(selectUserVerified);
  const [athleteDetails, setAthleteDetails] = useState([]);
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const [userDetails, setUserDetails] = useState(null);
  const [coachpin, setcoachpin] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [coachData, setCoachData] = useState(null);
  const [verified, setVerified] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    if (userVerified) {
      //setVerifiedModal(false);
      //navigation.navigate("AthleteFlow");
    }
    db.collection("athletes")
      .where("email", "==", user)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          setUserDetails({
            id: doc.id,
            data: doc.data(),
          });
          dispatch(
            setUserData({
              id: doc.id,
              data: doc.data(),
            })
          );
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }, [user]);

  const verifyUser = () => {
    db.collection("athletes")
      .where("email", "==", user)
      .get()
      .then((snap) => {
        if (!snap.empty) {
          snap.forEach(function (doc) {
            if (doc.data().verified) {
              dispatch(setUserVerified(true));
              history.push("/");
              //props.reload(!props.active);

              //setVerified(true);
              //navigation.navigate("AthleteFlow");
              // setVerifiedModal(false);
            } else {
              alert("Athlete not linked to any coach");
            }
          });
        }
      });
  };

  const signout = () => {
    setExit(true);
    setVerified(true);
    dispatch(logout());
    history.push("/login");
  };

  const sendInvite = () => {
    db.collection("invites")
      .where("athlete", "==", userDetails.id)
      .get()
      .then((snap) => {
        if (!snap.empty) {
          snap.forEach(function (doc) {
            db.collection("invites").doc(doc.id).delete();
          });
          db.collection("coaches")
            .where("pin", "==", parseInt(coachpin))
            .get()
            .then(function (querySnapshot) {
              if (querySnapshot.empty) {
                alert("Invalid Coach pin number");
              } else {
                querySnapshot.forEach(function (doc) {
                  setCoachData({
                    id: doc.id,
                    data: doc.data(),
                  });

                  db.collection("invites").add({
                    coach: doc.id,
                    athlete: userDetails.id,
                    name: userDetails.data.name,
                    imageUrl: userDetails.data.imageUrl,
                    email: user,
                    phone: userDetails.data.phone,
                  });
                  alert("Invite Sent");
                  setInviteSent(true);

                  db.collection("CoachNotifications")
                    .doc(doc.id)
                    .collection("notifications")
                    .add(
                      {
                        message: `${userDetails?.data?.name} has sent a request to be your athlete! `,
                        seen: false,
                        timestamp:
                          firebase.firestore.FieldValue.serverTimestamp(),
                        athlete_id: userDetails.id,
                      },
                      { merge: true }
                    );
                });
              }
            })
            .catch(function (error) {
              console.log("Error getting documents: ", error);
            });
        } else {
          db.collection("coaches")
            .where("pin", "==", parseInt(coachpin))
            .get()
            .then(function (querySnapshot) {
              if (querySnapshot.empty) {
                alert("Invalid Coach pin number");
              } else {
                querySnapshot.forEach(function (doc) {
                  setCoachData({
                    id: doc.id,
                    data: doc.data(),
                  });

                  db.collection("invites").add({
                    coach: doc.id,
                    athlete: userDetails.id,
                    name: userDetails.data.name,
                    imageUrl: userDetails.data.imageUrl,
                    email: user,
                    phone: userDetails.data.phone,
                  });
                  alert("Invite Sent");
                  setInviteSent(true);
                  db.collection("CoachNotifications")
                    .doc(doc.id)
                    .collection("notifications")
                    .add(
                      {
                        message: `${userDetails?.data?.name} has sent a request to be your athlete! `,
                        seen: false,
                        timestamp:
                          firebase.firestore.FieldValue.serverTimestamp(),
                        athlete_id: userDetails.id,
                      },
                      { merge: true }
                    );
                });
              }
            })
            .catch(function (error) {
              console.log("Error getting documents: ", error);
            });
        }
      });
  };
  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (userData) {
      const data = [];
      db.collection("athletes")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((athlete) => {
            if (userData?.data?.listOfAthletes?.includes(athlete.id)) {
              let currentID = athlete.id;
              let appObj = { ...athlete.data(), ["id"]: currentID };
              data.push(appObj);
            }
          });
          setAthleteDetails(data);
        });
    }
  }, [user]);
  return (
    <div
      className="coachHome"
      style={{
        minHeight: "99vh",
      }}
    >
      <div className="coachHome__container" style={{ border: "none" }}>
        <div className="home__leftContainer" style={{ border: "none" }}>
          <div className="home__header">
            <div className="home__headerFirst">
              <h1>Hello, {userData?.data?.name}</h1>
            </div>
          </div>

          <div>
            <h3>Enter Coach ID</h3>
          </div>

          <div style={{ marginBottom: 20 }}>
            <input
              style={{
                borderRadius: 10,
                padding: 8,
              }}
              value={coachpin}
              onChange={(e) => {
                setcoachpin(e.target.value);
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              height: 30,
              marginBottom: 50,
            }}
          >
            <button
              style={{
                border: "none",
                outline: "none",
                width: 150,
                height: 40,
                marginRight: 50,
                backgroundColor: "#fcd11c",
                borderRadius: 7,
                boxShadow: "0px 0px 2px 0px rgb(0,0,0,0.2)",
              }}
              onClick={() => {
                sendInvite();
              }}
            >
              Send Invite
            </button>

            <button
              style={{
                border: "none",
                outline: "none",
                width: 100,
                height: 40,
                marginRight: 50,

                backgroundColor: "#fcd11c",
                borderRadius: 7,
                boxShadow: "0px 0px 2px 0px rgb(0,0,0,0.2)",
              }}
              onClick={() => {
                verifyUser();
              }}
            >
              Refresh
            </button>

            <button
              style={{
                border: "none",
                outline: "none",
                width: 100,
                height: 40,
                backgroundColor: "#fcd11c",
                borderRadius: 7,
                boxShadow: "0px 0px 2px 0px rgb(0,0,0,0.2)",
              }}
              onClick={() => {
                auth.signOut();
                dispatch(logout());
                history.push("/");
              }}
            >
              SignOut
            </button>
          </div>
        </div>
      </div>
      {/* <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <div className="modal__coachComponents">
          <div
            style={{ cursor: "pointer" }}
            className="modal__addAthelete"
            onClick={() => history.push("/invite-athlete")}
          >
            <div className="modal__addAthleteImg">
              {" "}
              <img src="/assets/Icon material-person-add.png" alt="" />
            </div>
            <h3>Add Athlete</h3>
          </div>
          <div
            className="modal__createNutritionPlans"
            onClick={() => history.push("/add-meal")}
            style={{ cursor: "pointer" }}
          >
            <div className="modal__createNutritionPlansImg">
              <img
                src="/assets/Icon awesome-hamburger.png"
                alt=""
                height="20px"
                width="20px"
              />
            </div>
            <h3>Create Nutrition Plans</h3>
          </div>
          <div
            className="modal__createWorkout"
            onClick={() => history.push("/create-workout")}
            style={{ cursor: "pointer" }}
          >
            <div className="modal__createWorkoutImg">
              <img src="/assets/Icon material-fitness-center.png" alt="" />
            </div>

            <h3>Create Workout</h3>
          </div>
          <div style={{ cursor: "pointer" }} className="modal__createEvent">
            <div
              className="modal__createEventImg"
              onClick={() => {
                history.push({
                  pathname: "/calendar",
                  // state:{
                  //   page: "CreateEvent"
                  // }
                });
              }}
            >
              {" "}
              <img src="/assets/Icon material-event.png" alt="" />
            </div>

            <h3>Create Event</h3>
          </div>
        </div>
        <div className="modal__closeButton" onClick={handleCloseDialog}>
          {" "}
          <CloseIcon style={{ cursor: "pointer" }} />
        </div>
      </Dialog> */}
    </div>
  );
}

export default AthleteOnBoarding;
