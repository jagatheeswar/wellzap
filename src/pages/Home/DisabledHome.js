import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Notification from "../../Components/Notifications/Notification";

import {
  selectUser,
  selectUserData,
  selectUserType,
  setUserData,
} from "../../features/userSlice";
import { db } from "../../utils/firebase";
import CoachDashboard from "./CoachDashboard";
import CoachHomeReports from "./CoachHomeReports";
import "./Home.css";

import Modal from "react-awesome-modal";
import { useHistory } from "react-router";
import CloseIcon from "@material-ui/icons/Close";

import moment from "moment";
import { Dialog, Grid } from "@material-ui/core";

function DisabledHome(props) {
  const history = useHistory();
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();
  const [athleteDetails, setAthleteDetails] = useState([]);
  const [visible, setVisible] = useState(false);

  console.log("coachHome", new Date(props.selectedDate));

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
    db.collection("coaches")
      .where("email", "==", user)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
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
            <h3> Please clear all your dues to continue</h3>
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
              onClick={() => {}}
            >
              Click Here to Pay
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
                props.reload(!props.active);
              }}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
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
      </Dialog>
    </div>
  );
}

export default DisabledHome;
