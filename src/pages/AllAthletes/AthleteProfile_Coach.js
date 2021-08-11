import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Notification from "../../Components/Notifications/Notification";
import {
  selectUser,
  selectUserData,
  selectUserType,
  setUserData,
  setTemperoryID,
} from "../../features/userSlice";
import { db } from "../../utils/firebase";
import Header from "../../Components/Header/Header";
import "./Profile.css";
import AthleteProfileForm from "./AthleteProfileForm";
import AthleteAssessments from "./AthleteAssessments";
import AthleteMeasurements from "../Profile/AthleteMeasurements";
import { useHistory, useParams, useLocation } from "react-router-dom";

function AthleteProfile_coach() {
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();
  const [athleteDetails, setAthleteDetails] = useState([]);
  const history = useHistory();
  const location = useLocation();

  if (!location?.state?.AthleteId) {
    history.push("/all-athletes");
    window.history.pushState(null, "", "/all-athletes");
  }
  var Id = location?.state?.AthleteId;
  //console.log(params, Id);

  // var history = useHistory();
  //window.history.pushState(null, "", "/all-athletes/profile");

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
          <Header Id={Id} />
          <AthleteProfileForm AthleteId={Id} />

          {location?.state?.AthleteId ? <AthleteAssessments Id={Id} /> : ""}
        </div>
      </div>
    </div>
  );
}

export default AthleteProfile_coach;
