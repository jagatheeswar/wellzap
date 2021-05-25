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

function AthleteHome() {
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState(null);

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
              <h1>Hello, {userData?.data?.name}</h1>
              <h2>Here’s your progress summary.</h2>
            </div>
            <div className="fab__icon">
              <img src="/assets/fab.png" alt="" width="26px" height="26px" />
            </div>
          </div>
          <AthleteHomeReports />
          <AthleteDashboard />
        </div>
      </div>
    </div>
  );
}

export default AthleteHome;
