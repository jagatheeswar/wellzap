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
import { useHistory } from "react-router-dom";
// import CoachMedicalAssessment from './AthleteMedicalAssessment';

function InvitesList() {
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();
  const [athleteDetails, setAthleteDetails] = useState([]);

  const [userDetails, setUserDetails] = useState(null);
  const [search, setSearch] = useState("");
  const [athletes, setAthletes] = useState([]);
  const history = useHistory();

  const [listOfAthletes, setListOfAthletes] = useState(null);

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

  useEffect(() => {
    var temp = [];
    const data = [];

    if (userData?.id) {
      db.collection("invites")
        .where("coach", "==", userData?.id)
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((item) => {
            let currentID = item.id;
            let appObj = { ...item.data(), ["id"]: currentID };
            console.log(appObj);
            data.push(appObj);
            temp.push(
              <div
                key={appObj.name}
                activeOpacity={0.5}
                onClick={() => {
                  history.push({
                    pathname: "/invite",
                    state: {
                      data: item.data(),
                      id: item.id,
                    },
                  });
                }}
              >
                <div
                  className="athlete__item"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 20,
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      flexDirection: "row",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={appObj?.imageUrl}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 100,
                        alignSelf: "center",
                      }}
                    />
                    <div style={{ marginLeft: 30 }}>
                      <div
                        style={{
                          fontSize: 15,
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        {appObj?.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          });
          setAthleteDetails(data);
          setAthletes(temp);
        });
    }
  }, [userData]);
  return (
    <div className="coachProfile" style={{ minHeight: "99.99vh" }}>
      <div className="coachProfile__container">
        <div className="coachProfile__leftContainer">
          <Header />
          {athletes}
        </div>
      </div>
    </div>
  );
}

export default InvitesList;
