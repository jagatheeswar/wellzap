import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Notification from "../../Components/Notifications/Notification";
import PopupComponent from "../../Components/Popup/PopupComponent";
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
import "reactjs-popup/dist/index.css";
import Modal from "react-awesome-modal";
import { useHistory } from "react-router";
import CloseIcon from "@material-ui/icons/Close";

function Home() {
  const history = useHistory();
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();
  const [athleteDetails, setAthleteDetails] = useState([]);
  const [visible, setVisible] = useState(false);

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
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
    <div className="coachHome">
      <div className="coachHome__container">
        <div className="home__leftContainer">
          <div className="home__header">
            <div className="home__headerFirst">
              <h1>Hello, {userData?.data?.name}</h1>
              <h2>Here’s your progress summary.</h2>
            </div>
            <div className="fab__icon">
              {" "}
              <img
                src="/assets/fab.png"
                alt=""
                width="26px"
                height="26px"
                onClick={() => openModal()}
              />
              <Modal
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
              </Modal>
            </div>
          </div>
          <CoachHomeReports />
          <CoachDashboard />
        </div>
      </div>
    </div>
  );
}

export default Home;
