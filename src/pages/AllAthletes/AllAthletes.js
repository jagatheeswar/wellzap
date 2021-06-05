import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { selectUserData } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import "./AllAthletes.css";

function AllAthletes() {
  const history = useHistory();
  const userData = useSelector(selectUserData);
  const [athletes, setAthletes] = useState([]);
  useEffect(() => {
    if (userData?.id) {
      const data = [];
      db.collection("athletes")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((athlete) => {
            if (userData?.data.listOfAthletes.includes(athlete.id)) {
              let currentID = athlete.id;
              let appObj = { ...athlete.data(), ["id"]: currentID };
              data.push(appObj);
            }
          });
          setAthletes(data);
        });
    }
  }, [userData?.id]);

  return (
    <div className="allAthletes">
      <div className="allAthletes__info">
        <div
          className="allAthletes__backButton"
          onClick={() => history.goBack()}
        >
          <img src="/assets/left_arrow.png" alt="" width="15px" height="15px" />{" "}
        </div>
        <h1>All Athletes</h1>
        <div
          className="allAthletes__inviteAthletesButton"
          onClick={() => history.push("/invite-athlete")}
        >
          <img src="/assets/plus_thin.png" alt="" width="15px" height="15px" />
        </div>
      </div>

      {athletes.map((athlete) => (
        <div className="allAthletes__athletes">
          <img
            className="allAthletes__athleteslogo"
            src="/assets/userImage.jpeg"
            alt=""
            width="40px"
            height="40px"
          />
          <h1>{athlete.name}</h1>
          <img src="/assets/message.png" alt="" width="20px" height="20px" />
        </div>
      ))}
    </div>
  );
}

export default AllAthletes;
