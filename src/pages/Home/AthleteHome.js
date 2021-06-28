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
import AthleteDashboard from "./AthleteDashboard";
import AthleteHomeReports from "./AthleteHomeReports";
import "./Home.css";
import Modal from "react-awesome-modal";
import CloseIcon from "@material-ui/icons/Close";
import '../../fonts/Open_Sans/OpenSans-Regular.ttf'

function AthleteHome(props) {
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState(null);
  const [visible, setVisible] = useState(false);

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  useEffect(() => {
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

  return (
    <div className="athleteHome">
      <div className="athleteHome__container">
        <div className="home__leftContainer">
          <div className="home__header">
            <div className="home__headerFirst">
              <h1 style={{fontFamily: 'Open_Sans'}}>Hello, {userData?.data?.name}</h1>
              <h2 style={{fontFamily: 'Open_Sans'}}>Here’s your progress summary.</h2>
            </div>
            <div className="fab__icon" onClick={() => openModal()}>
              <img src="/assets/fab.png" alt="" width="26px" height="26px" />
              <Modal
                visible={visible}
                width="80%"
                height="300"
                effect="fadeInUp"
                onClickaway={() => closeModal()}
              >
                <div className="modal__athleteComponents">
                  <div className="modal__addWorkout">
                    <div className="modal__addWorkoutImg">
                      {" "}
                      <img
                        src="/assets/Icon material-fitness-center.png"
                        alt=""
                      />
                    </div>
                    <h3>Add Workout</h3>
                  </div>
                  <div className="modal__addGoal">
                    <div className="modal__addGoalImg">
                      {" "}
                      <img src="/assets/Icon ionic-ios-star.png" alt="" />
                    </div>
                    <h3>Add Goal</h3>
                  </div>
                  <div className="modal__addMeal">
                    <div className="modal__addMealImg">
                      <img
                        src="/assets/Icon awesome-hamburger.png"
                        alt=""
                        height="20px"
                        width="20px"
                      />
                    </div>
                    <h3>Add Meal</h3>
                  </div>
                  <div className="modal__logWeight">
                    <div className="modal__logWeightImg">
                      <img src="/assets/Icon awesome-weight.png" alt="" />
                    </div>

                    <h3>Log Weight</h3>
                  </div>
                  <div className="modal__viewReport">
                    <div className="modal__viewReportImg">
                      {" "}
                      <img src="/assets/Icon material-event.png" alt="" />
                    </div>

                    <h3>View Report</h3>
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
          <AthleteHomeReports />
          <AthleteDashboard selectedDate={props.selectedDate} />
        </div>
      </div>
    </div>
  );
}

export default AthleteHome;
