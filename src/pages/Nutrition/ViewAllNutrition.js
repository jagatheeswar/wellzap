import * as React from "react";
import { useSelector } from "react-redux";
import NutritionCard from "../../Components/NutritionCard/NutritionCard";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import NutritionScreenHeader from "./NutritionScreenHeader";

function ViewAllNutrition() {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [nutrition, setNutrition] = React.useState([]);
  const [type, setType] = React.useState("");
  const [athleteId, setAthleteId] = React.useState("");

  React.useEffect(() => {
    if (userData) {
      if (userType === "athlete") {
        db.collection("Food")

          .where("assignedTo_id", "==", athleteId)
          .where("saved", "==", false)
          .onSnapshot((snapshot) => {
            if (snapshot) {
              setNutrition(
                snapshot.docs.map((doc) => ({
                  id: doc.id,
                  data: doc.data(),
                }))
              );
            }
          });
      } else {
        if (athleteId) {
          db.collection("Food")
            .where("from_id", "==", userData?.id)
            .where("assignedTo_id", "==", athleteId)
            .where("saved", "==", false)
            .onSnapshot((snapshot) => {
              if (snapshot) {
                setNutrition(
                  snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                  }))
                );
              }
            });
        } else {
          db.collection("Food")
            .where("from_id", "==", userData?.id)
            .where("saved", "==", false)
            .onSnapshot((snapshot) => {
              if (snapshot) {
                setNutrition(
                  snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                  }))
                );
              }
            });
        }
      }
    }
  }, [userData?.id, athleteId]);

  return (
    <div>
      <NutritionScreenHeader name="Assigned Meal Plans" />
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
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {nutrition.length > 0 ? (
            nutrition?.map((food, idx) => (
              <NutritionCard
                key={idx}
                nutrition={nutrition}
                food={food}
                idx={idx}
                navigation={"ViewAllNutrition"}
                type="view"
              />
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
              There are no nutrition for now
            </h5>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewAllNutrition;
