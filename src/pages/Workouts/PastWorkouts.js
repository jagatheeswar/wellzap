import React from 'react'
import { db } from "../../utils/firebase";
import { useSelector } from "react-redux";
import { selectUserData, selectUserType } from "../../features/userSlice";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import WorkoutScreenHeader from "./WorkoutScreenHeader";

function PastWorkouts() {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [workouts, setWorkouts] = React.useState([]);
  const [pastWorkouts, setPastWorkouts] = React.useState([]);
  React.useEffect(() => {
    if (userData) {
      db.collection("workouts")
        .where("assignedToId", "==", userData?.id)
        //.where("date", "==", formatDate())
        .where("completed", "==", false)
        .limit(4)
        .onSnapshot((snapshot) => {
          setWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      db.collection("workouts")
        .where("assignedToId", "==", userData?.id)
        .where("completed", "==", true)
        .limit(4)
        .onSnapshot((snapshot) => {
          setPastWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    }
  }, [userData?.id]);
  return (
    <div style={{minHeight: "99.7vh"}}>
      <WorkoutScreenHeader name="Past Workouts" />
      <div style={{width: "50%", marginLeft: 20}}>
        { pastWorkouts.length > 0 ? (
        pastWorkouts?.map((workout, i) => (
          <WorkoutCard
            key={workout.id}
            workouts={workouts}
            item={workout}
            idx={i}
            type={"non-editable"}
            completed={true}
          />
        ))) : (
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
            <h5 style={{
              fontSize: "12px",
              fontWeight: 'normal'
            }}>There are no Past Workouts for now</h5>
          </div>
        )}
      </div>
    </div>
  )
}

export default PastWorkouts;
