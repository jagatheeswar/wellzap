import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { formatDate } from "../../functions/formatDate";
import { db } from "../../utils/firebase";
import PaymentsScreenHeader from "./PaymentsScreenHeader";

function AthletePayments() {
  const userData = useSelector(selectUserData);
  const [workouts, setWorkouts] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (userData) {
        /*
      db.collection("CoachWorkouts")
        .where("assignedById", "==", userData?.id)
        .where("saved", "==", false)
        .limit(3)
        .onSnapshot((snapshot) => {
          setWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
      db.collection("CoachWorkouts")
        .where("assignedById", "==", userData?.id)
        .where("assignedToId", "==", "")
        .limit(5)
        .onSnapshot((snapshot) => {
          setSavedWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
        */
    }
  }, [userData?.id]);


  return (
    <div className="workouts__home">
      <div className="coachDashboard__leftContainer">
        <PaymentsScreenHeader name="Payments" />

        <div className="workouts__homeContainer">
          <div className="workouts__homeLeftContainer">
            <p>gagan</p>
          </div>
          <div className="workouts__homeRightContainer">
            <p>gagan</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AthletePayments;
