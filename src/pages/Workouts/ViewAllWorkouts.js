import * as React from "react";
import { useSelector } from "react-redux";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import WorkoutScreenHeader from "./WorkoutScreenHeader";

function ViewAllWorkouts() {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [workouts, setWorkouts] = React.useState([]);
  const [type, setType] = React.useState("");
  const [athleteId, setAthleteId] = React.useState("");
  const [completed, setCompleted] = React.useState(false);

  React.useEffect(() => {
    if (userData) {
      if (userType === "athlete") {
        db.collection("workouts")
          .where("assignedToId", "==", userData?.id)
          .where("completed", "==", true)
          //.orderBy("date","desc")
          .onSnapshot((snapshot) => {
            setWorkouts(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }))
            );
          });
      } else {
        if (type && athleteId) {
          db.collection("workouts")
            .where("assignedToId", "==", athleteId)
            .where("saved", "==", false)
            .where("completed", "==", completed)
            .onSnapshot((snapshot) => {
              if (snapshot) {
                console.log("Inside snapshot");
                setWorkouts(
                  snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                  }))
                );
              } else {
                console.log("outside snapshot");
                setWorkouts([]);
              }
            });
        } else {
          db.collection("CoachWorkouts")
            .where("assignedById", "==", userData?.id)
            .where("saved", "==", false)
            .onSnapshot((snapshot) => {
              setWorkouts(
                snapshot.docs.map((doc) => ({
                  id: doc.id,
                  data: doc.data(),
                }))
              );
            });
        }
      }
    }
  }, [userData?.id, athleteId]);

  return (
    <div style={{minHeight: "99.7vh"}}>
      <WorkoutScreenHeader name="Upcoming Workouts" />
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
                  navigation={"ViewAllWorkouts"}
                  showDate={true}
                  type="non-editable"
                  completed={
                    userType === "athlete" || completed === true ? true : false
                  }
                />
              </div>
            ))
          ) : (
            <div
              style={{
                backgroundColor: "#fff",
                width: "100%",
                height: 90,
                display: 'flex',
                alignItems: 'center',
                justifyContent: "center",
                borderRadius: "5px",
              }}
            >
              <h5>There are no workouts for now</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewAllWorkouts;
