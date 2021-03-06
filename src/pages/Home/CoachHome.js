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

function Home(props) {
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
    <div className="coachHome" style={{width:'100%'}}>
      <div className="coachHome__container">
        <div className="home__leftContainer">
          <div className="home__header">
            <div className="home__headerFirst">
              <h1>Hello, {userData?.data?.name}</h1>
              <h2>Here???s your progress summary.</h2>
            </div>
            <div className="fab__icon">
              {" "}
              <img
                src="/assets/fab.png"
                alt=""
                width="32px"
                height="32px"
                // onClick={() => openModal()}
                onClick={handleClickOpenDialog}
              />
              {/* <Modal
                visible={visible}
                width="80%"
                height="300"
                effect="fadeInUp"
                onClickAway={() => closeModal()}
              >
                <div className="modal__coachComponents">
                  <div
                    className="modal__addAthelete"
                    onClick={() => history.push("/all-athletes")}
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
                  >
                    <div className="modal__createWorkoutImg">
                      <img
                        src="/assets/Icon material-fitness-center.png"
                        alt=""
                      />
                    </div>

                    <h3>Create Workout</h3>
                  </div>
                  <div className="modal__createEvent">
                    <div className="modal__createEventImg">
                      {" "}
                      <img src="/assets/Icon material-event.png" alt="" />
                    </div>

                    <h3>Create Event</h3>
                  </div>
                </div>
                <div
                  className="modal__closeButton"
                  onClick={() => closeModal()}
                >
                  {" "}
                  <CloseIcon />
                </div>
              </Modal> */}
            </div>
          </div>
          <CoachHomeReports />
          <CoachDashboard selectedDate={props.selectedDate} />
        </div>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <div className="modal__coachComponents">
          <div
            style={{cursor: "pointer"}} 
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
            style={{cursor: "pointer"}} 
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
            style={{cursor: "pointer"}} 
          >
            <div className="modal__createWorkoutImg">
              <img src="/assets/Icon material-fitness-center.png" alt="" />
            </div>

            <h3>Create Workout</h3>
          </div>
          <div 
            style={{cursor: "pointer"}} 
            className="modal__createEvent"
          >
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
          <CloseIcon style={{cursor: "pointer"}} />
        </div>
      </Dialog>
    </div>
  );
}

export default Home;
