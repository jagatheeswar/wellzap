import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { selectUserData } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import "./AllAthletes.css";
import {Typography} from "@material-ui/core";
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';

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
    <div style={{minHeight: "99.7vh"}} className="allAthletes">
      <div className="allAthletes__info">
      <div onClick={() => history.goBack()} style={{marginTop: 20, display: "flex", alignItems: 'center'}} >
          <ArrowBackIosRoundedIcon style={{height: 18, width: 18, padding: 5, cursor: "pointer"}} />
          <Typography variant="h6" style={{fontSize: 25, marginLeft: 5}}>All Athletes</Typography>
        </div>
        <div
        style={{marginTop: 20}}
          className="allAthletes__inviteAthletesButton"
          onClick={() => history.push("/invite-athlete")}
        >
          <img src="/assets/plus_thin.png" alt="" width="15px" height="15px" />
        </div>
      </div>

      {athletes.map((athlete) => (
        <div className="allAthletes__athletes">
          <div style={{display: "flex", alignItems: "center"}}>
          <img
            className="allAthletes__athleteslogo"
            src="/assets/userImage.jpeg"
            alt=""
            width="40px"
            height="40px"
          />
          <p style={{fontSize: 18, fontWeight: "500", marginLeft: 20}}>
            {athlete.name}
          </p>
          </div>
          <div style={{display: "flex", alignItems: "center"}}>
          <img
            onClick={() =>
              history.push({
                pathname: "/messaging",
                state: {
                  id: null,
                  from_id: userData?.id,
                  to_id: athlete.id,
                  from_name: userData?.data.name,
                  to_name: athlete?.name,
                  type: "coach",
                },
              })
            }
            src="/assets/message.png" alt="" width="20px" height="20px" style={{cursor: "pointer"}} />
          <button onClick={() => history.push("/Athlete/" + athlete.id)} style={{marginLeft: 20, outline: "none", border: "none", padding: "5px 10px", backgroundColor: "#fcd54a", borderRadius: 8, cursor: "pointer"}}>View Profile</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AllAthletes;
