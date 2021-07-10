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
  const [assignedMealplans, setassignedMealplans] = React.useState(null);

  React.useEffect(() => {
    if (userData) {
      if (userType === "athlete") {
        db.collection("Food")
          .where("assignedTo_id", "==", userData?.id)
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

  React.useEffect(async () => {
    let data = {};
    var data1 = [];
    if (nutrition) {
      nutrition.forEach((item) => {
        item.data.selectedDays.forEach((val) => {
          let temp = [];
          temp = { ...item };
          temp["currentdate"] = val;
          data1.push(temp);
        });
      });
    }
    setassignedMealplans(data1);
  }, [nutrition]);

  return (
    <div style={{ minHeight: "99.7vh" }}>
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
          {console.log(nutrition)}
          {assignedMealplans?.length > 0 ? (
            assignedMealplans?.map((food, idx) => (
              <NutritionCard
                key={idx}
                nutrition={nutrition}
                food={food}
                idx={idx}
                navigation={"ViewAllNutrition"}
                type="view"
                selectedDate={food.currentdate}
              />
            ))
          ) : (
            <div
              style={{
                backgroundColor: "#fff",
                width: "100%",
                height: 90,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "5px",
              }}
            >
              <h5
                style={{
                  fontSize: "12px",
                  fontWeight: "normal",
                }}
              >
                There are no nutrition for now
              </h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewAllNutrition;
