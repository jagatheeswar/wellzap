import * as React from "react";
import { useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import NutritionCard from "../../Components/NutritionCard/NutritionCard";
import NutritionScreenHeader from "./NutritionScreenHeader";

function ViewAllSavedNutrition(props) {
  const userData = useSelector(selectUserData);
  const [nutrition, setNutrition] = React.useState([]);

  React.useEffect(() => {
    if (userData) {
      db.collection("Food")
        .where("from_id", "==", userData?.id)
        .where("assignedTo_id", "==", "")
        .onSnapshot((snapshot) => {
          setNutrition(
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
      <NutritionScreenHeader name="Saved Meal Plans" />
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
                type={true}
                isLongTerm={props?.isLongTerm}
                handleCloseNutrition={props?.handleCloseNutrition}
                setWeeks={props?.setWeeks}
                weeks={props?.weeks}
                selectedWeekNum={props?.selectedWeekNum}
                selectedDay={props?.selectedDay}
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
              There are no saved nutrition for now
            </h5>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewAllSavedNutrition;
