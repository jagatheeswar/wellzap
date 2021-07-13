import * as React from "react";
import { useSelector } from "react-redux";
import NutritionCard from "../../Components/NutritionCard/NutritionCard";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import NutritionScreenHeader from "./NutritionScreenHeader";

import SearchIcon from "@material-ui/icons/Search";

import ClearIcon from "@material-ui/icons/Clear";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

function ViewAllNutrition() {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [nutrition, setNutrition] = React.useState([]);
  const [type, setType] = React.useState("");
  const [athleteId, setAthleteId] = React.useState("");
  const [assignedMealplans, setassignedMealplans] = React.useState(null);

  const [search, setsearch] = React.useState("");
  const [SearchList, setSearchList] = React.useState(null);
  const [SearchLoading, SetSearhLoading] = React.useState(false);

  const [sorting, setsorting] = React.useState("desc");
  React.useEffect(() => {
    if (userData) {
      if (userType === "athlete") {
        db.collection("Food")
          .where("assignedTo_id", "==", userData?.id)
          .where("saved", "==", false)
          //.orderBy("date", sorting)
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
            .orderBy("timestamp", sorting)
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
            // .orderBy("timestamp", sorting)
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
  }, [userData?.id, athleteId, sorting]);

  React.useEffect(() => {
    setSearchList(assignedMealplans);
    console.log(assignedMealplans);
  }, [assignedMealplans]);

  React.useEffect(async () => {
    if (search?.length > 0) {
      const names = await assignedMealplans?.filter((workout) => {
        return workout.data.nutrition.nutritionName
          .toLowerCase()
          .includes(search.toLowerCase());
      });

      setSearchList(names);
      SetSearhLoading(false);
    } else {
      setSearchList(assignedMealplans);
      SetSearhLoading(false);
    }
  }, [search, assignedMealplans]);

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

  const options = [
    { value: "asc", label: "Recent" },
    { value: "desc", label: "old" },
  ];

  return (
    <div style={{ minHeight: "99.7vh" }}>
      <NutritionScreenHeader name="Assigned Meal Plans" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            margin: 20,
            backgroundColor: "white",
            padding: 5,
            display: "flex",
            alignItems: "center",
            border: "1px solid black",
            width: "500px",
            borderRadius: 10,
          }}
        >
          <input
            value={search}
            style={{
              width: "100%",

              fontSize: 20,
              outline: "none",
              border: "none",
            }}
            onChange={(e) => {
              setsearch(e.target.value);
            }}
          />
          {search?.length == 0 ? (
            <SearchIcon
              style={{
                width: 30,
                height: 30,
              }}
            />
          ) : (
            <div
              onClick={() => {
                setsearch("");
              }}
            >
              <ClearIcon
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </div>
          )}
        </div>

        <div
          style={{
            width: 150,
            marginLeft: "auto",
          }}
        >
          <Dropdown
            options={options}
            placeholder="Order By"
            onChange={(s) => {
              setsorting(s.value);
            }}
          />
        </div>
      </div>
      {search.length > 0 && (
        <div
          style={{
            fontSize: 13,
            marginLeft: 20,
          }}
        >
          {SearchList?.length} search results loaded
        </div>
      )}
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

          {SearchList?.length > 0 ? (
            SearchList?.map((food, idx) => (
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
