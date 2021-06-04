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

function Home() {
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();
  const [athleteDetails, setAthleteDetails] = useState([]);

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
            <div className="fab__icon" onClick={console.log("clicked")}>
              <img
                src="/assets/fab.png"
                alt=""
                width="26px"
                height="26px"
                onClick={console.log("clicked")}
              />
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
