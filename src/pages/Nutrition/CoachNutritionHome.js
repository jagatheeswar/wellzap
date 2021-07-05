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
        .limit(4)
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
    }
  }, [userData?.id]);

  return (
    <div style={{ minHeight: "99vh" }} className="coachNutritionHome">
      <NutritionScreenHeader name="Nutrition" />
      <Grid container spacing={2} className="coachNutrition__homeContainer">
        <Grid item xs={6} className="coachNutrition__homeLeftContainer">
          <div
            style={{ width: "90%", paddingLeft: 15 }}
            className="coachNutrition__row"
          >
            <h1>Assigned Meal Plans</h1>
            <div onClick={() => history.push("/view-all-nutrition")}>
              View All
            </div>
          </div>
          <div
            style={{ width: "90%", paddingLeft: 15 }}
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
                />
              ))
            ) : (
              <h5 className="no-upcoming-food-text">
                There are no assigned meal plans.
              </h5>
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
                />
              ))
            ) : (
              <h5 className="no-upcoming-food-text">
                There are no saved meal plans.
              </h5>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default CoachNutritionHome;
