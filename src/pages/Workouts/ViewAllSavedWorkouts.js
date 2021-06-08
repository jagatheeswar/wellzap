import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import { selectUserData } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import WorkoutScreenHeader from "./WorkoutScreenHeader";

function ViewAllSavedWorkouts() {
  const userData = useSelector(selectUserData);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    if (userData) {
      db.collection("CoachWorkouts")
        .where("assignedById", "==", userData?.id)
        .where("assignedToId", "==", "")
        .onSnapshot((snapshot) => {
          setWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    }
  }, [userData?.id]);

  return (
    <div>
      <WorkoutScreenHeader name="Saved Templates" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "15px",
        }}
      >
        <div
          style={{
            width: "50%",
            marginTop: "20px",
            paddingLeft: "15px",
            paddingRight: "15px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {workouts.length > 0 ? (
            workouts?.map((item, idx) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <WorkoutCard
                  key={idx}
                  workouts={workouts}
                  item={item}
                  idx={idx}
                  navigation={"ViewAllSavedWorkouts"}
                />
              </div>
            ))
          ) : (
            <h5
              style={{
                fontSize: "12px",
                backgroundColor: "#fff",
                width: "100%",
                paddingTop: "10px",
                paddingRight: "10px",
                textAlign: "center",
                borderRadius: "5px",
              }}
            >
              There are no saved workouts for now
            </h5>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewAllSavedWorkouts;