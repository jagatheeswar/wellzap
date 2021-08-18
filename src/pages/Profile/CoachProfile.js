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
import CoachAssessment from "./AthleteAssessment";
import CoachProfileForm from "./CoachProfileForm";
import Header from "../../Components/Header/Header";
import "./Profile.css";
// import CoachMedicalAssessment from './AthleteMedicalAssessment';

function CoachProfile() {
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();
  const [athleteDetails, setAthleteDetails] = useState([]);

  console.log("ud", userData);
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
    <div className="coachProfile">
      <div className="coachProfile__container" style={{ marginBottom: 50 }}>
        <div className="coachProfile__leftContainer">
          <Header coachProfile={true} />
          {/* <CoachMedicalAssessment /> */}
          <CoachProfileForm />
        </div>
        {/* <div className="coachProfile__rightContainer">
                         <Notification /> 
                    </div>*/}
      </div>
    </div>
  );
}

export default CoachProfile;
