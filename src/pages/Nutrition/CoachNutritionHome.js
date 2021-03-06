import React, { useEffect, useState } from "react";
import NutritionScreenHeader from "./NutritionScreenHeader";
import "./Nutrition.css";
import { useHistory } from "react-router";
import { selectUserData } from "../../features/userSlice";
import { useSelector } from "react-redux";
import { db } from "../../utils/firebase";
import NutritionCard from "../../Components/NutritionCard/NutritionCard";
import { Grid } from "@material-ui/core";

function CoachNutritionHome() {
  const history = useHistory();
  const userData = useSelector(selectUserData);
  const [nutrition1, setNutrition1] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [savedNutrition, setSavedNutrition] = useState([]);
  const [savedLongTermNutrition, setsavedLongTermNutrition] = useState([]);
  const [LongTermNutrition, setLongTermNutrition] = useState([]);
  useEffect(() => {
    if (nutrition1) {
      let temp = [];

      nutrition1.map((n, i) => {
        if (temp.length === 0) {
          temp.push(n);
        } else {
          temp.map((t, idx) => {
            if (t.data.id !== n.data.id) {
              temp.push(n);
            }
          });
        }
      });
      setNutrition(temp);
    }
  }, [nutrition1]);

  useEffect(() => {
    if (userData) {
      db.collection("Food")
        .where("from_id", "==", userData?.id)
        .where("saved", "==", false)
        .limit(3)
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

      db.collection("Food")
        .where("from_id", "==", userData?.id)
        .where("assignedTo_id", "==", "")
        .limit(4)
        .onSnapshot((snapshot) => {
          setSavedNutrition(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      db.collection("longTermMeal")
        .where("assignedById", "==", userData?.id)
        .where("assignedToId", "==", "")
        .limit(4)
        .onSnapshot((snapshot) => {
          setsavedLongTermNutrition(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      db.collection("longTermMeal")
        .where("assignedById", "==", userData?.id)
        .where("saved", "==", false)

        .onSnapshot((snapshot) => {
          setLongTermNutrition(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    }
  }, [userData?.id]);

  useEffect(() => {
    console.log(LongTermNutrition);
  }, [LongTermNutrition]);
  return (
    <div style={{ minHeight: "99vh" }} className="coachNutritionHome">
      <NutritionScreenHeader name="Nutrition" />

      <div
        style={{
          marginTop: 20,
        }}
      >
        <Grid container spacing={2} className="coachNutrition__homeContainer">
          <Grid item xs={6} className="coachNutrition__homeLeftContainer">
            <div
              style={{ width: "90%", paddingLeft: 20 }}
              className="coachNutrition__row"
            >
              <h1>Assigned Meal Plans</h1>
              <div onClick={() => history.push("/view-all-nutrition")}>
                View All
              </div>
            </div>
            <div
              style={{ width: "90%", paddingLeft: 20 }}
              className="coachNutrition__list"
            >
              {nutrition.length > 0 ? (
                nutrition?.map((food, idx) => (
                  <NutritionCard
                    key={idx}
                    nutrition={nutrition}
                    food={food}
                    idx={idx}
                    type="view"
                    foodId={food.id}
                  />
                ))
              ) : (
                <div
                  style={{
                    fontSize: "13px",
                    backgroundColor: "#fff",

                    padding: "10px 20px",
                    textAlign: "center",
                    borderRadius: "5px",
                    fontWeight: "normal",

                    boxSizing: "border-box",
                    marginTop: 20,
                  }}
                >
                  <h5> There are no assigned Meals for now </h5>
                </div>
              )}
            </div>
          </Grid>
          <Grid item xs={6} className="coachNutrition__homeRightContainer">
            <div style={{ width: "90%" }} className="coachNutrition__row">
              <h1>Saved Meal Plans</h1>
              <div onClick={() => history.push("/view-all-saved-nutrition")}>
                View All
              </div>
            </div>
            <div style={{ width: "90%" }} className="coachNutrition__list">
              {savedNutrition.length > 0 ? (
                savedNutrition?.map((food, idx) => (
                  <NutritionCard
                    key={idx}
                    nutrition={nutrition}
                    food={food}
                    idx={idx}
                    foodId={food.id}
                  />
                ))
              ) : (
                <div
                  style={{
                    fontSize: "13px",
                    backgroundColor: "#fff",

                    padding: "10px 20px",
                    textAlign: "center",
                    borderRadius: "5px",
                    fontWeight: "normal",
                    marginTop: 10,

                    boxSizing: "border-box",
                  }}
                >
                  <h5> There are no Saved meals for now </h5>
                </div>
              )}
            </div>
          </Grid>

          <Grid item xs={6} className="coachNutrition__homeLeftContainer">
            <div
              style={{ width: "90%", marginLeft: 20 }}
              className="coachNutrition__row"
            >
              <h1>Assigned LongTerm Plans</h1>
              <div onClick={() => history.push("/all-LongTerm-Nutrition")}>
                View All
              </div>
            </div>
            <div
              style={{ width: "90%", marginLeft: 20 }}
              className="coachNutrition__list"
            >
              {LongTermNutrition.length > 0 ? (
                LongTermNutrition?.map((food, idx) => (
                  <NutritionCard
                    key={idx}
                    weeks={food.data.weeks}
                    isLongTerm={true}
                    idx={idx}
                    food={food.data}
                    selectedWeekNum={food.data.weeks[0].weeknum}
                    navigate={true}
                    type="view"
                    nutritionName={food?.data?.nutritionName}
                    foodId={food.id}
                  />
                ))
              ) : (
                <div
                  style={{
                    fontSize: "13px",
                    backgroundColor: "#fff",

                    padding: "10px 20px",
                    textAlign: "center",
                    borderRadius: "5px",
                    fontWeight: "normal",
                    marginTop: 10,

                    boxSizing: "border-box",
                  }}
                >
                  <h5> There are no Assigned LongTerm Meals for now </h5>
                </div>
              )}
            </div>
          </Grid>

          <Grid item xs={6} className="coachNutrition__homeRightContainer">
            <div style={{ width: "90%" }} className="coachNutrition__row">
              <h1>Saved LongTerm Plans</h1>
              <div
                onClick={() => history.push("/all-saved-LongTerm-Nutrition")}
              >
                View All
              </div>
            </div>
            <div style={{ width: "90%" }} className="coachNutrition__list">
              {console.log("slt", savedLongTermNutrition)}
              {savedLongTermNutrition.length > 0 ? (
                savedLongTermNutrition?.map((food, idx) => (
                  <NutritionCard
                    key={idx}
                    weeks={food.data.weeks}
                    isLongTerm={true}
                    idx={idx}
                    food={food.data}
                    selectedWeekNum={food.data.weeks[0].weeknum}
                    navigate={true}
                    nutritionName={food?.data?.nutritionName}
                    foodId={food.id}
                  />
                ))
              ) : (
                <div
                  style={{
                    fontSize: "13px",
                    backgroundColor: "#fff",

                    padding: "10px 20px",
                    textAlign: "center",
                    borderRadius: "5px",
                    fontWeight: "normal",
                    marginTop: 10,

                    boxSizing: "border-box",
                  }}
                >
                  <h5> There are no Saved LongTerm meals for now </h5>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default CoachNutritionHome;
