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
import Header from "../../Components/Header/Header";
import "./Profile.css";
import AthleteProfileForm from "./AthleteProfileForm";
import AthleteAssessments from "./AthleteAssessments";
import AthleteMeasurements from "./AthleteMeasurements";

function AthleteProfile() {
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
    <div className="athleteProfile">
      <div className="athleteProfile__container">
        <div className="athleteProfile__leftContainer">
          <Header athlete={userData?.data.name} />
          <AthleteProfileForm />
          <AthleteAssessments />
        </div>
        <div className="athleteProfile__rightContainer"></div>
      </div>
    </div>
  );
}

export default AthleteProfile;
